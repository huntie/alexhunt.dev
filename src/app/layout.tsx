import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import Hero from '../components/Hero.tsx';
import SocialLinks from '../components/SocialLinks.tsx';
import getProperties from '../content/getProperties.tsx';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const { bio } = await getProperties();

  return {
    description: bio,
    title: 'Alex Hunt – Software Engineer',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { bio } = await getProperties();

  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <div className="max-w-560 md:max-w-1800 mx-auto md:flex">
          <header className="flex flex-col mx-30 py-60 md:justify-between md:h-screen md:max-w-325 md:ml-40 md:py-80 lg:mx-85">
            <Hero
              title="Alex Hunt"
              bio={bio}
              imageUrl="/profile.jpg"
              twitterHandle="huntie"
            />
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
        <Analytics />
      </body>
    </html>
  );
}
