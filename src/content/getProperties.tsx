'use server';

import { isFullPage } from '@notionhq/client';
import invariant from 'invariant';
import { unstable_cache } from 'next/cache';
import { notion } from './notion';

const PROPERTIES_DATABASE_ID = '57bb578c629a411695fb9df41600b0af';
const CACHE_DURATION = 60 * 5; // 5 minutes

const getProperties = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const response = await notion.databases.query({
      database_id: PROPERTIES_DATABASE_ID,
    });
    const properties: Record<string, string> = {};

    for (const page of response.results) {
      if (!isFullPage(page)) {
        continue;
      }

      invariant(
        page.properties['Key']?.type === 'title',
        'Expected property "Key" to be of type "title"',
      );
      invariant(
        page.properties['Value']?.type === 'rich_text',
        'Expected property "Value" to be of type "rich_text"',
      );

      const key = page.properties['Key'].title[0].plain_text;

      if (key != null) {
        properties[key] = page.properties['Value'].rich_text[0].plain_text;
      }
    }

    return properties;
  },
  [],
  {
    revalidate: CACHE_DURATION,
  },
);

export default getProperties;
