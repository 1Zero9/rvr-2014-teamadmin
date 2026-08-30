import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://rvr-2014-team-admin.dexincognito.chatgpt.site'),
  title: 'RVR 2014 Team Admin',
  description: 'Private team fund, accounts and information hub for Rivervalley Rangers 2014.',
  icons: { icon: '/rvr-crest.png', apple: '/rvr-crest.png' },
  openGraph: { title: 'RVR 2014 Team Admin', description: 'Team fund, accounts & information', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'RVR 2014 Team Admin', description: 'Team fund, accounts & information', images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}>{children}</body></html>; }
