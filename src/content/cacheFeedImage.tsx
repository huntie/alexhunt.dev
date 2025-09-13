import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { list, put } from '@vercel/blob';
import invariant from 'invariant';
import { unstable_cache } from 'next/cache';
import { createHash } from 'node:crypto';
import path from 'node:path';
import openGraph from 'open-graph-scraper';

const EMPTY_CONTENT_MARKER = 'no-content.json';

/**
 * Cache the preview image for the given feed item on the server/CDN.
 */
const cacheFeedImage = unstable_cache(
  async (page: PageObjectResponse): Promise<string | null> => {
    const imageKey = createHash('sha256')
      .update(page.id + '-' + page.last_edited_time)
      .digest('hex')
      .slice(0, 16);
    const cachePrefix = 'feed_v2/' + imageKey;

    // Check for existing blob
    const {
      blobs: [cachedImage],
    } = await list({ prefix: cachePrefix });

    if (cachedImage != null) {
      return path.basename(cachedImage.pathname) !== EMPTY_CONTENT_MARKER
        ? cachedImage.url
        : null;
    }

    const sourceImageUrl = await resolveFeedItemPreview(page);
    if (sourceImageUrl == null) {
      await put(cachePrefix + '/' + EMPTY_CONTENT_MARKER, '{}', {
        access: 'public',
        addRandomSuffix: false,
      });
      return null;
    }

    // Fetch remote image
    const response = await fetch(sourceImageUrl, { cache: 'no-store' });
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch image:', sourceImageUrl);
      return null;
    }

    const cachePath =
      cachePrefix + '/preview' + path.extname(new URL(sourceImageUrl).pathname);

    try {
      // Upload to Vercel Blob
      const result = await put(cachePath, response.body!, {
        access: 'public',
        addRandomSuffix: false,
      });

      return result.url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to process image:', error);
      return null;
    }
  },
);

export default cacheFeedImage;

async function resolveFeedItemPreview(
  page: PageObjectResponse,
): Promise<string | null> {
  invariant(
    page.properties['Image']?.type === 'files',
    'Expected property "Image" to be of type "files"',
  );
  invariant(
    page.properties['URL']?.type === 'url',
    'Expected property "URL" to be of type "url"',
  );

  // Check custom image field in page
  const customImage = page.properties['Image'].files[0];
  if (customImage?.type === 'file') {
    return customImage.file.url;
  }
  // Fall back to Open Graph image
  const metadata = await openGraph({
    url: page.properties['URL'].url!,
  });
  const [ogImage] = metadata.result.ogImage ?? [];

  return ogImage?.url;
}
