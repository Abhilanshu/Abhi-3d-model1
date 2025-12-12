import React, { useEffect, useState } from 'react';
import { useGallery } from '../store';
import { ARTWORKS } from '../constants';

export const UI: React.FC = () => {
  const { currentArtwork, selectArtwork } = useGallery();
  const [visible, setVisible] = useState(false);
  
  // Delay visibility of detail panel to allow camera transition
  useEffect(() => {
    if (currentArtwork) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [currentArtwork]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking through to canvas
    if (!currentArtwork) return;
    const currentIndex = ARTWORKS.findIndex(a => a.id === currentArtwork.id);
    const nextIndex = (currentIndex + 1) % ARTWORKS.length;
    setVisible(false);
    selectArtwork(ARTWORKS[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentArtwork) return;
    const currentIndex = ARTWORKS.findIndex(a => a.id === currentArtwork.id);
    const prevIndex = (currentIndex - 1 + ARTWORKS.length) % ARTWORKS.length;
    setVisible(false);
    selectArtwork(ARTWORKS[prevIndex]);
  };

  const handleBack = (e: React.MouseEvent) => {
      e.stopPropagation();
      setVisible(false);
      selectArtwork(null);
  }

  return (
    <div className="w-full h-full pointer-events-none flex flex-col justify-between p-6 md:p-12">
      
      {/* Header */}
      <header className={`flex justify-between items-start transition-opacity duration-500 ${currentArtwork ? 'opacity-50' : 'opacity-100'}`}>
        <div>
            <h1 className="text-3xl md:text-5xl font-serif text-atelier-accent tracking-wide pointer-events-auto">NEO-ATELIER</h1>
            <p className="text-sm md:text-base text-atelier-text opacity-70 mt-2 max-w-md">
                Use <span className="text-atelier-accent font-bold">Arrows / WASD</span> to move. <br/>
                <span className="text-atelier-accent">Click on a painting</span> to inspect.
            </p>
        </div>
      </header>

      {/* Detail Panel */}
      {currentArtwork && (
        <div 
          className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-atelier-bg/80 backdrop-blur-md border-l border-atelier-glass shadow-2xl transition-transform duration-1000 ease-in-out transform pointer-events-auto overflow-y-auto ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-10 flex flex-col h-full relative">
            
            {/* Close Button */}
            <button 
                onClick={handleBack}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-atelier-text/20 flex items-center justify-center hover:bg-atelier-text hover:text-atelier-bg transition-colors"
            >
                ✕
            </button>

            <div className="mt-12 flex-grow">
                <span className="text-xs font-bold tracking-widest text-atelier-accent uppercase mb-2 block">{currentArtwork.year} — {currentArtwork.medium}</span>
                <h2 className="text-4xl font-serif text-atelier-text mb-6 leading-tight">{currentArtwork.title}</h2>
                <div className="w-12 h-1 bg-atelier-accent mb-8"></div>
                
                <p className="text-lg leading-relaxed text-gray-300 font-light mb-8">
                    {currentArtwork.description}
                </p>

                <div className="p-4 bg-white/5 rounded border border-white/10 mb-8">
                    <h3 className="text-sm font-bold text-atelier-accent uppercase mb-1">Artist Note</h3>
                    <p className="text-sm italic opacity-80">"{currentArtwork.artist} explores themes that resonate with the digital age while respecting classical composition."</p>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-atelier-accent transition-colors"
                >
                    ← Previous
                </button>
                 <span className="text-xs opacity-30">
                     {ARTWORKS.findIndex(a => a.id === currentArtwork.id) + 1} / {ARTWORKS.length}
                 </span>
                <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-atelier-accent transition-colors"
                >
                    Next →
                </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer / Instructions (Only in gallery view) */}
      {!currentArtwork && (
          <div className="text-center w-full pointer-events-none pb-4">
              <div className="inline-block px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/5 text-xs tracking-widest text-atelier-text/60 animate-pulse">
                  EXPLORE THE SPACE
              </div>
          </div>
      )}
    </div>
  );
};
