import type { GalleryCard } from "./landingData";
import SectionTitle from "./SectionTitle";

type GallerySectionProps = {
  cards: GalleryCard[];
};

export default function GallerySection({ cards }: GallerySectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionTitle title="Galería" subtitle="Momentos felices en nuestro preescolar." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`group relative overflow-hidden rounded-[2rem] ${card.accent} p-6 shadow-md shadow-slate-200/70 transition hover:scale-[1.02]`}
          >
            <div className="absolute inset-x-0 top-0 h-24 rounded-b-[2rem] bg-white/20 blur-2xl" />
            <div className="relative">
              <div className="mb-6 h-36 rounded-[1.75rem] bg-white/80" />
              <div className="space-y-2 text-slate-900">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-700/80">Galería</p>
                <h3 className="text-2xl font-semibold">{card.label}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
