import type { FeatureCard } from "./landingData";
import SectionTitle from "./SectionTitle";

type WhyChooseUsSectionProps = {
  items: FeatureCard[];
};

export default function WhyChooseUsSection({ items }: WhyChooseUsSectionProps) {
  return (
    <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionTitle
        title="¿Por qué elegirnos?"
        subtitle="Cuidamos a tus pequeños con alegría, cariño y aprendizaje."
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-slate-300"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${item.color} shadow-sm`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
