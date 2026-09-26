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
    // rvr-crest.png has text running edge-to-edge, so it fails 'maskable'
    // safe-zone requirements - Android would crop the crest text off when
    // applying an adaptive-icon mask. 'any' lets the OS show it unmasked.
    icons: [
      { src: '/rvr-crest.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
    ],
  };
}
