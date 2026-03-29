export type FeedItem = {
  id: string;
  date: string;
  type: 'link' | 'post';
  label: string | null;
  url: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
};
