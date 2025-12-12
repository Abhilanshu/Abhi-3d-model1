import React, { Suspense } from 'react';
import { GalleryProvider } from './store';
import { Scene } from './components/Scene';
import { UI } from './components/UI';

const App: React.FC = () => {
  return (
    <GalleryProvider>
      <div className="relative w-full h-full bg-atelier-bg text-atelier-text overflow-hidden">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="flex items-center justify-center h-full w-full text-atelier-accent animate-pulse">Loading Atelier...</div>}>
            <Scene />
          </Suspense>
        </div>
        
        {/* UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <UI />
        </div>
      </div>
    </GalleryProvider>
  );
};

export default App;