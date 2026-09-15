export interface EventData {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  isoDate: string; // Used for chronological sorting
  imageUrl: string;
  source: 'Ticketmaster' | 'Posh' | 'PR' | 'Tech';
}

export const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'Neon Nights Festival',
    description: 'An exclusive underground electronic music festival featuring top DJs from around the world.',
    latitude: 41.8827,
    longitude: -87.6233,
    date: 'Friday, 10 PM',
    isoDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    source: 'Ticketmaster',
  },
  {
    id: '2',
    title: 'Brand Activation: CyberDrink',
    description: 'Invite-only tasting event for the newest energy drink hitting the Chicago market.',
    latitude: 41.8902,
    longitude: -87.6241,
    date: 'Saturday, 7 PM',
    isoDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
    source: 'PR',
  },
  {
    id: '3',
    title: 'Afterhours @ The Grid',
    description: 'Exclusive afterparty for industry insiders. Secret location revealed upon RSVP.',
    latitude: 41.8756,
    longitude: -87.6244,
    date: 'Saturday, 2 AM',
    isoDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=800&auto=format&fit=crop',
    source: 'Posh',
  },
  {
    id: '4',
    title: 'Founders & Hackers Mixer',
    description: 'A networking event for founders, developers, and creatives in the Chicago tech scene.',
    latitude: 41.8844,
    longitude: -87.6322,
    date: 'Thursday, 6 PM',
    isoDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    source: 'Tech',
  }
];
