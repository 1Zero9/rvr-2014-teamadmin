import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://rvr-2014-teamadmin.vercel.app'),
  title: 'Rivervalley Rangers U13 Major 1 | 2014 Squad Hub',
  description: 'Official player hub, video skills drills, live DDSL scores, matchday preparation, and team portal for Rivervalley Rangers AFC U13 Major 1 (2014 Squad).',
  icons: { icon: '/rvr-crest.png', apple: '/rvr-crest.png' },
  openGraph: {
    title: 'Rivervalley Rangers U13 Major 1 | 2014 Squad Hub',
    description: 'Player hub, skills drills, live DDSL scores & team management for RVR U13 Major 1.',
    images: ['/hero-squad.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rivervalley Rangers U13 Major 1 | 2014 Squad Hub',
    description: 'Player hub, skills drills, live DDSL scores & team management for RVR U13 Major 1.',
    images: ['/hero-squad.jpg'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}>{children}</body></html>; }
