import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { HeadBlobResult, PutBlobResult } from '@vercel/blob';

import { head, put } from '@vercel/blob';
import invariant from 'invariant';
import { createHash } from 'node:crypto';
import path from 'node:path';

/**
 * Cache the preview image for the given feed item on the server/CDN.
 */
export default async function cacheFeedImage(
  page: PageObjectResponse,
): Promise<string | null> {
  invariant(
    page.properties['Image']?.type === 'files',
    'Expected property "Image" to be of type "files"',
  );

  const sourceImage = page.properties['Image'].files[0];
  if (sourceImage == null || sourceImage.type !== 'file') {
    // TODO: Fetch Open Graph image when no image is explicitly attached
    return null;
  }

  const imageKey = createHash('sha256')
    .update(page.id + '-' + page.last_edited_time)
    .digest('hex')
    .slice(0, 16);
  const cachePath = 'feed/' + imageKey + path.extname(sourceImage.name);

  let result: HeadBlobResult | PutBlobResult;

  try {
    // Attempt to read existing blob
    result = await head(cachePath);
  } catch {
    // Fetch remote image
    const response = await fetch(sourceImage.file.url, { cache: 'no-store' });
    if (!response.ok) {
      console.warn('Failed to fetch image:', sourceImage.file.url);
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
