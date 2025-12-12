import * as THREE from 'three';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description: string;
  imageUrl: string;
  position: [number, number, number]; // x, y, z in 3D space
  rotation: [number, number, number];
  dimensions: [number, number]; // width, height in 3D units
}

export interface GalleryState {
  currentArtwork: Artwork | null;
  isInspecting: boolean;
  selectArtwork: (artwork: Artwork | null) => void;
}
