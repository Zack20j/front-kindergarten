import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Sparkles } from 'lucide-react';

const HERO_PHOTOS = [
  {
    imageSrc: '/images/imagen 10.jpg',
    alt: 'Niños de la UEC Luisa Cáceres de Arismendi participando en actividades culturales',
    caption: 'Días especiales',
    label: 'Actividades culturales',
  },
  {
    imageSrc: '/images/imagen 3.jpg',
    alt: 'Niños jugando y aprendiendo en las aulas del preescolar',
    caption: 'Aprender jugando',
    label: 'Curiosidad y juego',
  },
  {
    imageSrc: '/images/imagen 8.jpg',
    alt: 'Docentes acompañando actividades recreativas con los niños',
    caption: 'Acompañar siempre',
    label: 'Cuidado cercano',
  },
];

const TRUST_IMAGES = ['/images/imagen 1.jpg', '/images/imagen 5.jpg', '/images/imagen 9.jpg'];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-2 sm:px-6 sm:pb-14 md:pt-4 lg:pb-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="blob-shape -left-10 top-24 h-52 w-52 bg-sun-container/80 blur-3xl" />
        <div className="blob-shape -right-16 bottom-0 h-64 w-64 bg-primary-container/60 blur-3xl" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-sun/30 bg-sun-container px-4 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-on-sun-container sm:text-[0.72rem] sm:tracking-[0.16em]">
            <Sparkles className="size-3.5 text-tertiary" aria-hidden="true" />
            Inscripciones abiertas 2026–2027
          </span>

          <h1
            id="hero-title"
            className="animate-rise delay-1 mt-4 text-balance font-display text-hero font-extrabold text-on-surface"
          >
            Educando con{' '}
            <span className="relative inline-block text-tertiary">
              amor y valores
              <svg
                aria-hidden="true"
                viewBox="0 0 220 14"
                className="absolute -bottom-1 left-0 h-3 w-full text-sun/80"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 10C50 3 110 3 217 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="animate-rise delay-2 mt-5 max-w-xl text-lead font-medium text-on-surface-variant">
            Un espacio seguro y estimulante donde cada niño descubre su potencial a través
            del juego y la exploración.
          </p>

          <div className="animate-rise delay-3 mt-6 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <Link href="/admisiones" className="btn btn-sun btn-lg w-full sm:w-auto">
              Solicitar cupo
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="#nosotros"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold text-primary transition-colors hover:bg-primary-container/50 hover:text-primary-dim"
            >
              <HeartHandshake className="size-5" aria-hidden="true" />
              Conócenos
            </Link>
          </div>

          <div className="animate-rise delay-4 mt-6 flex items-center gap-3">
            <div className="flex -space-x-3" aria-hidden="true">
              {TRUST_IMAGES.map((src) => (
                <span
                  key={src}
                  className="relative size-9 overflow-hidden rounded-full border-2 border-surface-container-lowest shadow-sm sm:size-10"
                >
                  <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                </span>
              ))}
            </div>
            <p className="max-w-[13rem] text-[0.66rem] font-bold uppercase leading-snug tracking-[0.12em] text-on-surface-variant">
              Familias que crecen con nosotros
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-3 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-primary">
            Así se ve un día en el jardín
          </p>

          <div
            role="region"
            aria-label="Momentos en la UEC Luisa Cáceres"
            tabIndex={0}
            className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:h-[560px] lg:grid-cols-2 lg:grid-rows-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {HERO_PHOTOS.map((photo, index) => (
              <figure
                key={photo.imageSrc}
                className={`group relative aspect-[4/3] w-[82vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border-[5px] border-surface-container-lowest bg-surface-container-high shadow-[0_22px_44px_-30px_rgba(31,48,56,0.45)] sm:aspect-[4/5] sm:w-[68vw] lg:aspect-auto lg:h-full lg:w-full lg:max-w-none ${
                  index === 0 ? 'lg:row-span-2' : ''
                }`}
              >
                <Image
                  src={photo.imageSrc}
                  alt={photo.alt}
                  fill
                  preload={index === 0}
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 68vw, 320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03212c]/55 via-transparent to-transparent" />

                <figcaption className="absolute inset-x-3 bottom-3 rounded-xl border border-white/40 bg-surface-container-lowest/95 px-3 py-2 shadow-sm backdrop-blur">
                  <span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-primary">
                    {photo.label}
                  </span>
                  <span className="mt-0.5 block font-display text-sm font-extrabold leading-tight text-on-surface">
                    {photo.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.14em] text-on-surface-variant lg:hidden">
            Desliza para ver más
          </p>
        </div>
      </div>
    </section>
  );
}
