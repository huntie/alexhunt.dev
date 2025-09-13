import getFeed from '../content/getFeed.tsx';
import Feed from './Feed.tsx';

export default async function Home() {
  const feed = await getFeed();

  return <Feed initialItems={feed} />;
}
