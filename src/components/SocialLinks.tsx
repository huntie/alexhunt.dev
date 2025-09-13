type Props = Readonly<{
  links: Array<string>;
}>;

export default function SocialLinks({ links }: Props) {
  return (
    <nav className="flex flex-col items-start">
      {links.map(link => (
        <a
          className="text-secondary hover:bg-grey-lightest -mt-4 mb-4 -ml-8 flex rounded-md px-8 py-4 text-sm transition duration-150"
          key={link}
          href={link}
        >
          {link.replace(/^https:\/\//, '')}
        </a>
      ))}
    </nav>
  );
}
