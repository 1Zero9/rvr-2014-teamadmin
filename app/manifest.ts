import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RVR Match Desk',
    short_name: 'RVR Desk',
    description: 'Private match, league and scouting desk for RVR 2014.',
    start_url: '/portal',
    scope: '/',
    display: 'standalone',
    background_color: '#06172d',
    theme_color: '#06172d',
    icons: [
      { src: '/rvr-crest.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
      { src: '/rvr-crest.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
