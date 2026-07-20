'use client';

import { usePathname } from 'next/navigation';
import TransitionLink from './motion/TransitionLink';
import { useCart } from '@/lib/cart';

const links = [
  { href: '/menu', label: 'Меню' },
  { href: '/about', label: 'Про піч' },
  { href: '/tracking', label: 'Де моє замовлення' },
];

export default function Header() {
  const { count, setDrawerOpen } = useCart();
  const path = usePathname();

  return (
    <header className="site-head vt-header">
      <div className="wrap">
        <TransitionLink className="logo" href="/">
          VULKA<span>N</span>O
        </TransitionLink>
        <nav className="nav-links" id="nav-links">
          {links.map((l) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              className={path?.startsWith(l.href) ? 'active' : ''}
            >
              {l.label}
            </TransitionLink>
          ))}
        </nav>
        <button className="cart-btn" id="cart-btn" onClick={() => setDrawerOpen(true)}>
          Кошик · <span className="count">{count}</span>
        </button>
        <button
          className="burger"
          aria-label="Меню"
          onClick={(e) => {
            e.currentTarget.classList.toggle('open');
            document.getElementById('nav-links')?.classList.toggle('open');
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
