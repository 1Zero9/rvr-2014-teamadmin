export interface PhotoAlbum {
  id: string;
  title: string;
  shareUrl: string;
  coverUrl: string;
  photoCount: number;
  albumDate: string;
  photographer: string;
  matchOpponent?: string | null;
  samplePhotos?: string[];
  createdAt: string;
}

export const INITIAL_PHOTO_ALBUMS: PhotoAlbum[] = [
  {
    id: 'album-2026-08-29-greystones',
    title: '2026-08-29 RVR U13 Greystones Home',
    shareUrl: 'https://photos.app.goo.gl/nn4kZwjcy5eLXyMA9',
    coverUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200',
    photoCount: 57,
    albumDate: '29 Aug 2026',
    photographer: 'Team Dad & Official Photographer',
    matchOpponent: 'Greystones United AFC',
    samplePhotos: [
      'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200',
      'https://lh3.googleusercontent.com/pw/AP1GczNVYkF1p-XK6gNXcL-vaj7-Q4NoFNF5SXvbOnGHy93qy9etjhzqKlba-Pfn1e3uE9SCgaHOPnn3kjWVxw36eJOB70u3WWZYk8Nhp4HzoQi_e0D7e9Hv=w1200',
      'https://lh3.googleusercontent.com/pw/AP1GczONa8JDuCdpsCBl2paC9dQIC472CHlcpAlwYEK-6-zr0IpC5PmrtygfGrAKwz619uwS2u4dExBCRqtNj4fCnftMBjjoE2emPhWr9BfH5v-CDLqF5kav=w1200',
      'https://lh3.googleusercontent.com/pw/AP1GczPSgZb6zIwpwjMDKfMLE7kC3ZNDGpfc3MxExDN9R9M7prlQvTO1FcchyuuFYTu_59xW0CgHa3hRhqKf5wCpnGd3MW84NGmjcaCm1-AHtScBy4VTNj4C=w1200',
    ],
    createdAt: '2026-08-29T18:00:00.000Z',
  },
  {
    id: 'album-2026-08-25-tournament',
    title: '2026-08-25 RVR U13 Home Tournament',
    shareUrl: 'https://photos.app.goo.gl/wzUJycZj1Bj6iw138',
    coverUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPpMlX6fWQ1oJmGnQRmj3vF_Cfd3BHX_3kSSjqt5COg08EBGv9Ahywd7yzaZE9dRbD70lw3C57tZPAFlYBw_1g_XolszgWNqY_0vg79eUcMcGGQIh-a=w1200',
    photoCount: 44,
    albumDate: '25 Aug 2026',
    photographer: 'Team Dad & Official Photographer',
    matchOpponent: 'Pre-Season Home Tournament',
    samplePhotos: [
      'https://lh3.googleusercontent.com/pw/AP1GczPpMlX6fWQ1oJmGnQRmj3vF_Cfd3BHX_3kSSjqt5COg08EBGv9Ahywd7yzaZE9dRbD70lw3C57tZPAFlYBw_1g_XolszgWNqY_0vg79eUcMcGGQIh-a=w1200',
    ],
    createdAt: '2026-08-25T18:00:00.000Z',
  },
];
