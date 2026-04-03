import type { ActivityCard } from "./landingData";
import SectionTitle from "./SectionTitle";

type ActivitiesSectionProps = {
  activities: ActivityCard[];
};

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <section id="actividades" className="bg-gradient-to-br from-[#fef6ff] via-white to-[#effaf6] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          title="Actividades"
          subtitle="Descubre las experiencias que llenan nuestros días de alegría."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <article
                key={activity.title}
                className={`rounded-[2rem] border border-slate-200 bg-gradient-to-br ${activity.color} p-6 shadow-md shadow-slate-200/80 transition hover:-translate-y-1`}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/90 text-slate-900 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{activity.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">Un espacio pensado para explorar talento y curiosidad.</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
