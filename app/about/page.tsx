'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';
import HeatHaze from '@/components/motion/HeatHaze';
import TransitionLink from '@/components/motion/TransitionLink';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      ScrollTrigger.batch('.fact, .step', {
        start: 'top 85%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
          ),
      });
      gsap.set('.fact, .step', { opacity: 0 });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <main>
        <section className="section" style={{ paddingTop: 52 }}>
          <div className="wrap split">
            <div>
              <p className="kicker">Про нас</p>
              <h1 style={{ fontSize: 'clamp(32px,4.4vw,58px)' }}>
                Спершу була <span className="fire-text">піч</span>
              </h1>
              <p className="muted" style={{ margin: '18px 0', maxWidth: '50ch' }}>
                У 2021-му ми привезли з Неаполя тритонну піч, склали її по цеглині та назвали
                Ф&apos;юрі. Все інше — меню з п&apos;ятнадцяти позицій, закваска з дворічною
                історією і команда з шести людей — виросло навколо неї.
              </p>
              <p className="muted" style={{ marginBottom: 26, maxWidth: '50ch' }}>
                Ми випікаємо при 450 градусах: тісто здувається за секунди, край обвуглюється рівно
                настільки, щоб дати той самий димний присмак. Такого не зробить жодна електрична
                піч.
              </p>
              <TransitionLink className="btn btn-fire" href="/menu">
                Спробувати
              </TransitionLink>
            </div>
            <HeatHaze
              src={asset('/assets/img/about-oven.jpg')}
              alt="Наша піч Ф'юрі"
              className="imgw"
              intensity={0.25}
            />
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="facts">
              <div className="fact">
                <b>450°</b>
                <span>температура печі</span>
              </div>
              <div className="fact">
                <b>48 год</b>
                <span>визріває тісто</span>
              </div>
              <div className="fact">
                <b>15</b>
                <span>позицій у меню</span>
              </div>
              <div className="fact">
                <b>30 хв</b>
                <span>доставка або безкоштовно</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>
                Де нас <span className="fire-text">знайти</span>
              </h2>
            </div>
            <div className="steps">
              <div className="step">
                <h3>Адреса</h3>
                <p>
                  Київ, вул. Вогняна 9<br />
                  щодня 11:00–23:00
                </p>
              </div>
              <div className="step">
                <h3>Телефон</h3>
                <p>
                  <a
                    href="tel:+380441234567"
                    style={{ color: 'var(--gold)', textDecoration: 'none' }}
                  >
                    +38 (044) 123 45 67
                  </a>
                  <br />
                  кол-центр 10:30–22:30
                </p>
              </div>
              <div className="step">
                <h3>Доставка</h3>
                <p>
                  По Києву в межах кільцевої.
                  <br />
                  Від 600 ₴ — безкоштовно.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
