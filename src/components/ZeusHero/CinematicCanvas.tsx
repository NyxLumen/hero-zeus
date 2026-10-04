import React, { useRef, useEffect } from 'react';
import { CinematicRenderer } from '../../rendering/renderer.ts';

interface CinematicCanvasProps {
  onRendererReady?: (renderer: CinematicRenderer) => void;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({ onRendererReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererInstanceRef = useRef<CinematicRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new CinematicRenderer(canvas);
    rendererInstanceRef.current = renderer;

    if (onRendererReady) {
      onRendererReady(renderer);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          renderer.handleResize(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      renderer.dispose();
      rendererInstanceRef.current = null;
    };
  }, [onRendererReady]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
