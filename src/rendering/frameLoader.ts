import * as THREE from 'three';

export const TOTAL_FRAMES = 480;
export const DEFAULT_PRELOAD_AHEAD = 14;
export const DEFAULT_PRELOAD_BEHIND = 8;
export const MAX_CACHE_SIZE = 36;
export const DISPOSAL_DISTANCE_THRESHOLD = 26;

export function getFrameUrl(index: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
  const pad = String(clamped).padStart(3, '0');
  return `/frames/frame_${pad}.webp`;
}

export class FrameSequenceManager {
  private textures = new Map<number, THREE.Texture>();
  private pendingLoads = new Map<number, Promise<THREE.Texture>>();
  private textureLoader = new THREE.TextureLoader();
  private currentFrameIndex = 1;
  private isDisposed = false;

  constructor() {}

  public getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  public getLoadedTexture(index: number): THREE.Texture | undefined {
    return this.textures.get(index);
  }

  public getClosestLoadedTexture(targetIndex: number): { texture: THREE.Texture; index: number } | null {
    if (this.textures.has(targetIndex)) {
      return { texture: this.textures.get(targetIndex)!, index: targetIndex };
    }

    let closestDist = Infinity;
    let closestIndex = -1;

    for (const idx of this.textures.keys()) {
      const dist = Math.abs(idx - targetIndex);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    }

    if (closestIndex !== -1) {
      return { texture: this.textures.get(closestIndex)!, index: closestIndex };
    }

    return null;
  }

  public loadFrame(index: number): Promise<THREE.Texture> {
    const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));

    if (this.textures.has(frameIndex)) {
      return Promise.resolve(this.textures.get(frameIndex)!);
    }

    if (this.pendingLoads.has(frameIndex)) {
      return this.pendingLoads.get(frameIndex)!;
    }

    const url = getFrameUrl(frameIndex);

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          if (this.isDisposed) {
            texture.dispose();
            return;
          }

          // Optimization: No mipmaps for fullscreen 2D frame sequences
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.colorSpace = THREE.SRGBColorSpace;

          this.textures.set(frameIndex, texture);
          this.pendingLoads.delete(frameIndex);
          resolve(texture);
        },
        undefined,
        (err) => {
          this.pendingLoads.delete(frameIndex);
          reject(err);
        }
      );
    });

    this.pendingLoads.set(frameIndex, promise);
    return promise;
  }

  public preloadAround(centerIndex: number, ahead = DEFAULT_PRELOAD_AHEAD, behind = DEFAULT_PRELOAD_BEHIND): void {
    if (this.isDisposed) return;

    this.currentFrameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(centerIndex)));

    // Load nearest neighbors with highest priority
    const framesToPreload: number[] = [];

    const maxSpan = Math.max(ahead, behind);
    for (let step = 1; step <= maxSpan; step++) {
      const fAhead = this.currentFrameIndex + step;
      if (step <= ahead && fAhead <= TOTAL_FRAMES && !this.textures.has(fAhead) && !this.pendingLoads.has(fAhead)) {
        framesToPreload.push(fAhead);
      }
      const fBehind = this.currentFrameIndex - step;
      if (step <= behind && fBehind >= 1 && !this.textures.has(fBehind) && !this.pendingLoads.has(fBehind)) {
        framesToPreload.push(fBehind);
      }
    }

    // Trigger preloads asynchronously
    for (const frame of framesToPreload) {
      this.loadFrame(frame).catch(() => {
        // Silently catch speculative preload rejections
      });
    }

    this.pruneCache();
  }

  public disposeFrame(index: number): void {
    const texture = this.textures.get(index);
    if (texture) {
      texture.dispose();
      this.textures.delete(index);
    }
  }

  public getCacheSize(): number {
    return this.textures.size;
  }

  private pruneCache(): void {
    if (this.textures.size <= MAX_CACHE_SIZE) return;

    // Collect frames sorted by distance to current frame (farthest first)
    const candidates: Array<{ index: number; dist: number }> = [];
    for (const idx of this.textures.keys()) {
      const dist = Math.abs(idx - this.currentFrameIndex);
      if (dist >= DISPOSAL_DISTANCE_THRESHOLD) {
        candidates.push({ index: idx, dist });
      }
    }

    candidates.sort((a, b) => b.dist - a.dist);

    for (const item of candidates) {
      if (this.textures.size <= MAX_CACHE_SIZE) break;
      this.disposeFrame(item.index);
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    for (const [idx] of this.textures) {
      this.disposeFrame(idx);
    }
    this.textures.clear();
    this.pendingLoads.clear();
  }
}
