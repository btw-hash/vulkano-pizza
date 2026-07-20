'use client';

import Image from 'next/image';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useCart } from '@/lib/cart';
import { Product, uah } from '@/lib/data';
import TransitionLink from './motion/TransitionLink';

gsap.registerPlugin(MotionPathPlugin);

/** Card with quick-add: image clone flies to the cart button along an arc. */
export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const quickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isPizza = p.kind === 'pizza';
    add({
      id: p.id,
      size: 32,
      crust: 'classic',
      dough: 'thin',
      extras: [],
      qty: 1,
    });
    const cartBtn = document.getElementById('cart-btn');
    const img = e.currentTarget.closest('.card')?.querySelector('img');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cartBtn && img && !reduced) {
      const from = img.getBoundingClientRect();
      const to = cartBtn.getBoundingClientRect();
      const clone = img.cloneNode(true) as HTMLImageElement;
      clone.className = 'flight-clone';
      clone.style.cssText += `;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px`;
      document.body.appendChild(clone);
      gsap.to(clone, {
        duration: 0.7,
        ease: 'power2.in',
        scale: 0.15,
        rotate: 15,
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: (to.left - from.left) * 0.5, y: to.top - from.top - 120 },
            { x: to.left - from.left + to.width / 2 - from.width / 2, y: to.top - from.top },
          ],
          curviness: 1.2,
        },
        opacity: 0.6,
        onComplete: () => {
          clone.remove();
          gsap.fromTo(
            cartBtn,
            { scale: 1.3 },
            { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' }
          );
        },
      });
    }
    void isPizza;
  };

  return (
    <article className="card" data-id={p.id}>
      <TransitionLink className="imgw" href={`/product/${p.id}`}>
        {p.badge ? <span className={`badge${p.badgeGold ? ' gold' : ''}`}>{p.badge}</span> : null}
        <Image src={p.img} alt={p.name} width={520} height={400} loading="lazy" />
      </TransitionLink>
      <div className="card-body">
        <h3>
          <TransitionLink href={`/product/${p.id}`}>{p.name}</TransitionLink>
        </h3>
        <p>{p.desc}</p>
        <div className="card-row">
          <span className="price">
            {uah(p.prices[32] ?? p.prices[26] ?? 0)}{' '}
            {p.kind === 'pizza' ? <small>/ 32 см</small> : null}
          </span>
          <button className="add-btn" onClick={quickAdd}>
            У кошик
          </button>
        </div>
      </div>
    </article>
  );
}
