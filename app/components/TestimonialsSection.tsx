import type { Testimonial } from "./landingData";
import SectionTitle from "./SectionTitle";
import { Heart } from "lucide-react";

type TestimonialsSectionProps = {
  items: Testimonial[];
};

export default function TestimonialsSection({ items }: TestimonialsSectionProps) {
  return (
    <section className="bg-[#fdf7ff] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          title="Testimonios"
          subtitle="Lo que las familias cuentan sobre nuestra experiencia educativa."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-md shadow-slate-200/80"
            >
              <p className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 shadow-sm">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
