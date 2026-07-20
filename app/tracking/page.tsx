'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useCart } from '@/lib/cart';
import { uah } from '@/lib/data';
import TransitionLink from '@/components/motion/TransitionLink';

const STEP_MS = 5000;

const STEPS = [
  {
    t: 'Замовлення прийнято',
    d: 'Чек вже на кухні, кухар миє руки.',
    icon: <path d="M4 7h16M4 12h16M4 17h10" />,
  },
  {
    t: 'Розкатуємо тісто',
    d: '48-годинне тісто набирає форму. Соус, сир, топінги.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    t: 'У печі — 450°',
    d: '90 секунд справжнього вогню. Найкоротший етап.',
    icon: <path d="M12 3c2 3-1 4 1 7 1-1 2-2 1-4 3 2 5 5 5 8a7 7 0 0 1-14 0c0-4 4-8 7-11z" />,
  },
  {
    t: "Кур'єр у дорозі",
    d: 'Термосумка тримає 60°+. Слідкуйте за дверима.',
    icon: (
      <>
        <circle cx="6.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
        <path d="M6.5 17.5h6l3-8h4M9 9h4" />
      </>
    ),
  },
  {
    t: 'Доставлено',
    d: 'Смачного! Не забудьте про кутовий шматочок.',
    icon: <path d="M5 13l5 5L20 7" />,
  },
];

export default function TrackingPage() {
  const { order } = useCart();
  const [now, setNow] = useState(() => Date.now());
  const [restartAt, setRestartAt] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const start = restartAt ?? order?.at ?? 0;
  const elapsed = now - start;
  const totalEta = STEP_MS * (STEPS.length - 1);
  const stage = order ? Math.min(STEPS.length - 1, Math.floor(elapsed / STEP_MS)) : -1;
  const left = Math.max(0, totalEta - elapsed);
  const mm = String(Math.floor(left / 60000)).padStart(2, '0');
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
  const pct = order ? Math.min(100, (stage / (STEPS.length - 1)) * 100) : 0;

  useEffect(() => {
    if (stage < 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dot = document.querySelectorAll('.tstep .dot')[stage];
    if (dot) {
      gsap.fromTo(dot, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1,0.4)' });
    }
  }, [stage]);

  return (
    <main>
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="wrap track-box">
          <p className="kicker">Трекер</p>
          <h1 style={{ fontSize: 'clamp(30px,4vw,52px)' }}>
            Де моя <span className="fire-text">піца?</span>
          </h1>
          <p className="muted" style={{ marginTop: 12 }}>
            {order ? (
              <>
                Замовлення <b style={{ color: 'var(--gold)' }}>{order.no}</b> · {uah(order.total)} ·
                дякуємо, {order.name}!
              </>
            ) : (
              <>
                Замовлень не знайдено.{' '}
                <TransitionLink href="/menu" style={{ color: 'var(--gold)' }}>
                  Зробіть перше
                </TransitionLink>{' '}
                — і повертайтесь.
              </>
            )}
          </p>

          {order ? (
            <>
              <div className="eta" style={{ marginTop: 30 }}>
                <span className="muted">Орієнтовний час до дзвінка у двері</span>
                <b>{left === 0 ? 'Смачного!' : `${mm}:${ss}`}</b>
                <button className="btn btn-ghost btn-sm" onClick={() => setRestartAt(Date.now())}>
                  Повторити демо
                </button>
              </div>

              <div className="track-steps">
                <div className="track-line"></div>
                <div className="track-line-fill" style={{ height: `${pct}%` }}></div>
                {pct > 0 && pct < 100 ? (
                  <div className="track-tip" style={{ top: `calc(${pct}% - 8px)` }} />
                ) : null}
                {STEPS.map((s, i) => (
                  <div
                    className={`tstep${i < stage ? ' done' : ''}${i === stage ? ' now' : ''}`}
                    key={i}
                  >
                    <div className="dot">
                      <svg viewBox="0 0 24 24">{s.icon}</svg>
                    </div>
                    <div>
                      <h4>{s.t}</h4>
                      <p>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
