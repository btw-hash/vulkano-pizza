'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { PRODUCTS } from '@/lib/data';
import { asset } from '@/lib/asset';
import ProductCard from '@/components/ProductCard';
import Embers from '@/components/motion/Embers';
import HeatHaze from '@/components/motion/HeatHaze';
import TransitionLink from '@/components/motion/TransitionLink';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const POPULAR = ['pepperoni-basil', 'quattro-formaggi', 'rucola-prosciutto'];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set('.door-wipe', { display: 'none' });
        gsap.set('.reveal, .hero-copy > *, .hero-img-porthole', { opacity: 1, clearProps: 'all' });
        return;
      }

      // ---- hero entrance (§2) ----
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.door-panel-l', { clipPath: 'inset(0 100% 0 0)', duration: 0.5, ease: 'expo.out' }, 0)
        .to('.door-panel-r', { clipPath: 'inset(0 0 0 100%)', duration: 0.5, ease: 'expo.out' }, 0)
        .set('.door-wipe', { display: 'none' }, 0.55)
        .from('.site-head .logo', { y: 12, opacity: 0, duration: 0.4 }, 0.1)
        .from('.site-head .nav-links a', { y: 12, opacity: 0, stagger: 0.05, duration: 0.4 }, 0.2)
        .from('.site-head .cart-btn', { y: 12, opacity: 0, duration: 0.4 }, 0.3);

      const split = new SplitText('.h1-plain', { type: 'chars,words' });
      tl.from(
        split.chars,
        {
          opacity: 0,
          y: 40,
          scale: 1.4,
          filter: 'blur(6px)',
          stagger: 0.018,
          duration: 0.9,
          ease: 'power4.out',
        },
        0.5
      )
        .fromTo(
          '.hero-h1 .fire-text',
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' },
          0.85
        )
        .from('.hero .sub', { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.85)
        .fromTo(
          '.hero-cta > *',
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.08, duration: 0.35, clearProps: 'all' },
          1.0
        )
        .fromTo(
          '.hero-img-porthole',
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', duration: 0.9, ease: 'expo.out' },
          0.45
        )
        .from('.marquee', { yPercent: 100, opacity: 0, duration: 0.5, ease: 'power2.out' }, 1.3);

      // stat counters with ember pop
      gsap.utils.toArray<HTMLElement>('.stat b[data-count]').forEach((el, i) => {
        const target = parseInt(el.dataset.count!, 10);
        const suffix = el.dataset.suffix ?? '';
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: target,
            duration: 0.9,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
            onComplete: () => {
              const ember = document.createElement('span');
              ember.className = 'stat-ember';
              el.appendChild(ember);
              gsap.fromTo(
                ember,
                { opacity: 1, scale: 0 },
                { opacity: 0, scale: 2, duration: 0.3, onComplete: () => ember.remove() }
              );
            },
          },
          1.15 + i * 0.08
        );
      });

      // ---- popular grid ----
      ScrollTrigger.batch('.grid .card', {
        start: 'top 85%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }
          ),
      });
      gsap.set('.grid .card', { opacity: 0 });

      // ---- oven journey pinned scene (§3) ----
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const stages = gsap.utils.toArray<HTMLElement>('.craft-stage-label');
        const temp = document.querySelector<HTMLElement>('.temp-counter');
        const hazeWrap = document.querySelector<HTMLElement>('.craft-haze');
        gsap.set(stages[0], { opacity: 1 });
        ScrollTrigger.create({
          trigger: '.craft-scene',
          pin: true,
          start: 'top top',
          end: '+=250%',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            if (temp) temp.textContent = `${Math.round(20 + 430 * p * p)}°`;
            if (hazeWrap) hazeWrap.dataset.haze = String(0.1 + 0.8 * p);
            stages.forEach((s, i) => {
              const active = p < 0.33 ? 0 : p < 0.72 ? 1 : 2;
              gsap.to(s, { opacity: i === active ? 1 : 0, duration: 0.25, overwrite: 'auto' });
            });
          },
        });
      });
      mm.add('(max-width: 1023px)', () => {
        gsap.set('.craft-stage-label', { position: 'static', opacity: 1 });
      });

      // ---- steps flame line ----
      const line = document.querySelector<SVGPathElement>('.steps-line path');
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.steps', start: 'top 80%', once: true },
        });
      }
      ScrollTrigger.batch('.steps .step', {
        start: 'top 80%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
          ),
      });
      gsap.set('.steps .step', { opacity: 0 });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <div className="door-wipe" aria-hidden="true">
        <div className="door-panel door-panel-l" style={{ clipPath: 'inset(0 0 0 0)' }} />
        <div className="door-panel door-panel-r" style={{ clipPath: 'inset(0 0 0 0)' }} />
      </div>

      <main>
        <section className="hero">
          <Embers count={34} />
          <div className="wrap">
            <div className="hero-copy">
              <h1 className="hero-h1" style={{ fontSize: 'clamp(36px,5vw,68px)' }}>
                <span className="h1-plain">
                  Піца,
                  <br />
                  народжена
                </span>
                <br />
                <span className="fire-text">у вогні</span>
              </h1>
              <p className="sub">
                Дров&apos;яна піч, 450 градусів і 90 секунд — більше нічого. Тісто на заквасці 48
                годин, томати сан-марцано, гаряча доставка за 30 хвилин.
              </p>
              <div className="hero-cta">
                <TransitionLink className="btn btn-fire" href="/menu">
                  Замовити зараз
                </TransitionLink>
                <TransitionLink className="btn btn-ghost" href="/menu">
                  Дивитись меню
                </TransitionLink>
              </div>
              <div className="hero-stats">
                <div className="stat" style={{ position: 'relative' }}>
                  <b data-count="450" data-suffix="°">
                    0°
                  </b>
                  <span>жар печі</span>
                </div>
                <div className="stat" style={{ position: 'relative' }}>
                  <b data-count="90" data-suffix=" сек">
                    0
                  </b>
                  <span>випікання</span>
                </div>
                <div className="stat" style={{ position: 'relative' }}>
                  <b data-count="30" data-suffix=" хв">
                    0
                  </b>
                  <span>доставка</span>
                </div>
              </div>
            </div>
            <div className="hero-img">
              <HeatHaze
                src={asset('/assets/img/hero.jpg')}
                alt="Піца у дров'яній печі"
                className="hero-img-porthole"
                intensity={0.35}
              />
              <div className="tag">450°C</div>
            </div>
          </div>
          <div className="marquee">
            <div className="marquee-in">
              ДРОВ&apos;ЯНА ПІЧ&nbsp;&nbsp;•&nbsp;&nbsp;450°C&nbsp;&nbsp;•&nbsp;&nbsp;90
              СЕКУНД&nbsp;&nbsp;•&nbsp;&nbsp;ДОСТАВКА 30 ХВ&nbsp;&nbsp;•&nbsp;&nbsp;ТІСТО 48
              ГОДИН&nbsp;&nbsp;•&nbsp;&nbsp;ДРОВ&apos;ЯНА
              ПІЧ&nbsp;&nbsp;•&nbsp;&nbsp;450°C&nbsp;&nbsp;•&nbsp;&nbsp;90
              СЕКУНД&nbsp;&nbsp;•&nbsp;&nbsp;ДОСТАВКА 30 ХВ&nbsp;&nbsp;•&nbsp;&nbsp;ТІСТО 48
              ГОДИН&nbsp;&nbsp;•&nbsp;&nbsp;
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>
                Хіти <span className="fire-text">тижня</span>
              </h2>
              <div className="spacer"></div>
              <TransitionLink className="btn btn-ghost btn-sm" href="/menu">
                Все меню →
              </TransitionLink>
            </div>
            <div className="grid">
              {POPULAR.map((id) => (
                <ProductCard key={id} p={PRODUCTS.find((p) => p.id === id)!} />
              ))}
            </div>
          </div>
        </section>

        <section className="section craft-scene">
          <div className="wrap split">
            <div className="craft-haze" data-haze="0.1">
              <HeatHaze
                src={asset('/assets/img/feature-cheese.jpg')}
                alt="Тягучий сир"
                intensity={0.1}
              />
            </div>
            <div style={{ position: 'relative', minHeight: 220 }}>
              <p className="kicker">Шлях піци крізь жар</p>
              <div className="temp-counter" style={{ fontSize: 'clamp(48px,6vw,84px)' }}>
                20°
              </div>
              <div style={{ position: 'relative', height: 120 }}>
                <div className="craft-stage-label">
                  <h2>Тісто відпочило.</h2>
                  <p className="muted">48 годин закваски позаду — час формувати основу.</p>
                </div>
                <div className="craft-stage-label">
                  <h2>Вогонь працює.</h2>
                  <p className="muted">Піч тримає 450° — край здувається за лічені секунди.</p>
                </div>
                <div className="craft-stage-label">
                  <h2>90 секунд — готово.</h2>
                  <p className="muted">Димний аромат, тягучий сир, хрустка скоринка.</p>
                </div>
              </div>
              <TransitionLink className="btn btn-fire" href="/about" style={{ marginTop: 20 }}>
                Про нашу піч
              </TransitionLink>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>
                Як це <span className="fire-text">працює</span>
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              <svg
                className="steps-line"
                viewBox="0 0 1200 40"
                style={{ position: 'absolute', top: -18, left: 0, width: '100%', height: 40 }}
                aria-hidden="true"
              >
                <path
                  d="M0 30 C 200 5, 400 35, 600 20 S 1000 5, 1200 25"
                  fill="none"
                  stroke="rgba(255,77,20,.5)"
                  strokeWidth="2"
                />
              </svg>
              <div className="steps">
                <div className="step">
                  <h3>Обираєте</h3>
                  <p>
                    15 позицій: піци, фокача, десерти й лимонад. Борти, тісто, додатки — все ваше.
                  </p>
                </div>
                <div className="step">
                  <h3>Ми випікаємо</h3>
                  <p>
                    Замовлення падає на кухню миттєво. Через 90 секунд у печі піца вже в коробці.
                  </p>
                </div>
                <div className="step">
                  <h3>Кур&apos;єр летить</h3>
                  <p>Термосумка тримає жар. Середній час — 30 хвилин, або піца за наш рахунок.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
