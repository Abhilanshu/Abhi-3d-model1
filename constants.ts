import { Artwork } from './types';

// Mock data for the gallery
export const ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    title: 'The Silent Void',
    artist: 'Elena Vossen',
    year: '2023',
    medium: 'Oil on Canvas',
    description: 'A study of negative space and the emotional weight of silence. Vossen uses deep indigos and blacks to create a void that feels both empty and full.',
    imageUrl: 'https://picsum.photos/id/10/800/600',
    position: [-4, 2, -5],
    rotation: [0, 0.3, 0],
    dimensions: [3, 2.25]
  },
  {
    id: 'art-2',
    title: 'Chromatic Echo',
    artist: 'Marcus Thorne',
    year: '2021',
    medium: 'Acrylic & Digital',
    description: 'Thorne explores the intersection of digital noise and organic brushstrokes. The vibrant hues vibrate against the neutral background, suggesting a digital echo.',
    imageUrl: 'https://picsum.photos/id/28/600/800',
    position: [0, 2, -6],
    rotation: [0, 0, 0],
    dimensions: [2.5, 3.3]
  },
  {
    id: 'art-3',
    title: 'Winter Solstice',
    artist: 'Sarah Jenkins',
    year: '2019',
    medium: 'Watercolor',
    description: 'Capturing the bleak yet beautiful light of mid-winter. The stark contrast between the snow and the barren trees evokes a sense of quiet resilience.',
    imageUrl: 'https://picsum.photos/id/29/800/500',
    position: [4, 2, -5],
    rotation: [0, -0.3, 0],
    dimensions: [3.2, 2]
  },
  {
    id: 'art-4',
    title: 'Urban Decay',
    artist: 'Joon-ho Kim',
    year: '2024',
    medium: 'Photography',
    description: 'A raw look at modern architecture reclaiming nature. The rust and concrete create a texture that is surprisingly warm and organic.',
    imageUrl: 'https://picsum.photos/id/48/700/700',
    position: [-6, 2, 0],
    rotation: [0, Math.PI / 2, 0],
    dimensions: [2.5, 2.5]
  },
  {
    id: 'art-5',
    title: 'Serenity Now',
    artist: 'Unknown',
    year: 'Circa 1950',
    medium: 'Mixed Media',
    description: 'Found in an attic in Paris, this piece uses newspaper clippings and charcoal to depict a scene of chaotic peace.',
    imageUrl: 'https://picsum.photos/id/56/600/900',
    position: [6, 2, 0],
    rotation: [0, -Math.PI / 2, 0],
    dimensions: [2, 3]
  },
];
