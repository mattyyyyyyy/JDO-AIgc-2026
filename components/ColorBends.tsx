import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ColorBendsProps } from '../types';

const MAX_COLORS = 5;

const frag = `
precision highp float;
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
    float t = uTime * uSpeed;
    vec2 p = vUv * 2.0 - 1.0;
    p += uPointer * uParallax * 0.1;
    vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
    vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
    q /= max(uScale, 0.001);
    q /= 0.5 + 0.2 * dot(q, q);
    q += 0.2 * cos(t) - 7.5;

    vec2 toward = (uPointer - rp);
    q += toward * uMouseInfluence * 0.2;

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
        vec2 s = q;
        vec3 sumCol = vec3(0.0);
        float cover = 0.0;
        
        for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float t_offset = 3.0 * t - float(i);
            float m0 = length(r + sin(5.0 * r.y * uFrequency - t_offset) * 0.25);
            
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = kBelow * kBelow;
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - t_offset) * 0.25);
            float m = mix(m0, m1, kMix);
            float w = 1.0 / (1.0 + m * m * 40.0);
            
            sumCol += uColors[i] * w;
            cover = max(cover, w);
        }
        col = sumCol * 1.5; 
        col = clamp(col, 0.0, 1.0);
        a = uTransparent > 0 ? cover : 1.0;
    } else {
        col = vec3(0.1);
    }

    if (uNoise > 0.001) {
        float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime * 10.0), vec2(12.9898, 78.233))) * 43758.5453);
        col += (n - 0.5) * uNoise;
    }

    a = smoothstep(0.01, 0.1, a);
    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

const DEFAULT_CONFIG = {
  colors: ["#3b82f6", "#1e40af", "#60a5fa"],
  rotation: 0,
  speed: 0.15,
  scale: 1,
  frequency: 0.8,
  warpStrength: 1,
  mouseInfluence: 0.5,
  parallax: 0.3,
  noise: 0.02,
  autoRotate: 5,
  transparent: true
};

export default function ColorBends({
  className = '',
  style = {},
  rotation = DEFAULT_CONFIG.rotation,
  speed = DEFAULT_CONFIG.speed,
  colors = DEFAULT_CONFIG.colors,
  transparent = DEFAULT_CONFIG.transparent,
  autoRotate = DEFAULT_CONFIG.autoRotate,
  scale = DEFAULT_CONFIG.scale,
  frequency = DEFAULT_CONFIG.frequency,
  warpStrength = DEFAULT_CONFIG.warpStrength,
  mouseInfluence = DEFAULT_CONFIG.mouseInfluence,
  parallax = DEFAULT_CONFIG.parallax,
  noise = DEFAULT_CONFIG.noise
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const configRef = useRef({
    rotation,
    autoRotate,
    speed,
    pointerSmooth: 8
  });

  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    configRef.current = { rotation, autoRotate, speed, pointerSmooth: 8 };

    if (materialRef.current) {
      const m = materialRef.current;
      m.uniforms.uScale.value = scale;
      m.uniforms.uFrequency.value = frequency;
      m.uniforms.uWarpStrength.value = warpStrength;
      m.uniforms.uMouseInfluence.value = mouseInfluence;
      m.uniforms.uParallax.value = parallax;
      m.uniforms.uNoise.value = noise;
      m.uniforms.uTransparent.value = transparent ? 1 : 0;

      const toVec3 = (hex: string) => {
        const h = hex.replace('#', '').trim();
        let r = 0, g = 0, b = 0;
        if (h.length === 3) {
          r = parseInt(h[0] + h[0], 16);
          g = parseInt(h[1] + h[1], 16);
          b = parseInt(h[2] + h[2], 16);
        } else {
          r = parseInt(h.slice(0, 2), 16);
          g = parseInt(h.slice(2, 4), 16);
          b = parseInt(h.slice(4, 6), 16);
        }
        return new THREE.Vector3(r / 255, g / 255, b / 255);
      };

      const arr = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
      for (let i = 0; i < MAX_COLORS; i++) {
        const vec = m.uniforms.uColors.value[i];
        if (i < arr.length) vec.copy(arr[i]);
        else vec.set(0, 0, 0);
      }
      m.uniforms.uColorCount.value = arr.length;
    }
  }, [rotation, autoRotate, speed, scale, frequency, warpStrength, mouseInfluence, parallax, noise, transparent, colors]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise }
      },
      premultipliedAlpha: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
      depth: false,
      stencil: false
    });
    rendererRef.current = renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1)); 
    renderer.setClearColor(0x000000, 0); 

    const canvasStyle = renderer.domElement.style;
    canvasStyle.width = '100%';
    canvasStyle.height = '100%';
    canvasStyle.display = 'block';
    canvasStyle.position = 'absolute';
    canvasStyle.top = '0';
    canvasStyle.left = '0';
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    };

    handleResize();

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);
      resizeObserverRef.current = ro;
    } else {
      window.addEventListener('resize', handleResize);
    }

    const loop = () => {
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;
      material.uniforms.uTime.value = elapsed;

      const conf = configRef.current;

      const deg = (conf.rotation % 360) + conf.autoRotate * elapsed;
      const rad = (deg * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));

      const cur = pointerCurrentRef.current;
      const tgt = pointerTargetRef.current;
      const amt = Math.min(1, dt * conf.pointerSmooth);
      cur.lerp(tgt, amt);
      material.uniforms.uPointer.value.copy(cur);
      
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTargetRef.current.set(x, y);
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      else window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    />
  );
}