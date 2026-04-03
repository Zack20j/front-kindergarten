import type { FeatureCard } from "./landingData";
import { Sparkles } from "lucide-react";

type ActionLink = {
  label: string;
  href: string;
};

type HeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  highlights: FeatureCard[];
};

export default function Hero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights,
}: HeroProps) {
  return (
    <section id="inicio" className="overflow-hidden bg-gradient-to-br from-[#fef3e8] via-[#fff5ff] to-[#ecfdf5] py-20 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="absolute right-0 top-0 hidden h-80 w-80 rounded-full bg-pink-200/70 blur-3xl md:block" />
        <div className="absolute left-0 bottom-0 hidden h-72 w-72 rounded-full bg-sky-200/70 blur-3xl md:block" />

        <div className="grid gap-12 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {badge}
            </div>
            <div className="max-w-xl space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
              <p className="text-lg leading-8 text-slate-600 sm:text-xl">{description}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={primaryAction.href}
                className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-300 transition hover:bg-sky-600"
              >
                {primaryAction.label}
              </a>
              <a
                href={secondaryAction.href}
                className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200 transition hover:bg-slate-50"
              >
                {secondaryAction.label}
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-pink-50 via-white to-emerald-50 p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-300 via-pink-300 to-amber-300 opacity-70" />
            <div className="grid gap-4 rounded-[2rem] bg-white/90 p-6 shadow-sm shadow-slate-200 sm:grid-cols-2">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className={`space-y-4 rounded-[1.75rem] bg-gradient-to-br ${highlight.color} p-5`}
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-900 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{highlight.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-lime-100 to-cyan-100 p-6 shadow-inner shadow-slate-200/60">
              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm shadow-slate-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-3xl bg-pink-100" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Galería inspiradora</p>
                    <p className="text-xs text-slate-500">Mira cómo disfrutan los pequeños cada día.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-28 rounded-3xl bg-sky-200" />
                  <div className="h-28 rounded-3xl bg-amber-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
