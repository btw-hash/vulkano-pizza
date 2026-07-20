'use client';

import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, MotionPathPlugin);

/** Lenis smooth scroll (desktop) + ember-spark custom cursor. */
export default function MotionRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    if (fine && !noMotion) {
      lenis = new Lenis({ lerp: 0.11, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // --- ember spark cursor ---
    let cleanupCursor = () => {};
    if (fine && !noMotion) {
      const dot = document.createElement('div');
      dot.id = 'cur-dot';
      const ring = document.createElement('div');
      ring.id = 'cur-ring';
      document.body.append(dot, ring);
      document.body.classList.add('cur-on');

      let mx = innerWidth / 2,
        my = innerHeight / 2,
        rx = mx,
        ry = my,
        lastSpark = 0,
        sparks = 0;

      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
        const now = performance.now();
        if (now - lastSpark > 40 && sparks < 12) {
          lastSpark = now;
          sparks++;
          const s = document.createElement('div');
          s.className = 'cur-spark';
          const size = 2 + Math.random() * 2;
          s.style.cssText = `width:${size}px;height:${size}px;left:${rx}px;top:${ry}px`;
          document.body.appendChild(s);
          gsap.to(s, {
            y: -(8 + Math.random() * 6),
            x: (Math.random() - 0.5) * 10,
            opacity: 0,
            scale: 0.3,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              s.remove();
              sparks--;
            },
          });
        }
      };
      const loop = () => {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring.style.transform = `translate(${rx - 12}px,${ry - 12}px)`;
      };
      gsap.ticker.add(loop);
      addEventListener('mousemove', onMove);

      const HOVERABLE = 'a, button, .card, .opt, .chip, select';
      const over = (e: Event) => {
        if ((e.target as Element).closest?.(HOVERABLE)) ring.classList.add('big');
      };
      const out = (e: Event) => {
        if ((e.target as Element).closest?.(HOVERABLE)) ring.classList.remove('big');
      };
      const down = () => {
        const shock = document.createElement('div');
        shock.className = 'cur-spark';
        shock.style.cssText = `width:24px;height:24px;left:${mx - 12}px;top:${my - 12}px;background:transparent;border:1.5px solid var(--gold)`;
        document.body.appendChild(shock);
        gsap.fromTo(
          shock,
          { scale: 0, opacity: 0.6 },
          {
            scale: 3,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.out',
            onComplete: () => shock.remove(),
          }
        );
      };
      document.addEventListener('mouseover', over);
      document.addEventListener('mouseout', out);
      document.addEventListener('mousedown', down);

      cleanupCursor = () => {
        gsap.ticker.remove(loop);
        removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseover', over);
        document.removeEventListener('mouseout', out);
        document.removeEventListener('mousedown', down);
        dot.remove();
        ring.remove();
        document.body.classList.remove('cur-on');
      };
    }

    return () => {
      lenis?.destroy();
      cleanupCursor();
    };
  }, []);

  return <>{children}</>;
}
