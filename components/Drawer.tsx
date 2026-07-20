'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCart, linePrice } from '@/lib/cart';
import { productById, CRUSTS, SIZE_LABEL, uah } from '@/lib/data';
import TransitionLink from './motion/TransitionLink';

export default function Drawer() {
  const { cart, totals, drawerOpen, setDrawerOpen, setQty } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setDrawerOpen]);

  return (
    <>
      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`drawer${drawerOpen ? ' open' : ''}`} aria-label="Кошик">
        <div className="drawer-head">
          <h3>Ваше замовлення</h3>
          <button
            className="drawer-close"
            aria-label="Закрити"
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <div className="big">440°</div>
              Кошик порожній.
              <br />
              Піч вже гаряча — обирайте піцу.
            </div>
          ) : (
            cart.map((l, i) => {
              const p = productById(l.id)!;
              const crust = CRUSTS.find((c) => c.id === l.crust);
              return (
                <div className="drawer-item" key={i}>
                  <Image src={p.img} alt={p.name} width={64} height={64} />
                  <div>
                    <h4>{p.name}</h4>
                    <div className="meta">
                      {p.kind === 'pizza'
                        ? `${SIZE_LABEL[l.size]}${crust && crust.add ? ' · ' + crust.name : ''}`
                        : p.kind === 'combo'
                          ? 'комбо'
                          : ''}
                    </div>
                    <div className="mini-qty">
                      <button aria-label="менше" onClick={() => setQty(i, l.qty - 1)}>
                        −
                      </button>
                      <b>{l.qty}</b>
                      <button aria-label="більше" onClick={() => setQty(i, l.qty + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button className="rm" aria-label="прибрати" onClick={() => setQty(i, 0)}>
                      ×
                    </button>
                    <div className="price">{uah(linePrice(l) * l.qty)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="drawer-foot">
          {cart.length === 0 ? (
            <TransitionLink
              className="btn btn-fire btn-sm"
              href="/menu"
              onNavigate={() => setDrawerOpen(false)}
              style={{ width: '100%' }}
            >
              До меню
            </TransitionLink>
          ) : (
            <>
              <div className="drawer-total">
                <span className="muted">Разом</span>
                <b>{uah(totals.subtotal)}</b>
              </div>
              <TransitionLink
                className="btn btn-fire"
                href="/cart"
                onNavigate={() => setDrawerOpen(false)}
                style={{ width: '100%' }}
              >
                Оформити замовлення
              </TransitionLink>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
