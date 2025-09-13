import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export function richTextToPlain(
  richText: Array<RichTextItemResponse>,
): string | null {
  const plainText = richText.map(text => text.plain_text).join('');

  return plainText.length ? plainText : null;
}
