'use client';

import type { FeedItem as FeedItemType } from '../content/types.tsx';

import FeedItem from '../components/FeedItem.tsx';

type Props = Readonly<{
  initialItems: Array<FeedItemType>;
}>;

const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH ?? 'unknown';

/**
 * Content feed (client component).
 */
export default function Feed({ initialItems }: Props) {
  return (
    <div>
      {initialItems.map(item => (
        <FeedItem key={item.id} item={item} />
      ))}
      <div className="pb-40 md:pb-0">
        <a
          className="bg-grey-lightest text-secondary hover:bg-grey-light block w-full rounded-xl py-12 text-center text-sm transition duration-150"
          href="https://x.com/huntie/highlights"
        >
          View more highlights
        </a>
        <p className="text-tertiary mt-24 text-center text-xs">
          <a
            className="hover:text-secondary transition duration-150"
            href="https://github.com/huntie/alexhunt.dev"
          >
            alexhunt.dev@{commitHash}
          </a>
        </p>
      </div>
    </div>
  );
}
