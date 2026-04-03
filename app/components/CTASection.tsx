type CTASectionProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
};

export default function CTASection({ title, subtitle, buttonLabel, buttonHref }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-200 via-rose-200 to-amber-200 py-20">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] border border-white/70 bg-white/90 p-10 shadow-xl shadow-slate-200/60 sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">¡Inscripciones abiertas!</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">{subtitle}</p>
            </div>
            <div className="flex items-center justify-center">
              <a
                href={buttonHref}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                {buttonLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
