'use client';

import { useCart } from '@/lib/cart';

export default function Toasts() {
  const { toasts } = useCart();
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.msg}
        </div>
      ))}
    </div>
  );
}
