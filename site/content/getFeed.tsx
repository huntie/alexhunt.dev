'use server';

import type { FeedItem } from './types';

import { isFullPage } from '@notionhq/client';
import invariant from 'invariant';
import { cache } from 'react';
import { notion } from './notion';

const FEED_DATABASE_ID = '341919861c8447ea8a6ae36b0ad8c730';

const NONEMPTY_FILTER = {
  is_not_empty: true as true,
};

type Options = Readonly<{
  startCursor?: string;
  pageSize?: number;
}>;

const getFeed = cache(
  async ({ startCursor, pageSize = 10 }: Options = {}): Promise<
    Array<FeedItem>
  > => {
    const response = await notion.databases.query({
      database_id: FEED_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Date',
            date: NONEMPTY_FILTER,
          },
          {
            property: 'Type',
            select: NONEMPTY_FILTER,
          },
          {
            property: 'URL',
            url: NONEMPTY_FILTER,
          },
          {
            or: [
              {
                property: 'Title',
                title: NONEMPTY_FILTER,
              },
              {
                property: 'Content',
                rich_text: NONEMPTY_FILTER,
              },
            ],
          },
        ],
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
        {
          property: 'Type',
          direction: 'descending',
        },
      ],
      start_cursor: startCursor,
      page_size: pageSize,
    });
    const items = [];

    for (const page of response.results) {
      if (!isFullPage(page)) {
        continue;
      }

      invariant(
        page.properties['Date']?.type === 'date',
        'Expected property "Date" to be of type "date"',
      );
      invariant(
        page.properties['Type']?.type === 'select',
        'Expected property "Type" to be of type "select"',
      );
      invariant(
        page.properties['Label']?.type === 'select',
        'Expected property "Label" to be of type "select"',
      );
      invariant(
        page.properties['URL']?.type === 'url',
        'Expected property "URL" to be of type "url"',
      );
      invariant(
        page.properties['Title']?.type === 'title',
        'Expected property "Title" to be of type "title"',
      );
      invariant(
        page.properties['Content']?.type === 'rich_text',
        'Expected property "Content" to be of type "rich_text"',
      );
      invariant(
        page.properties['Attachment']?.type === 'files',
        'Expected property "Attachment" to be of type "files"',
      );

      const attachment = page.properties['Attachment'].files[0];

      const item: FeedItem = {
        id: page.id,
        date: page.properties['Date'].date!.start,
        type: page.properties['Type'].select!.name === 'Post' ? 'post' : 'link',
        label: page.properties['Label'].select?.name ?? null,
        url: page.properties['URL'].url!,
        title: page.properties['Title'].title[0]?.plain_text,
        content: page.properties['Content'].rich_text
          .map(text => text.plain_text)
          .join(''),
        attachment: attachment?.type == 'file' ? attachment.file.url : null,
      };

      items.push(item);
    }

    return items;
  },
);

export default getFeed;
