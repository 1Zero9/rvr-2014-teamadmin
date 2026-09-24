import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { PwaRegistration } from './components/pwa-registration';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://finns-football.vercel.app'),
  title: "Finn's Football",
  description: "Finn's private football match, league and scouting desk.",
  icons: { icon: '/rvr-crest.png', apple: '/rvr-crest.png' },
  openGraph: {
    title: "Finn's Football",
    description: "Finn's private football desk.",
    images: ['/hero-squad.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Finn's Football",
    description: "Finn's private football desk.",
    images: ['/hero-squad.jpg'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}><PwaRegistration />{children}</body></html>; }
