import Image from 'next/image';
import FollowButton from './FollowButton.tsx';

type Props = Readonly<{
  title: string;
  bio: string;
  imageUrl: string;
}>;

export default function Hero({ title, bio, imageUrl }: Props): JSX.Element {
  return (
    <div className="flex flex-col items-start mb-30">
      <Image
        className="mb-24 rounded-full"
        width="45"
        height="45"
        src={imageUrl}
        alt="Profile image"
      />
      <h1 className="mb-8 font-display font-bold text-primary">{title}</h1>
      <p className="mb-18 text-primary">{bio}</p>
      <FollowButton handle="alxhnt" />
    </div>
  );
}
