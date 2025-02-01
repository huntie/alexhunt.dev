import Image from 'next/image';
import FollowButton from './FollowButton.tsx';

type Props = Readonly<{
  title: string;
  bio: string;
  imageUrl: string;
  twitterHandle: string;
}>;

export default function Hero({
  title,
  bio,
  imageUrl,
  twitterHandle,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col items-start mb-30">
      <Image
        className="mb-24 rounded-full bg-light-grey"
        width="45"
        height="45"
        src={imageUrl}
        alt="Profile image"
        priority
      />
      <h1 className="mb-8 font-display font-bold text-primary">{title}</h1>
      <p className="mb-20 text-primary">{bio}</p>
      <FollowButton handle={twitterHandle} />
    </div>
  );
}
