'use client';

import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { CATEGORIES, PRODUCTS, Category } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

gsap.registerPlugin(Flip, useGSAP);

type Sort = 'popular' | 'price-asc' | 'price-desc';

export default function MenuPage() {
  const [tag, setTag] = useState<Category | 'всі'>('всі');
  const [sort, setSort] = useState<Sort>('popular');
  const gridRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const filtered = tag === 'всі' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.tags.includes(tag));
    filtered.sort((a, b) => {
      const pa = a.prices[32] ?? a.prices[26] ?? 0;
      const pb = b.prices[32] ?? b.prices[26] ?? 0;
      if (sort === 'price-asc') return pa - pb;
      if (sort === 'price-desc') return pb - pa;
      return b.popularity - a.popularity;
    });
    return filtered;
  }, [tag, sort]);

  const applyWithFlip = (fn: () => void) => {
    const grid = gridRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!grid || reduced) {
      fn();
      return;
    }
    const state = Flip.getState(grid.querySelectorAll('.card'));
    grid.style.minHeight = `${grid.offsetHeight}px`;
    fn();
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.03,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.3 }),
        onComplete: () => {
          grid.style.minHeight = '';
        },
      });
    });
  };

  return (
    <main>
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="wrap">
          <p className="kicker">Меню</p>
          <h1 style={{ fontSize: 'clamp(32px,4.4vw,58px)' }}>
            П&apos;ятнадцять позицій.
            <br />
            Жодної <span className="fire-text">зайвої</span>
          </h1>
          <p className="muted" style={{ margin: '16px 0 30px', maxWidth: '52ch' }}>
            Коротке меню — це чесність: кожна позиція відпрацьована до секунди в печі. Швидке
            додавання — одразу 32 см на тонкому тісті.
          </p>
          <div
            className="filters"
            style={{ marginBottom: 18 }}
            role="tablist"
            aria-label="Категорії"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.tag}
                className={`chip${tag === c.tag ? ' active' : ''}`}
                onClick={() => applyWithFlip(() => setTag(c.tag))}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="sort-row" style={{ marginBottom: 30 }}>
            <span className="muted" style={{ fontSize: 14 }}>
              Сортувати:
            </span>
            <select
              value={sort}
              aria-label="Сортування"
              onChange={(e) => applyWithFlip(() => setSort(e.target.value as Sort))}
            >
              <option value="popular">Спочатку популярні</option>
              <option value="price-asc">Дешевші спочатку</option>
              <option value="price-desc">Дорожчі спочатку</option>
            </select>
            <span className="muted" style={{ fontSize: 13 }}>
              {list.length} позицій
            </span>
          </div>
          <div className="grid" ref={gridRef}>
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
