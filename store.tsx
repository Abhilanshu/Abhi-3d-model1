import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Artwork, GalleryState } from './types';

const GalleryContext = createContext<GalleryState | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(null);
  
  const selectArtwork = (artwork: Artwork | null) => {
    setCurrentArtwork(artwork);
  };

  const value = {
    currentArtwork,
    isInspecting: !!currentArtwork,
    selectArtwork,
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
