type Props = Readonly<{
  handle: string;
}>;

export default function FollowButton({ handle }: Props) {
  return (
    <a
      className="bg-social-x flex items-center rounded-full px-12 text-white transition duration-150 hover:opacity-80"
      href={`https://x.com/intent/follow?&screen_name=${handle}`}
      rel="noreferrer"
      target="_blank"
    >
      <svg
        className="my-[6px] mr-[9px] block"
        fill="currentColor"
        width="14"
        height="14"
        viewBox="0 0 16 16"
      >
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
      </svg>
      <span className="font-600 block text-xs font-semibold">
        Follow @{handle}
      </span>
    </a>
  );
}
