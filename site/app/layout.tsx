import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Hero from '../components/Hero.tsx';
import SocialLinks from '../components/SocialLinks.tsx';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alex Hunt',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="mx-30 my-60">
          <Hero
            title={metadata.title as string}
            bio="React Native at Meta. Loves dev tooling and productivity hacks. Avid climber and snowboarder. Optimist."
            imageUrl="/profile.jpg"
          />
          <SocialLinks
            links={[
              'https://github.com/huntie',
              'https://instagram.com/instahuntie',
            ]}
          />
        </header>
        <main className="flex flex-col m-30">{children}</main>
      </body>
    </html>
  );
}
