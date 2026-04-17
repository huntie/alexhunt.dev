'use server';

import { isFullPage } from '@notionhq/client';
import { put } from '@vercel/blob';
import invariant from 'invariant';
import { unstable_cache } from 'next/cache';
import { createHash } from 'node:crypto';
import path from 'node:path';
import openGraph from 'open-graph-scraper';
import Logger from '../utils/Logger';
import { notion } from './notion';

const logger = new Logger('server:cacheFeedImage');

const EMPTY_CONTENT_MARKER = 'no-content.json';
const ONE_YEAR = 60 * 60 * 24 * 365;

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

    logger.debug(
      'Cache miss. Page id: %s, lastEditedTime: %s, imageKey: %s',
      id,
      lastEditedTime,
      imageKey,
    );

    const sourceImageUrl = await resolveFeedItemPreview({ id, lastEditedTime });
    if (sourceImageUrl == null) {
      await put(cachePrefix + '/' + EMPTY_CONTENT_MARKER, '{}', {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: ONE_YEAR,
      });
      return null;
    }

    // Fetch remote image
    const response = await fetch(sourceImageUrl, { cache: 'no-store' });
    if (!response.ok) {
      logger.warn('Failed to fetch image:', sourceImageUrl);
      return null;
    }

    const cachePath =
      cachePrefix + '/preview' + path.extname(new URL(sourceImageUrl).pathname);

    try {
      // Upload to Vercel Blob
      const result = await put(cachePath, response.body!, {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: ONE_YEAR,
      });
      logger.debug(
        'Successfully uploaded preview image to Vercel Blob. Blob path: %s',
        cachePath,
      );
      return result.url;
    } catch (error) {
      logger.error('Failed to process image:', error);
      return null;
    }
  },
  ['cacheFeedImage'],
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
