import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Cloud,
  Compass,
  House,
  Images,
  MessageCircleHeart,
  Newspaper,
  Palette,
  Sparkles,
  Star,
} from "lucide-react";

const QUICK_LINKS = [  {
    href: "/",
    label: "Inicio",
    description: "Volver al jardín",
    icon: House,
    tone: "bg-primary-container text-primary",
  },
  {
    href: "/cartelera",
    label: "Cartelera",
    description: "Novedades y fechas",
    icon: Newspaper,
    tone: "bg-secondary-container text-secondary",
  },
  {
    href: "/galeria",
    label: "Galería",
    description: "Momentos del día a día",
    icon: Images,
    tone: "bg-tertiary-container text-tertiary",
  },
  {
    href: "/admisiones",
    label: "Admisiones",
    description: "Inscripciones abiertas",
    icon: ClipboardCheck,
    tone: "bg-sun-container text-on-sun-container",
  },
];

export const metadata: Metadata = {
  title: "Página no encontrada - UEC Luisa Cáceres",
  description: "La página que buscas no existe o cambió de lugar.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex-grow">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="blob-shape -left-24 -top-32 h-72 w-72 bg-primary-container/60 blur-2xl" />
          <div className="blob-shape -right-20 top-10 h-64 w-64 bg-sun-container/70 blur-2xl" />
          <div className="blob-shape bottom-0 left-1/3 h-56 w-56 bg-tertiary-container/50 blur-3xl" />
          <div className="absolute inset-0 bg-dots opacity-[0.35]" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
          <span className="animate-float delay-1 absolute left-[10%] top-[24%] grid size-14 place-items-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/80 text-sun-dim shadow-sm backdrop-blur">
            <Star className="size-6" />
          </span>
          <span className="animate-float-slow absolute right-[11%] top-[20%] grid size-16 place-items-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/80 text-primary shadow-sm backdrop-blur">
            <Cloud className="size-7" />
          </span>
          <span className="animate-wiggle delay-3 absolute bottom-[18%] left-[16%] grid size-14 place-items-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/80 text-tertiary shadow-sm backdrop-blur">
            <Palette className="size-6" />
          </span>
          <span className="animate-drift absolute bottom-[22%] right-[15%] grid size-14 place-items-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/80 text-secondary shadow-sm backdrop-blur">
            <Sparkles className="size-6" />
          </span>
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-10 pt-8 text-center sm:px-6 md:pb-20 md:pt-16">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-primary backdrop-blur">
            <Compass className="size-4" aria-hidden="true" />
            Error 404
          </span>

          <div aria-hidden="true" className="mt-8 flex select-none items-end justify-center gap-1 sm:gap-2">
            <span className="animate-pop font-display text-[6rem] font-extrabold leading-none text-primary sm:text-[8rem]">
              4
            </span>

            <span className="animate-pop delay-1 relative mb-2 grid size-[5.5rem] place-items-center rounded-full border-[6px] border-sun bg-sun-container shadow-[inset_0_-10px_0_rgba(0,0,0,0.06)] sm:size-[7rem]">
              <span className="absolute left-[27%] top-[35%] size-2.5 rounded-full bg-on-sun-container sm:size-3" />
              <span className="absolute right-[27%] top-[35%] size-2.5 rounded-full bg-on-sun-container sm:size-3" />
              <span className="absolute left-[17%] top-[53%] size-2.5 rounded-full bg-tertiary/45 sm:size-3" />
              <span className="absolute right-[17%] top-[53%] size-2.5 rounded-full bg-tertiary/45 sm:size-3" />
              <svg viewBox="0 0 40 20" className="mt-5 h-4 w-8 text-on-sun-container sm:h-5 sm:w-10">
                <path
                  d="M4 4c6 10 26 10 32 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="animate-pop delay-2 font-display text-[6rem] font-extrabold leading-none text-tertiary sm:text-[8rem]">
              4
            </span>
          </div>

          <h1 className="animate-rise delay-1 mt-6 max-w-2xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-balance text-on-surface sm:text-4xl md:text-5xl">
            ¡Ups! Esta página{" "}
            <span className="relative inline-block text-primary">
              se fue a jugar
              <svg
                aria-hidden="true"
                viewBox="0 0 220 14"
                className="absolute -bottom-1 left-0 h-3 w-full text-sun/70"
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

          <p className="animate-rise delay-2 mt-5 max-w-xl text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
            No encontramos la página que buscabas. Puede que el enlace haya cambiado o que
            ya no exista. Te ayudamos a volver al camino.
          </p>

          <div className="animate-rise delay-3 mt-8 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
            <Link href="/" className="btn btn-primary btn-lg w-full sm:w-auto">
              <House className="size-5" aria-hidden="true" />
              Volver al inicio
            </Link>
            <Link href="/cartelera" className="btn btn-ghost btn-lg w-full sm:w-auto">
              <Newspaper className="size-5" aria-hidden="true" />
              Ver la cartelera
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-12 sm:px-6 md:pb-20">
        <div className="rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-low p-5 sm:rounded-[2rem] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="grid size-10 place-items-center rounded-xl bg-sun-container text-on-sun-container"
              aria-hidden="true"
            >
              <Sparkles className="size-5" />
            </span>
            <h2 className="font-display text-xl font-extrabold text-on-surface">
              Quizás buscabas...
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ href, label, description, icon: Icon, tone }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_32px_-24px_rgba(31,48,56,0.45)]"
              >
                <span className={`icon-tile size-11 shrink-0 ${tone}`} aria-hidden="true">
                  <Icon className="size-5" strokeWidth={2.1} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-extrabold text-on-surface">
                    {label}
                  </span>
                  <span className="block text-xs font-semibold text-on-surface-variant">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  className="ml-auto size-4 shrink-0 text-on-surface-variant/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm font-semibold text-on-surface-variant">
          <MessageCircleHeart className="size-4 text-tertiary" aria-hidden="true" />
          ¿Necesitas ayuda?{" "}
          <Link
            href="/contacto"
            className="font-extrabold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Escríbenos
          </Link>{" "}
          y te orientamos.
        </p>
      </section>
    </main>
  );
}
