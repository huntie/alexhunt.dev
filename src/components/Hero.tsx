import Image from 'next/image';
import FollowButton from './FollowButton.tsx';

type Props = Readonly<{
  bio: string;
  imageUrl: string;
  title: string;
  twitterHandle: string;
}>;

export default function Hero({ bio, imageUrl, title, twitterHandle }: Props) {
  return (
    <div className="flex flex-col items-start mb-30">
      <Image
        alt="Profile image"
        className="mb-24 rounded-full bg-light-grey"
        height="45"
        priority
        src={imageUrl}
        width="45"
      />
      <h1 className="mb-8 font-display font-bold text-primary">{title}</h1>
      <p className="mb-20 text-primary">{bio}</p>
      <FollowButton handle={twitterHandle} />
    </div>
  );
}
