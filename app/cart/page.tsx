'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useCart, linePrice } from '@/lib/cart';
import { CRUSTS, EXTRAS, SIZE_LABEL, productById, uah } from '@/lib/data';
import TransitionLink from '@/components/motion/TransitionLink';

export default function CartPage() {
  const { cart, totals, setQty, setPromo, placeOrder, toast } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [pay, setPay] = useState<'card' | 'cash'>('card');
  const [success, setSuccess] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const applyPromo = () => {
    if (setPromo(promoInput)) toast('Промокод застосовано: −10%');
    else toast('Такого промокоду немає');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) {
      toast('Кошик порожній — додайте піцу');
      return;
    }
    const form = formRef.current!;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const addr = (form.elements.namedItem('addr') as HTMLInputElement).value;
    const bad: Record<string, boolean> = {
      name: name.trim().length < 2,
      phone: !/^\+?3?8?\(?0\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(
        phone.replace(/\s/g, '')
      ),
      addr: addr.trim().length < 6,
    };
    setInvalid(bad);
    if (Object.values(bad).some(Boolean)) {
      toast('Перевірте виділені поля');
      return;
    }
    const order = placeOrder(name.trim());
    setSuccess(order.no);
    requestAnimationFrame(() => {
      const overlay = successRef.current;
      if (!overlay || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // flame-burst shockwave (§8)
      const ring = overlay.querySelector('.burst-ring');
      const check = overlay.querySelector<SVGPathElement>('.succ-ring path');
      if (ring) {
        gsap.fromTo(
          ring,
          { scale: 0, opacity: 0.5 },
          { scale: 8, opacity: 0, duration: 0.4, ease: 'expo.out' }
        );
      }
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('span');
        p.className = 'stat-ember';
        p.style.cssText = 'left:50%;top:40%';
        overlay.appendChild(p);
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 120;
        gsap.fromTo(
          p,
          { opacity: 1, scale: 1 },
          {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d,
            opacity: 0,
            scale: 0.4,
            duration: 0.6,
            delay: i * 0.01,
            ease: 'power2.out',
            onComplete: () => p.remove(),
          }
        );
      }
      if (check) {
        const len = check.getTotalLength();
        gsap.fromTo(
          check,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.6, delay: 0.15, ease: 'power3.out' }
        );
      }
    });
  };

  return (
    <main>
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="wrap">
          <p className="kicker">Оформлення</p>
          <h1 style={{ fontSize: 'clamp(30px,4vw,52px)', marginBottom: 34 }}>
            Кошик і <span className="fire-text">доставка</span>
          </h1>
          {cart.length === 0 && !success ? (
            <div style={{ textAlign: 'center', padding: '70px 0' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 54,
                  color: 'var(--gold)',
                }}
              >
                440°
              </div>
              <h2 style={{ margin: '14px 0' }}>Кошик порожній</h2>
              <p className="muted" style={{ marginBottom: 28 }}>
                Піч гаряча, тісто чекає. Виправимо?
              </p>
              <TransitionLink className="btn btn-fire" href="/menu">
                Обрати піцу
              </TransitionLink>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cart.map((l, i) => {
                  const p = productById(l.id)!;
                  const crust = CRUSTS.find((c) => c.id === l.crust);
                  const ex = l.extras
                    .map((e) => EXTRAS.find((x) => x.id === e)?.name)
                    .filter(Boolean);
                  return (
                    <div className="cart-item" key={i}>
                      <Image src={p.img} alt={p.name} width={88} height={88} />
                      <div>
                        <h4>{p.name}</h4>
                        <div className="meta">
                          {p.kind === 'pizza'
                            ? `${SIZE_LABEL[l.size]}${crust?.add ? ' · ' + crust.name : ''}${ex.length ? ' · ' + ex.join(', ') : ''}`
                            : p.kind === 'combo'
                              ? 'комбо'
                              : ''}
                        </div>
                        <div className="mini-qty" style={{ marginTop: 10 }}>
                          <button onClick={() => setQty(i, l.qty - 1)}>−</button>
                          <b>{l.qty}</b>
                          <button onClick={() => setQty(i, l.qty + 1)}>+</button>
                        </div>
                      </div>
                      <div className="col-r">
                        <button className="rm" aria-label="прибрати" onClick={() => setQty(i, 0)}>
                          ×
                        </button>
                        <div className="price">{uah(linePrice(l) * l.qty)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className="checkout-box" ref={formRef} onSubmit={submit} noValidate>
                <h3 style={{ marginBottom: 18 }}>Дані доставки</h3>
                <div className={`form-row${invalid.name ? ' invalid' : ''}`}>
                  <label htmlFor="f-name">Ім&apos;я</label>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    placeholder="Як до вас звертатись?"
                    className={invalid.name ? 'err' : ''}
                  />
                  <div className="form-err">Вкажіть ім&apos;я — мінімум 2 символи.</div>
                </div>
                <div className={`form-row${invalid.phone ? ' invalid' : ''}`}>
                  <label htmlFor="f-phone">Телефон</label>
                  <input
                    id="f-phone"
                    name="phone"
                    type="tel"
                    placeholder="+38 (0__) ___ __ __"
                    className={invalid.phone ? 'err' : ''}
                  />
                  <div className="form-err">Формат: +38 (0XX) XXX XX XX.</div>
                </div>
                <div className={`form-row${invalid.addr ? ' invalid' : ''}`}>
                  <label htmlFor="f-addr">Адреса</label>
                  <input
                    id="f-addr"
                    name="addr"
                    type="text"
                    placeholder="Вулиця, будинок, квартира"
                    className={invalid.addr ? 'err' : ''}
                  />
                  <div className="form-err">Занадто коротка адреса.</div>
                </div>
                <div className="form-row">
                  <label>Оплата</label>
                  <div className="pay-row">
                    <button
                      type="button"
                      className={`opt pay-opt${pay === 'card' ? ' active' : ''}`}
                      onClick={() => setPay('card')}
                    >
                      Карткою онлайн
                    </button>
                    <button
                      type="button"
                      className={`opt pay-opt${pay === 'cash' ? ' active' : ''}`}
                      onClick={() => setPay('cash')}
                    >
                      Готівка кур&apos;єру
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <label htmlFor="promo-input">Промокод</label>
                  <div className="promo-row">
                    <input
                      id="promo-input"
                      type="text"
                      placeholder="VULKANO10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={applyPromo}>
                      OK
                    </button>
                  </div>
                </div>
                <div className="total-lines" id="totals">
                  <div className="total-line">
                    <span>Сума</span>
                    <span>{uah(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 ? (
                    <div className="total-line">
                      <span>Промокод −10%</span>
                      <span className="ok">−{uah(totals.discount)}</span>
                    </div>
                  ) : null}
                  <div className="total-line">
                    <span>Доставка</span>
                    <span>
                      {totals.delivery === 0 ? (
                        <span className="ok">безкоштовно</span>
                      ) : (
                        uah(totals.delivery)
                      )}
                    </span>
                  </div>
                  <div className="total-line grand">
                    <span>Разом</span>
                    <b>{uah(totals.total)}</b>
                  </div>
                </div>
                <button className="btn btn-fire" type="submit" style={{ width: '100%' }}>
                  Підтвердити замовлення
                </button>
                <p className="muted" style={{ fontSize: 12, marginTop: 12, textAlign: 'center' }}>
                  Безкоштовна доставка від 600 ₴
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      <div className={`success-overlay${success ? ' show' : ''}`} ref={successRef}>
        <div className="success-card">
          <div
            className="burst-ring"
            style={{
              position: 'absolute',
              left: '50%',
              top: '38%',
              width: 60,
              height: 60,
              marginLeft: -30,
              border: '2px solid var(--gold)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div className="succ-ring">
            <svg viewBox="0 0 52 52">
              <path d="M14 27l8 8 16-18" stroke="var(--gold)" />
            </svg>
          </div>
          <h2>Прийнято!</h2>
          <p>
            Замовлення <b className="order-no">{success}</b> вже на кухні.
            <br />
            Піч розігріта — стежте за статусом у трекері.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <TransitionLink className="btn btn-fire" href="/tracking">
              Стежити за замовленням
            </TransitionLink>
            <TransitionLink className="btn btn-ghost" href="/">
              На головну
            </TransitionLink>
          </div>
        </div>
      </div>
    </main>
  );
}
