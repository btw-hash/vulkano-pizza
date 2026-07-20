'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uTime;
uniform float uIntensity;
uniform float uSpeed;
uniform vec2 uCover; // cover-fit scale
varying vec2 vUv;

// simplex-ish value noise, cheap
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), u.x),
             mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), u.x), u.y);
}

void main(){
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  // heat rises: distortion strongest at bottom, fading to top
  float edge = pow(1.0 - vUv.y, 2.0);
  float n1 = noise(vec2(uv.x * 4.0, uv.y * 4.0 - uTime * uSpeed));
  float n2 = noise(vec2(uv.x * 9.0 + 5.0, uv.y * 7.0 - uTime * uSpeed * 1.7));
  vec2 warp = vec2((n1 - 0.5) + (n2 - 0.5) * 0.5, (n2 - 0.5) * 0.6) * 0.035 * uIntensity * edge;
  float shift = 0.0015 * step(0.7, uIntensity) * uIntensity * edge;
  vec4 col;
  col.r = texture2D(uMap, uv + warp + vec2(shift, 0.0)).r;
  col.g = texture2D(uMap, uv + warp).g;
  col.b = texture2D(uMap, uv + warp - vec2(shift, 0.0)).b;
  col.a = 1.0;
  gl_FragColor = col;
}`;

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

/**
 * Heat-haze distortion over an image (OGL). Falls back to plain <img>.
 * Drive intensity externally via ref callback (data-haze attribute is read each frame).
 */
export default function HeatHaze({
  src,
  alt,
  className,
  intensity = 0.35,
}: {
  src: string;
  alt: string;
  className?: string;
  intensity?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = !matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (noMotion) return; // keep <img> fallback

    let renderer: Renderer | null = null;
    let raf = 0;
    try {
      renderer = new Renderer({ dpr: Math.min(devicePixelRatio, touch ? 1 : 1.5), alpha: true });
      const gl = renderer.gl;
      gl.canvas.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;border-radius:inherit';
      wrap.appendChild(gl.canvas);

      const texture = new Texture(gl);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      let iw = 1,
        ih = 1;
      img.onload = () => {
        texture.image = img;
        iw = img.naturalWidth;
        ih = img.naturalHeight;
        resize();
      };

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uMap: { value: texture },
          uTime: { value: 0 },
          uIntensity: { value: intensity },
          uSpeed: { value: 0.6 },
          uCover: { value: [1, 1] },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const w = wrap.clientWidth,
          h = wrap.clientHeight;
        renderer!.setSize(w, h);
        const cAsp = w / h,
          iAsp = iw / ih;
        program.uniforms.uCover.value = cAsp > iAsp ? [1, iAsp / cAsp] : [cAsp / iAsp, 1];
      };
      resize();
      addEventListener('resize', resize);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(wrap);

      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        program.uniforms.uTime.value = t * 0.001;
        const attr = parseFloat(wrap.dataset.haze ?? '');
        program.uniforms.uIntensity.value = Number.isFinite(attr) ? attr : intensity;
        program.uniforms.uSpeed.value =
          0.6 + 0.8 * Math.max(0, program.uniforms.uIntensity.value - 0.35);
        renderer!.render({ scene: mesh });
      };
      raf = requestAnimationFrame(loop);

      const cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        removeEventListener('resize', resize);
        gl.canvas.remove();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
      (wrap as HTMLDivElement & { __hazeCleanup?: () => void }).__hazeCleanup = cleanup;
    } catch {
      // WebGL failed → <img> fallback stays visible
    }
    return () => {
      (wrap as HTMLDivElement & { __hazeCleanup?: () => void }).__hazeCleanup?.();
    };
  }, [src, intensity]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
