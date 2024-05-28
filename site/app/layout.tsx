import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Hero from '../components/Hero.tsx';
import SocialLinks from '../components/SocialLinks.tsx';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// TODO: Fetch from Notion
const bio =
  'React Native at Meta. Loves dev tooling and productivity hacks. Avid climber and snowboarder. Optimist.';

export const metadata: Metadata = {
  title: 'Alex Hunt – Software Engineer',
  description: bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-560 md:max-w-1800 mx-auto md:flex">
          <header className="flex flex-col mx-30 py-60 md:justify-between md:h-screen md:max-w-325 md:ml-40 md:py-80 lg:mx-85">
            <Hero title="Alex Hunt" bio={bio} imageUrl="/profile.jpg" />
            <SocialLinks
              links={[
                'https://github.com/huntie',
                'https://instagram.com/instahuntie',
              ]}
            />
          </header>
          <main className="flex flex-1 flex-col items-center px-30 md:h-screen md:overflow-y-scroll md:pl-16 md:-ml-16 md:py-80 lg:pr-85">
            <div className="md:max-w-560">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
