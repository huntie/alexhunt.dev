'use client';

import type { FeedItem as FeedItemType } from '../content/types.tsx';

import FeedItem from '../components/FeedItem.tsx';

type Props = Readonly<{
  initialItems: Array<FeedItemType>;
}>;

/**
 * Content feed (client component). Receives a list of `initialItems` and
 * fetches additional items on scroll.
 */
export default function Feed({ initialItems }: Props) {
  // TODO: Item fetching on scroll
  return (
    <div>
      {initialItems.map(item => (
        <FeedItem item={item} key={item.id} />
      ))}
    </div>
  );
}
