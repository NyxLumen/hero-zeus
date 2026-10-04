import * as THREE from 'three';
import { FrameSequenceManager, TOTAL_FRAMES } from './frameLoader.ts';

export interface RendererStatus {
  frameIndex: number;
  cacheSize: number;
}

export class CinematicRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;
  private dummyTexture: THREE.DataTexture;
  private frameManager: FrameSequenceManager;

  private currentRenderedFrame = 1;
  private targetFrame = 1;
  private animationFrameId: number | null = null;
  private onStatusChange?: (status: RendererStatus) => void;
  private isDisposed = false;

  constructor(
    canvas: HTMLCanvasElement,
    onStatusChange?: (status: RendererStatus) => void
  ) {
    this.canvas = canvas;
    this.onStatusChange = onStatusChange;
    this.frameManager = new FrameSequenceManager();

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Orthographic Camera for fullscreen quad
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();

    // 3. Fallback dummy texture (1x1 black)
    this.dummyTexture = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    this.dummyTexture.needsUpdate = true;

    // 4. Custom object-cover shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.dummyTexture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;
        varying vec2 vUv;

        void main() {
          float screenAspect = uResolution.x / uResolution.y;
          float imageAspect = uImageResolution.x / uImageResolution.y;

          vec2 ratio = vec2(
            min(screenAspect / imageAspect, 1.0),
            min(imageAspect / screenAspect, 1.0)
          );

          vec2 coverUv = (vUv - 0.5) * ratio + 0.5;
          gl_FragColor = texture2D(uTexture, coverUv);
          #include <colorspace_fragment>
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.quad);

    // Initial resize to current canvas/window size
    this.handleResize(window.innerWidth, window.innerHeight);

    // Initial load: frame 001 visible immediately
    this.setFrame(1);
  }

  public handleResize(width: number, height: number): void {
    if (this.isDisposed || width <= 0 || height <= 0) return;

    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    this.render();
  }

  public setFrame(index: number): void {
    if (this.isDisposed) return;

    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
    this.targetFrame = clamped;

    const cached = this.frameManager.getLoadedTexture(clamped);
    if (cached) {
      this.material.uniforms.uTexture.value = cached;
      this.currentRenderedFrame = clamped;
      this.render();
    } else {
      // Load target frame with high priority
      this.frameManager.loadFrame(clamped).then((texture) => {
        if (this.isDisposed) return;
        // Check if this frame is still relevant or close to current target
        if (Math.abs(this.targetFrame - clamped) <= 2) {
          this.material.uniforms.uTexture.value = texture;
          this.currentRenderedFrame = clamped;
          this.render();
        }
      }).catch((err) => {
        console.error(`Failed to load frame ${clamped}`, err);
      });
    }

    // Preload window around target
    this.frameManager.preloadAround(clamped);

    this.notifyStatus();
  }

  public getCurrentRenderedFrame(): number {
    return this.currentRenderedFrame;
  }

  public getTargetFrame(): number {
    return this.targetFrame;
  }

  public getCacheSize(): number {
    return this.frameManager.getCacheSize();
  }

  private notifyStatus(): void {
    if (this.onStatusChange) {
      this.onStatusChange({
        frameIndex: this.targetFrame,
        cacheSize: this.frameManager.getCacheSize(),
      });
    }
  }

  public render(): void {
    if (this.isDisposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.frameManager.dispose();
    this.quad.geometry.dispose();
    this.material.dispose();
    this.dummyTexture.dispose();
    this.renderer.dispose();
  }
}
