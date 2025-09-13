type Props = Readonly<{
  links: Array<string>;
}>;

export default function SocialLinks({ links }: Props) {
  return (
    <nav className="flex flex-col items-start">
      {links.map(link => (
        <a
          className="flex mb-4 -ml-8 -mt-4 px-8 py-4 rounded-md text-secondary text-sm transition duration-150 hover:bg-grey-lightest"
          href={link}
          key={link}
        >
          {link.replace(/^https:\/\//, '')}
        </a>
      ))}
    </nav>
  );
}
