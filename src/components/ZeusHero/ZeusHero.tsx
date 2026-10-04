import React, { useRef, useCallback } from 'react';
import { CinematicCanvas } from './CinematicCanvas.tsx';
import { DevScrubber } from './DevScrubber.tsx';
import type { CinematicRenderer } from '../../rendering/renderer.ts';

export const ZeusHero: React.FC = () => {
  const rendererRef = useRef<CinematicRenderer | null>(null);

  const handleRendererReady = useCallback((renderer: CinematicRenderer) => {
    rendererRef.current = renderer;
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000',
      }}
    >
      <CinematicCanvas onRendererReady={handleRendererReady} />
      <DevScrubber rendererRef={rendererRef} />
    </main>
  );
};
