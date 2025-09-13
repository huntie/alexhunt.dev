import type { FeedItem as FeedItemType } from '../content/types.tsx';

import { differenceInCalendarDays, format, isToday, parseISO } from 'date-fns';
import Image from 'next/image';

type Props = Readonly<{
  item: FeedItemType;
}>;

export default function FeedItem({
  item: { type, title, content, date, url, label, imageUrl, embed },
}: Props) {
  const isBlockLink = embed == null;

  return (
    <article className="group relative z-0 mb-60">
      {isBlockLink ? (
        <a
          className="text-secondary group-hover:bg-grey-lightest absolute -top-16 -right-16 -bottom-16 -left-16 -z-10 block rounded-md text-sm transition duration-150"
          href={url}
        />
      ) : null}
      <div
        className={`flex flex-col items-start ${isBlockLink ? 'pointer-events-none' : ''}`}
      >
        <div className="mb-8 flex items-center">
          <p className="text-secondary font-body mr-16 text-xs">
            <time dateTime={date}>{formatDate(date)}</time>
            {type === 'post' ? <>&ensp;•&ensp;View on X</> : null}
          </p>
          {label != null ? (
            <span className="bg-grey-light text-secondary rounded-md px-8 py-2 text-xs">
              {label}
            </span>
          ) : null}
        </div>
        {title != null ? (
          <h2 className="text-primary font-display mb-4 pr-8 font-medium">
            {title}
          </h2>
        ) : null}
        {content != null ? (
          <p className="text-primary font-display pr-8 whitespace-pre-wrap">
            {type === 'post' ? formatPost(content) : content}
          </p>
        ) : null}
        {imageUrl != null ? (
          <div className="bg-light-grey relative mt-18 aspect-video h-140 overflow-hidden rounded-md md:h-180">
            <Image
              className="object-cover"
              src={imageUrl}
              alt={type === 'post' ? 'Post image' : 'Link preview'}
              fill
              sizes="640px,960px" // @2x, @3x
            />
          </div>
        ) : null}
        {embed != null ? (
          <div
            className="mt-18 self-stretch"
            dangerouslySetInnerHTML={{ __html: embed }}
          />
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

function formatPost(post: string) {
  const highlightRegex = /[#$@]\w+|https?:\/\/\S+/g;
  const elements = [];

  let match: RegExpExecArray | null;
  let lastMatchEnd = 0;

  while ((match = highlightRegex.exec(post)) != null) {
    if (match.index > lastMatchEnd) {
      elements.push(post.slice(lastMatchEnd, match.index));
    }

    const token = match[0];
    let url: string;

    if (token.startsWith('@')) {
      url = `https://x.com/${token}`;
    } else if (token.match(/^[#$]/)) {
      url = `https://x.com/search?q=${token}`;
    } else {
      url = token;
    }

    elements.push(
      <a
        className="text-link pointer-events-auto hover:brightness-90 dark:hover:brightness-110"
        key={match.index}
        href={url}
      >
        {token}
      </a>,
    );
    lastMatchEnd = match.index + token.length;
  }

  elements.push(post.slice(lastMatchEnd));

  return <>{elements}</>;
}
