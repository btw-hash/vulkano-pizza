import { PRODUCTS, productById } from '@/lib/data';
import Configurator from './configurator';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = productById(id);
  return { title: `${p?.name ?? 'Позиція'} — VULKANO` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="wrap">
          <Configurator id={id} />
        </div>
      </section>
    </main>
  );
}
