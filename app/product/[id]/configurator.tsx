'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useCart } from '@/lib/cart';
import { CRUSTS, DOUGHS, EXTRAS, SIZE_LABEL, productById, uah } from '@/lib/data';
import TransitionLink from '@/components/motion/TransitionLink';

export default function Configurator({ id }: { id: string }) {
  const p = productById(id)!;
  const { add, setDrawerOpen } = useCart();
  const isPizza = p.kind === 'pizza';
  const sizes = (Object.keys(p.prices) as unknown as (26 | 32 | 40)[]).map(Number) as (
    26 | 32 | 40
  )[];

  const [size, setSize] = useState<26 | 32 | 40>(sizes.includes(32) ? 32 : sizes[0]);
  const [crust, setCrust] = useState('classic');
  const [dough, setDough] = useState('thin');
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const priceRef = useRef<HTMLDivElement>(null);
  const prevPrice = useRef(0);

  const price = useMemo(() => {
    const base = p.prices[size] ?? p.prices[32] ?? 0;
    if (!isPizza) return base * qty;
    const c = CRUSTS.find((x) => x.id === crust)?.add ?? 0;
    const d = DOUGHS.find((x) => x.id === dough)?.add ?? 0;
    const e = extras.reduce((s, x) => s + (EXTRAS.find((y) => y.id === x)?.add ?? 0), 0);
    return (base + c + d + e) * qty;
  }, [p, size, crust, dough, extras, qty, isPizza]);

  // price counter tween (§7)
  useEffect(() => {
    const el = priceRef.current;
    if (!el) return;
    const from = prevPrice.current;
    prevPrice.current = price;
    if (from > 0 && from !== price && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const obj = { v: from };
      gsap.to(obj, {
        v: price,
        duration: 0.45,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = uah(obj.v)),
      });
    } else {
      el.textContent = uah(price);
    }
  }, [price]);

  const addToCart = () => {
    add({ id: p.id, size, crust, dough, extras, qty });
    setDrawerOpen(true);
  };

  const optBtn = (
    active: boolean,
    onClick: () => void,
    label: string,
    sub?: string,
    key?: string
  ) => (
    <button
      key={key ?? label}
      className={`opt${active ? ' active' : ''}`}
      onClick={(e) => {
        onClick();
        const el = e.currentTarget;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.15, ease: 'power2.out' });
        }
      }}
    >
      {label}
      {sub ? <small>{sub}</small> : null}
    </button>
  );

  return (
    <div className="product">
      <div className="imgw">
        <Image src={p.img} alt={p.name} width={900} height={700} priority />
      </div>
      <div>
        <p className="kicker">{p.tags.join(' · ')}</p>
        <h1 style={{ fontSize: 'clamp(30px,3.6vw,48px)' }}>{p.name}</h1>
        <p className="muted" style={{ marginTop: 14 }}>
          {p.desc}
        </p>
        <div className="ing-tags">
          {p.ingredients.map((i) => (
            <span className="ing" key={i}>
              {i}
            </span>
          ))}
        </div>

        {isPizza ? (
          <>
            <div className="opt-group">
              <span>Розмір</span>
              <div className="opt-row">
                {sizes.map((s) =>
                  optBtn(
                    size === s,
                    () => setSize(s),
                    SIZE_LABEL[s],
                    uah(p.prices[s] ?? 0),
                    String(s)
                  )
                )}
              </div>
            </div>
            <div className="opt-group">
              <span>Тісто</span>
              <div className="opt-row">
                {DOUGHS.map((d) =>
                  optBtn(
                    dough === d.id,
                    () => setDough(d.id),
                    d.name,
                    d.add ? `+${uah(d.add)}` : 'базово',
                    d.id
                  )
                )}
              </div>
            </div>
            <div className="opt-group">
              <span>Борт</span>
              <div className="opt-row">
                {CRUSTS.map((c) =>
                  optBtn(
                    crust === c.id,
                    () => setCrust(c.id),
                    c.name,
                    c.add ? `+${uah(c.add)}` : 'базово',
                    c.id
                  )
                )}
              </div>
            </div>
            <div className="opt-group">
              <span>Додатки</span>
              <div className="opt-row">
                {EXTRAS.map((x) =>
                  optBtn(
                    extras.includes(x.id),
                    () =>
                      setExtras((prev) =>
                        prev.includes(x.id) ? prev.filter((e) => e !== x.id) : [...prev, x.id]
                      ),
                    x.name,
                    `+${uah(x.add)}`,
                    x.id
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="combo-note">
            {p.kind === 'combo' ? 'Комбо фіксованого складу — вигідніше, ніж окремо.' : ''}
          </p>
        )}

        <div
          className="opt-group"
          style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}
        >
          <div className="qty">
            <button aria-label="менше" onClick={() => setQty(Math.max(1, qty - 1))}>
              −
            </button>
            <b>{qty}</b>
            <button aria-label="більше" onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>
          <div className="product-total" ref={priceRef}>
            {uah(price)}
          </div>
        </div>

        <div style={{ marginTop: 26, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button className="btn btn-fire" onClick={addToCart}>
            Додати в кошик
          </button>
          <TransitionLink className="btn btn-ghost" href="/menu">
            ← До меню
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
