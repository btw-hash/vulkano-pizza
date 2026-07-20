'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  CRUSTS,
  DOUGHS,
  EXTRAS,
  PROMO,
  DELIVERY_FEE,
  DELIVERY_FREE_FROM,
  productById,
} from './data';

export interface CartLine {
  id: string;
  size: 26 | 32 | 40;
  crust: string;
  dough: string;
  extras: string[];
  qty: number;
}

export interface Order {
  no: string;
  total: number;
  at: number;
  name: string;
}

const CART_KEY = 'vulkano_cart_v2';
const ORDER_KEY = 'vulkano_order_v2';

export function linePrice(l: CartLine): number {
  const p = productById(l.id);
  if (!p) return 0;
  const base = p.prices[l.size] ?? p.prices[32] ?? 0;
  if (p.kind !== 'pizza') return base;
  const crust = CRUSTS.find((c) => c.id === l.crust)?.add ?? 0;
  const dough = DOUGHS.find((d) => d.id === l.dough)?.add ?? 0;
  const extras = l.extras.reduce((s, e) => s + (EXTRAS.find((x) => x.id === e)?.add ?? 0), 0);
  return base + crust + dough + extras;
}

const lineKey = (l: CartLine) =>
  [l.id, l.size, l.crust, l.dough, [...l.extras].sort().join('+')].join('|');

interface CartCtx {
  cart: CartLine[];
  count: number;
  promo: string;
  setPromo: (code: string) => boolean;
  add: (line: CartLine) => void;
  setQty: (index: number, qty: number) => void;
  clear: () => void;
  totals: { subtotal: number; discount: number; delivery: number; total: number };
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  order: Order | null;
  placeOrder: (name: string) => Order;
  toasts: { id: number; msg: string }[];
  toast: (msg: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [promo, setPromoState] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartLine[];
      setCart(raw.filter((l) => l && productById(l.id)));
    } catch {}
    try {
      setOrder(JSON.parse(localStorage.getItem(ORDER_KEY) ?? 'null'));
    } catch {}
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }, []);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const add = useCallback(
    (line: CartLine) => {
      setCart((prev) => {
        const key = lineKey(line);
        const found = prev.find((l) => lineKey(l) === key);
        const next = found
          ? prev.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + line.qty } : l))
          : [...prev, line];
        localStorage.setItem(CART_KEY, JSON.stringify(next));
        return next;
      });
      toast(`${productById(line.id)?.name} — у кошику`);
    },
    [toast]
  );

  const setQty = useCallback((index: number, qty: number) => {
    setCart((prev) => {
      const next = prev
        .map((l, i) => (i === index ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0);
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), [persist]);

  const setPromo = useCallback((code: string) => {
    const up = code.trim().toUpperCase();
    if (PROMO[up]) {
      setPromoState(up);
      return true;
    }
    setPromoState('');
    return false;
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, l) => s + linePrice(l) * l.qty, 0);
    const discount = promo && PROMO[promo] ? subtotal * PROMO[promo] : 0;
    const delivery =
      subtotal === 0 ? 0 : subtotal - discount >= DELIVERY_FREE_FROM ? 0 : DELIVERY_FEE;
    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [cart, promo]);

  const placeOrder = useCallback(
    (name: string) => {
      const o: Order = {
        no: 'V-' + String(Math.floor(1000 + Math.random() * 9000)),
        total: totals.total,
        at: Date.now(),
        name,
      };
      localStorage.setItem(ORDER_KEY, JSON.stringify(o));
      setOrder(o);
      persist([]);
      return o;
    },
    [totals.total, persist]
  );

  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <Ctx.Provider
      value={{
        cart,
        count,
        promo,
        setPromo,
        add,
        setQty,
        clear,
        totals,
        drawerOpen,
        setDrawerOpen,
        order,
        placeOrder,
        toasts,
        toast,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart outside CartProvider');
  return ctx;
}
