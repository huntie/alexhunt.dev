import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { HeadBlobResult, PutBlobResult } from '@vercel/blob';

import { head, put } from '@vercel/blob';
import invariant from 'invariant';
import { createHash } from 'node:crypto';
import path from 'node:path';
import openGraph from 'open-graph-scraper';

/**
 * Cache the preview image for the given feed item on the server/CDN.
 */
export default async function cacheFeedImage(
  page: PageObjectResponse,
): Promise<string | null> {
  invariant(
    page.properties['URL']?.type === 'url',
    'Expected property "URL" to be of type "url"',
  );
  invariant(
    page.properties['Image']?.type === 'files',
    'Expected property "Image" to be of type "files"',
  );

  let sourceImageUrl: string | null = null;
  const customImage = page.properties['Image'].files[0];

  if (customImage?.type === 'file') {
    // Use image field from Notion page
    sourceImageUrl = customImage.file.url;
  } else if (page.properties['URL'].url != null) {
    // Check for Open Graph image
    const metadata = await openGraph({
      url: page.properties['URL'].url,
    });
    const [ogImage] = metadata.result.ogImage ?? [];
    sourceImageUrl = ogImage?.url;
  }

  if (sourceImageUrl == null) {
    return null;
  }

  const imageKey = createHash('sha256')
    .update(page.id + '-' + page.last_edited_time)
    .digest('hex')
    .slice(0, 16);
  const cachePath =
    'feed/' + imageKey + path.extname(new URL(sourceImageUrl).pathname);

  let result: HeadBlobResult | PutBlobResult;

  try {
    // Attempt to read existing blob
    result = await head(cachePath);
  } catch {
    // Fetch remote image
    const response = await fetch(sourceImageUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.warn('Failed to fetch image:', sourceImageUrl);
      return null;
    }

    try {
      // Upload to Vercel Blob
      result = await put(cachePath, response.body!, {
        access: 'public',
        addRandomSuffix: false,
      });
    } catch (e) {
      console.error('Failed to process image:', e);
      return null;
    }
  }

  return result.url;
}
