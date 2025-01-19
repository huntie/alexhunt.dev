import type { FeedItem as FeedItemType } from '../content/types.tsx';

import { differenceInCalendarDays, format, isToday, parseISO } from 'date-fns';
import Image from 'next/image';

type Props = Readonly<{
  item: FeedItemType;
}>;

export default function FeedItem({
  item: { type, title, content, date, url, label, imageUrl },
}: Props): JSX.Element {
  return (
    <article className="group relative z-0 mb-60">
      <a
        className="absolute block -z-10 -top-16 -bottom-16 -left-16 -right-16 rounded-md text-secondary text-sm transition duration-150 group-hover:bg-grey-lightest"
        href={url}
      />
      <div className="flex flex-col items-start pointer-events-none">
        <div className="flex items-center mb-8">
          <p className="mr-16 text-secondary text-xs font-body">
            <time dateTime={date}>{formatDate(date)}</time>
            {type === 'post' ? <>&ensp;•&ensp;View on X</> : null}
          </p>
          {label != null ? (
            <span className="px-8 py-2 rounded-md bg-grey-light text-secondary text-xs">
              {label}
            </span>
          ) : null}
        </div>
        {title != null ? (
          <h2 className="mb-4 pr-8 text-primary font-display font-medium">
            {title}
          </h2>
        ) : null}
        {content != null ? (
          <p className="pr-8 text-primary font-display">
            {type === 'post' ? formatPost(content) : content}
          </p>
        ) : null}
        {imageUrl != null ? (
          <div className="relative aspect-video h-140 md:h-180 mt-18 rounded-md bg-light-grey overflow-hidden">
            <Image
              className="object-cover"
              src={imageUrl}
              alt={type === 'post' ? 'Post image' : 'Link preview'}
              fill
              sizes="640px,960px" // @2x, @3x
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function formatDate(date: string): string {
  const parsed = parseISO(date);

  if (isToday(parsed)) {
    return 'Today';
  }

  const daysAgo = differenceInCalendarDays(new Date(), parsed);

  return daysAgo < 7
    ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
    : format(parsed, 'dd MMM yyyy');
}

function formatPost(post: string): JSX.Element {
  const highlightRegex = /[@#$]\w+|https?:\/\/\S+/g;
  const elements = [];

  let match;
  let lastMatchEnd = 0;

  while ((match = highlightRegex.exec(post)) != null) {
    if (match.index > lastMatchEnd) {
      elements.push(post.slice(lastMatchEnd, match.index));
    }

    const token = match[0];
    let url;

    if (token.startsWith('@')) {
      url = `https://x.com/${token}`;
    } else if (token.match(/^[#$]/)) {
      url = `https://x.com/search?q=${token}`;
    } else {
      url = token;
    }

    elements.push(
      <a
        key={match.index}
        href={url}
        className="text-link pointer-events-auto hover:brightness-90 dark:hover:brightness-110"
      >
        {token}
      </a>,
    );
    lastMatchEnd = match.index + token.length;
  }

  elements.push(post.slice(lastMatchEnd));

  return <>{elements}</>;
}
