'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode } from 'react';

/**
 * Internal link with "oven door" view transition: circle wipe expanding
 * from the click point (CSS vars --vt-x/--vt-y consumed by ::view-transition-new).
 */
export default function TransitionLink({
  href,
  children,
  className,
  onNavigate,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  [key: string]: unknown;
}) {
  const router = useRouter();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduced) {
      document.documentElement.style.setProperty('--vt-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--vt-y', `${e.clientY}px`);
      doc.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link href={href} className={className} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
