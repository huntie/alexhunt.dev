type Props = Readonly<{
  title: string;
  bio: string;
}>;

export default function Hero({ title, bio }: Props): JSX.Element {
  return (
    <div>
      <h1 className="mb-8 font-display font-bold text-primary">{title}</h1>
      <p>{bio}</p>
    </div>
  );
}
