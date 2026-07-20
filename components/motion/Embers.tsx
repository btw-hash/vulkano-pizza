'use client';

import { useEffect, useRef } from 'react';

/** Rising ember particles canvas (hero / craft scene). Count scales via prop. */
export default function Embers({
  count = 34,
  className = 'embers',
}: {
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mobile = matchMedia('(max-width: 768px)').matches;
    const n = mobile ? Math.floor(count / 2) : count;
    const x = c.getContext('2d')!;
    const rs = () => {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
    };
    rs();
    addEventListener('resize', rs);
    const P = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 1 + Math.random() * 2.4,
      v: 0.35 + Math.random() * 0.9,
      w: Math.random() * 6.28,
    }));
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const em = () => {
      raf = requestAnimationFrame(em);
      if (!visible || document.hidden) return;
      x.clearRect(0, 0, c.width, c.height);
      for (const p of P) {
        p.y -= p.v * 0.0022;
        p.w += 0.02;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        x.globalAlpha = 0.18 + 0.45 * Math.abs(Math.sin(p.w));
        x.fillStyle = p.s > 2.4 ? '#FFB03A' : '#FF4D14';
        x.beginPath();
        x.arc(p.x * c.width + Math.sin(p.w) * 14, p.y * c.height, p.s, 0, 6.28);
        x.fill();
      }
      x.globalAlpha = 1;
    };
    em();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('resize', rs);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
