import type { FeedItem as FeedItemType } from '../content/types.tsx';

import { differenceInCalendarDays, format, isToday, parseISO } from 'date-fns';
import Image from 'next/image';

type Props = Readonly<{
  item: FeedItemType;
  variant: 'featured' | 'card' | 'row';
}>;

export default function FeedItem({
  item: { type, title, content, date, url, imageUrl },
  variant,
}: Props) {
  if (variant === 'row') {
    return (
      <article className="group relative z-0 mb-22">
        <a
          className="text-secondary group-hover:bg-grey-lightest absolute -top-8 -right-16 -bottom-8 -left-16 -z-10 block rounded-xl transition duration-150"
          href={url}
        />
        <div className="pointer-events-none flex items-baseline gap-16">
          <time className="text-tertiary font-body min-w-60 shrink-0 text-xs" dateTime={date}>
            {formatDate(date, false)}
          </time>
          <span className="text-secondary font-body min-w-0 truncate text-sm">
            {title ?? content}
          </span>
        </div>
      </article>
    );
  }

  const showImage = imageUrl != null;
  const isCard = variant === 'card';

  return (
    <article className="group relative z-0">
      <a
        className={`text-secondary group-hover:bg-grey-lightest absolute -top-16 -bottom-16 -z-10 block rounded-xl text-sm transition duration-150${isCard ? ' -right-12 -left-12' : ' -right-16 -left-16'}`}
        href={url}
      />
      <div
        className={`pointer-events-none flex flex-col items-start${isCard ? ' h-full' : ''}`}
      >
        <div className="mb-8 flex items-center">
          <p className="text-secondary font-body mr-16 text-xs">
            <time dateTime={date}>{formatDate(date)}</time>
          </p>
        </div>
        {title != null ? (
          <h2
            className={`text-primary font-display mb-4 pr-8 font-medium${isCard ? ' line-clamp-3' : ''}`}
          >
            {title}
          </h2>
        ) : null}
        {content != null ? (
          <p
            className={`text-primary font-display pr-8${isCard ? ' line-clamp-3' : ' whitespace-pre-wrap'}`}
          >
            {type === 'post' ? formatPost(content) : content}
          </p>
        ) : null}
        {isCard ? <div className="min-h-18 grow" /> : null}
        {showImage ? (
          <div
            className={`bg-light-grey relative overflow-hidden rounded-lg${
              isCard
                ? ' aspect-video self-stretch'
                : ' mt-18 aspect-video w-full md:max-w-[400px]'
            }`}
          >
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

function formatDate(date: string, showYear = true): string {
  const parsed = parseISO(date);

  if (isToday(parsed)) {
    return 'Today';
  }

  const daysAgo = differenceInCalendarDays(new Date(), parsed);

  return daysAgo < 7
    ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
    : format(parsed, showYear ? 'dd MMM yyyy' : 'dd MMM');
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
