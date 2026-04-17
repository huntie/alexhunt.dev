'use client';

import type { FeedItem as FeedItemType } from '../content/types.tsx';

import { ArrowUpRightIcon } from '@heroicons/react/16/solid';
import { parseISO } from 'date-fns';
import FeedItem from '../components/FeedItem.tsx';

type Props = Readonly<{
  initialItems: Array<FeedItemType>;
}>;

/**
 * Content feed (client component).
 */
export default function Feed({ initialItems }: Props) {
  const featured = initialItems[0];
  const cards = initialItems.slice(1, 3);
  const remaining = initialItems.slice(3);
  const yearGroups = groupByYear(remaining);

  return (
    <div>
      {featured != null ? (
        <div className="mb-60">
          <FeedItem item={featured} variant="featured" />
        </div>
      ) : null}
      {cards.length > 0 ? (
        <div className="@container mb-60">
          <div className="grid grid-cols-1 gap-60 @[400px]:grid-cols-2 @[400px]:gap-24">
            {cards.map(item => (
              <FeedItem key={item.id} item={item} variant="card" />
            ))}
          </div>
        </div>
      ) : null}
      {yearGroups.map(([year, items], index) => (
        <div key={year} className={index > 0 ? 'mt-40' : ''}>
          <p className="text-primary font-body mt-8 mb-16 text-sm">{year}</p>
          {items.map(item => (
            <FeedItem key={item.id} item={item} variant="row" />
          ))}
        </div>
      ))}
      <div className="mt-60 pb-40 md:pb-0">
        <a
          className="bg-grey-lightest text-secondary hover:bg-grey-light flex w-full items-center justify-center gap-4 rounded-xl py-12 text-sm transition duration-150"
          href="https://x.com/huntie/highlights"
        >
          View more highlights
          <ArrowUpRightIcon className="size-[14px]" />
        </a>
      </div>
    </div>
  );
}

function groupByYear(
  items: Array<FeedItemType>,
): Array<[number, Array<FeedItemType>]> {
  const groups = new Map<number, Array<FeedItemType>>();
  for (const item of items) {
    const year = parseISO(item.date).getFullYear();
    let group = groups.get(year);
    if (group == null) {
      group = [];
      groups.set(year, group);
    }
    group.push(item);
  }
  return Array.from(groups.entries());
}
