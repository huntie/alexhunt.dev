'use server';

import { isFullPage } from '@notionhq/client';
import { list, put } from '@vercel/blob';
import Debug from 'debug';
import invariant from 'invariant';
import { unstable_cache } from 'next/cache';
import { createHash } from 'node:crypto';
import path from 'node:path';
import openGraph from 'open-graph-scraper';
import { notion } from './notion';

const debug = Debug('server:cacheFeedImage');

const EMPTY_CONTENT_MARKER = 'no-content.json';

type FeedItemKey = {
  id: string;
  lastEditedTime: string;
};

/**
 * Cache the preview image for the given feed item on the server/CDN.
 */
const cacheFeedImage = unstable_cache(
  async ({ id, lastEditedTime }: FeedItemKey): Promise<string | null> => {
    const imageKey = createHash('sha256')
      .update(id + '-' + lastEditedTime)
      .digest('hex')
      .slice(0, 16);
    const cachePrefix = 'feed_v2/' + imageKey;

    debug(
      'Cache miss, checking for existing blob. Page ID: %s, Cache prefix: %s',
      id,
      cachePrefix,
    );

    // Check for existing blob
    const {
      blobs: [cachedImage],
    } = await list({ prefix: cachePrefix });

    if (cachedImage != null) {
      return path.basename(cachedImage.pathname) !== EMPTY_CONTENT_MARKER
        ? cachedImage.url
        : null;
    }

    debug('No previous image found in cache. Page ID: %s', id);

    const sourceImageUrl = await resolveFeedItemPreview({ id, lastEditedTime });
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
      debug(
        'Successfully uploaded preview image to Vercel Blob. Blob path: %s',
        cachePath,
      );
      return result.url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to process image:', error);
      return null;
    }
  },
);

async function resolveFeedItemPreview({
  id,
}: FeedItemKey): Promise<string | null> {
  const page = await notion.pages.retrieve({
    page_id: id,
  });

  if (!isFullPage(page)) {
    return null;
  }
  invariant(
    page.properties['URL']?.type === 'url',
    'Expected property "URL" to be of type "url"',
  );
  invariant(
    page.properties['Image']?.type === 'files',
    'Expected property "Image" to be of type "files"',
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

export default cacheFeedImage;
