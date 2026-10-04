import React, { useRef, useEffect } from 'react';
import { TOTAL_FRAMES } from '../../rendering/frameLoader.ts';
import type { CinematicRenderer } from '../../rendering/renderer.ts';

interface DevScrubberProps {
  rendererRef: React.RefObject<CinematicRenderer | null>;
}

export const DevScrubber: React.FC<DevScrubberProps> = ({ rendererRef }) => {
  const frameTextRef = useRef<HTMLSpanElement>(null);
  const cacheTextRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const progress = parseFloat(e.currentTarget.value);
    const frameIndex = Math.round(1 + progress * (TOTAL_FRAMES - 1));

    if (rendererRef.current) {
      rendererRef.current.setFrame(frameIndex);
      if (frameTextRef.current) {
        frameTextRef.current.textContent = `FRAME ${String(frameIndex).padStart(3, '0')} / ${TOTAL_FRAMES}`;
      }
      if (cacheTextRef.current) {
        cacheTextRef.current.textContent = `VRAM CACHE: ${rendererRef.current.getCacheSize()} TEXTURES`;
      }
    }
  };

  useEffect(() => {
    // Initial display sync
    if (frameTextRef.current) {
      frameTextRef.current.textContent = `FRAME 001 / ${TOTAL_FRAMES}`;
    }
    const interval = setInterval(() => {
      if (cacheTextRef.current && rendererRef.current) {
        cacheTextRef.current.textContent = `VRAM CACHE: ${rendererRef.current.getCacheSize()} TEXTURES`;
      }
    }, 500);
    return () => clearInterval(interval);
  }, [rendererRef]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(8, 8, 8, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '14px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '380px',
        maxWidth: '90vw',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8)',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#8e8e8e',
        }}
      >
        <span
          ref={frameTextRef}
          style={{ color: '#f0f0f0', fontWeight: 600 }}
        >
          FRAME 001 / {TOTAL_FRAMES}
        </span>
        <span
          ref={cacheTextRef}
          style={{ color: '#d4af37' }}
        >
          VRAM CACHE: 1 TEXTURES
        </span>
      </div>

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={1}
        step={0.001}
        defaultValue={0}
        onInput={handleInput}
        style={{
          width: '100%',
          accentColor: '#d4af37',
          cursor: 'pointer',
        }}
        aria-label="Development frame scrubber"
      />

      <div
        style={{
          fontSize: '9px',
          fontFamily: 'monospace',
          letterSpacing: '0.15em',
          color: '#555',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        PHASE 1 DEV SCRUBBER — SCRUB PROGRESS (0.00 → 1.00)
      </div>
    </div>
  );
};
