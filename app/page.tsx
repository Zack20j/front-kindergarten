import {
  BookOpen,
  Heart,
  Smile,
  Sparkles,
  ShieldCheck,
  Paintbrush,
  Music,
  Users,
  MapPin,
  Mail,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Inicio", href: "#inicio" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Actividades", href: "#actividades" },
  { name: "Contacto", href: "#contacto" },
];

const reasons = [
  {
    title: "Atención personalizada",
    description: "Cada niño recibe apoyo cálido y seguimiento cercano en un entorno familiar.",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Aprendizaje divertido",
    description: "Juegos, arte y cuentos que desarrollan curiosidad y alegría por aprender.",
    icon: Smile,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Ambiente seguro",
    description: "Espacios pensados para el juego tranquilo con supervisión y confianza.",
    icon: ShieldCheck,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "Desarrollo integral",
    description: "Estimulación emocional, social y física con actividades variadas.",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
  },
];

const activities = [
  { title: "Juegos creativos", icon: Sparkles, color: "from-pink-200 via-rose-100 to-amber-100" },
  { title: "Pintura", icon: Paintbrush, color: "from-emerald-200 via-lime-100 to-sky-100" },
  { title: "Lectura", icon: BookOpen, color: "from-sky-200 via-indigo-100 to-violet-100" },
  { title: "Música", icon: Music, color: "from-amber-200 via-orange-100 to-pink-100" },
];

const galleryCards = [
  { label: "Exploración", accent: "bg-rose-100" },
  { label: "Arte y juegos", accent: "bg-sky-100" },
  { label: "Cuentos", accent: "bg-lime-100" },
  { label: "Risas", accent: "bg-amber-100" },
];

const testimonials = [
  {
    quote: "Nuestro hijo llegó emocionado cada mañana. El equipo es amoroso y muy atento.",
    name: "María G.",
    role: "Madre de Sofía",
  },
  {
    quote: "El ambiente es alegre y tranquilo. Se nota el cariño con el que trabajan.",
    name: "Carlos R.",
    role: "Padre de Mateo",
  },
];

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-800/60">{title}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {subtitle}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-sky-100 text-sky-700 shadow-sm shadow-sky-200">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">U.E.C. Luisa Cáceres</p>
              <p className="text-xs text-slate-500">Preescolar alegre</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
                {item.name}
              </a>
            ))}
          </nav>

          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-amber-300/40 transition hover:bg-amber-300"
          >
            Aula Virtual
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <section id="inicio" className="overflow-hidden bg-gradient-to-br from-[#fef3e8] via-[#fff5ff] to-[#ecfdf5] py-20 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="absolute right-0 top-0 hidden h-80 w-80 rounded-full bg-pink-200/70 blur-3xl md:block" />
          <div className="absolute left-0 bottom-0 hidden h-72 w-72 rounded-full bg-sky-200/70 blur-3xl md:block" />

          <div className="grid gap-12 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Educación inicial alegre y segura
              </div>
              <div className="max-w-xl space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Aprender jugando es crecer felices.
                </h1>
                <p className="text-lg leading-8 text-slate-600 sm:text-xl">
                  En U.E.C. Luisa Cáceres acompañamos a los más pequeños con cariño, creatividad y valores en un entorno lleno de color.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#nosotros" className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-300 transition hover:bg-sky-600">
                  Conócenos
                </a>
                <a href="#contacto" className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200 transition hover:bg-slate-50">
                  Inscripciones abiertas
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-pink-50 via-white to-emerald-50 p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-300 via-pink-300 to-amber-300 opacity-70" />
              <div className="grid gap-4 rounded-[2rem] bg-white/90 p-6 shadow-sm shadow-slate-200 sm:grid-cols-2">
                <div className="space-y-4 rounded-[1.75rem] bg-gradient-to-br from-sky-100 to-slate-50 p-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-sm shadow-sky-200">
                    <Smile className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Amigos nuevos</p>
                    <p className="mt-2 text-sm text-slate-600">Actividades para compartir y crear amistades.</p>
                  </div>
                </div>
                <div className="space-y-4 rounded-[1.75rem] bg-gradient-to-br from-amber-100 to-rose-100 p-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-amber-700 shadow-sm shadow-amber-200">
                    <Paintbrush className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Arte y creatividad</p>
                    <p className="mt-2 text-sm text-slate-600">Manos a la obra con pintura, música y cuentos.</p>
                  </div>
                </div>
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

      <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle title="¿Por qué elegirnos?" subtitle="Cuidamos a tus pequeños con alegría, cariño y aprendizaje." />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.title}
                className={`group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-slate-300`}
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${reason.color} shadow-sm`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{reason.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{reason.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="actividades" className="bg-gradient-to-br from-[#fef6ff] via-white to-[#effaf6] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="Actividades" subtitle="Descubre las experiencias que llenan nuestros días de alegría." />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.title}
                  className={`rounded-[2rem] border border-slate-200 bg-gradient-to-br ${activity.color} p-6 shadow-md shadow-slate-200/80 transition hover:-translate-y-1`}
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/90 text-slate-900 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{activity.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">Un espacio pensado para explorar talento y curiosidad.</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle title="Galería" subtitle="Momentos felices en nuestro preescolar." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryCards.map((card) => (
            <div key={card.label} className={`group relative overflow-hidden rounded-[2rem] ${card.accent} p-6 shadow-md shadow-slate-200/70 transition hover:scale-[1.02]`}>
              <div className="absolute inset-x-0 top-0 h-24 rounded-b-[2rem] bg-white/20 blur-2xl" />
              <div className="relative">
                <div className="mb-6 h-36 rounded-[1.75rem] bg-white/80" />
                <div className="space-y-2 text-slate-900">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-700/80">Galería</p>
                  <h3 className="text-2xl font-semibold">{card.label}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fdf7ff] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="Testimonios" subtitle="Lo que las familias cuentan sobre nuestra experiencia educativa." />
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-md shadow-slate-200/80">
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

      <section className="relative overflow-hidden bg-gradient-to-r from-sky-200 via-rose-200 to-amber-200 py-20">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] border border-white/70 bg-white/90 p-10 shadow-xl shadow-slate-200/60 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">¡Inscripciones abiertas!</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Tu peque merece un primer paso lleno de juegos, cuidado y ternura.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
                  Ven a conocer nuestras aulas, espacios exteriores y el equipo que te acompañará en cada etapa.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                >
                  Reserva tu visita
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Contacto</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Estamos listos para recibir a tus pequeños.</h2>
              <p className="mt-4 max-w-xl text-slate-600">Visítanos o escríbenos para conocer el proceso de inscripción y nuestras próximas jornadas abiertas.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-[#f9fafb] p-6 shadow-sm shadow-slate-200/50">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Dirección</p>
                <p className="mt-4 text-base font-semibold text-slate-950">Av. Bolivar, Sector Los Jardines</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">San Cristóbal, Táchira</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-[#f9fafb] p-6 shadow-sm shadow-slate-200/50">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Redes</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-amber-500" /> contacto@uec-luisa.edu.ve</p>
                  <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-500" /> +58 412 123 4567</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
            © 2026 U.E.C. Luisa Cáceres de Arismendi. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
