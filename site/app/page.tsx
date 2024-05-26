import FeedItem from '../components/FeedItem.tsx';

export default function Home() {
  return (
    <>
      {[
        {
          date: '2024-04-22',
          type: 'link',
          label: '🎤 Talk / Podcast',
          title: 'Behind the Scenes of the React Native 0.74 Release',
          url: 'https://www.callstack.com/podcasts/behind-the-scenes-of-react-native-0-74-release',
          attachment:
            'https://img.youtube.com/vi/bLHubdUE2Ew/maxresdefault.jpg',
        },
        {
          date: '2024-04-22',
          type: 'link',
          label: '⚛️ React Native Releases',
          title:
            'React Native 0.74 - Yoga 3.0, Bridgeless New Architecture, and more',
          content:
            "Today we're releasing React Native 0.74! This release adds Yoga 3.0, Bridgeless by default under the New Architecture, batched onLayout updates (New Architecture), and Yarn 3 as the default package manager for new projects.",
          url: 'https://reactnative.dev/blog/2024/04/22/release-0.74',
          attachment: 'https://reactnative.dev/img/logo-og.png',
        },
        {
          date: '2023-05-12',
          type: 'post',
          url: 'https://x.com/alxhnt/status/1656972152871206913',
          content:
            "So happy to have delivered my first talk for @reactnative and @MetroBundler! We're really happy to be back in the community and to be working hard on improving developer experience for React Native users.",
        },
      ].map(item => (
        // TODO: Implement dynamic feed
        // @ts-ignore
        <FeedItem key={item.url} item={item} />
      ))}
    </>
  );
}
