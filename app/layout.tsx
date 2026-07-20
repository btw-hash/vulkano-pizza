import type { Metadata } from 'next';
import { Unbounded, Golos_Text } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Drawer from '@/components/Drawer';
import Toasts from '@/components/Toasts';
import MotionRoot from '@/components/motion/MotionRoot';

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '800'],
  variable: '--font-display',
});
const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'VULKANO — піцерія на дровах · доставка гарячої піци',
  description: "Дров'яна піч 450°, тісто на заквасці 48 годин, доставка по місту за 30 хвилин.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23FF4D14' d='M16 2c3 5-2 7 2 11 2-2 3-4 2-7 5 3 8 8 8 13a12 12 0 0 1-24 0C4 12 10 6 16 2z'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${unbounded.variable} ${golos.variable}`}>
      <body className="bg-ember grain">
        <CartProvider>
          <MotionRoot>
            <Header />
            {children}
            <Footer />
            <Drawer />
            <Toasts />
          </MotionRoot>
        </CartProvider>
      </body>
    </html>
  );
}
