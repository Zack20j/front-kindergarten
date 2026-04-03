type SectionTitleProps = {
  title: string;
  subtitle: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-800/60">{title}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {subtitle}
      </p>
    </div>
  );
}
