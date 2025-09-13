import Image from 'next/image';
import FollowButton from './FollowButton.tsx';

type Props = Readonly<{
  title: string;
  bio: string;
  imageUrl: string;
  twitterHandle: string;
}>;

export default function Hero({ title, bio, imageUrl, twitterHandle }: Props) {
  return (
    <div className="mb-30 flex flex-col items-start">
      <Image
        className="bg-light-grey mb-24 rounded-full"
        width="45"
        height="45"
        src={imageUrl}
        alt="Profile image"
        priority
      />
      <h1 className="font-display text-primary mb-8 font-bold">{title}</h1>
      <p className="text-primary mb-20">{bio}</p>
      <FollowButton handle={twitterHandle} />
    </div>
  );
}
