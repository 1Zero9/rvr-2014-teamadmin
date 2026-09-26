import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finn's Team",
    short_name: "Finn's Team",
    description: "Finn's private team, league and scouting desk.",
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
