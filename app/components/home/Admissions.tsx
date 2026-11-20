import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, FileDown, Sparkles, Star } from 'lucide-react';
import AdmissionItem from '../ui/AdmissionItem';
import Reveal from '../ui/Reveal';
import PeekingKid from '../ui/PeekingKid';

const ADMISSION_REQUIREMENTS = [
  {
    title: 'Partida de nacimiento',
    description: 'Copia legible y actualizada del niño o niña.',
  },
  {
    title: 'Cédula de los representantes',
    description: 'De ambos padres o representantes legales.',
  },
  {
    title: 'Cartón de vacunas',
    description: 'Copia del control de vacunas al día.',
  },
  {
    title: 'Fotos tipo carnet',
    description: '4 del niño(a) y 2 de cada representante.',
  },
];

const STEPS = [
  { title: 'Agenda una visita', text: 'Ven a conocer el jardín y a nuestro equipo.' },
  { title: 'Entrega los recaudos', text: 'Revisamos juntos la documentación.' },
  { title: 'Entrevista familiar', text: 'Conversamos sobre las necesidades de tu peque.' },
  { title: '¡Bienvenido!', text: 'Formaliza la inscripción y comienza la aventura.' },
];

export default function Admissions() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 md:py-20">
      <div className="relative">
        <PeekingKid
          kid="nina"
          width={130}
          delay={3.5}
          duration={18}
          className="right-[12%]"
        />
        <Reveal variant="zoom">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-outline-variant/45 bg-tertiary-container p-5 shadow-[0_36px_70px_-44px_rgba(92,28,11,0.55)] sm:rounded-[2.25rem] sm:p-9 md:rounded-[2.75rem] md:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-dots opacity-25" />
              <div className="blob-shape -right-16 -top-20 h-64 w-64 bg-sun-container/60 blur-2xl" />
              <div className="blob-shape -bottom-24 -left-16 h-64 w-64 bg-surface-container-lowest/50 blur-2xl" />
              <Star className="absolute left-[46%] top-6 hidden size-6 rotate-12 text-on-tertiary-container/25 sm:block" />
            </div>

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <div className="flex flex-col">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-lowest/80 px-4 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-on-tertiary-container sm:text-[0.72rem] sm:tracking-[0.16em]">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Proceso de admisión
                </span>

                <h2 className="mt-4 text-balance font-display text-section font-extrabold text-on-tertiary-container md:mt-5">
                  Tu peque tiene un lugar aquí
                </h2>
                <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-on-tertiary-container/85 md:mt-4 md:text-lg">
                  Únete a nuestra familia. Estos son los recaudos básicos para iniciar
                  la inscripción; nosotros te acompañamos en cada paso.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {ADMISSION_REQUIREMENTS.map((req) => (
                    <AdmissionItem key={req.title} title={req.title} description={req.description} />
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                  <Link href="/admisiones" className="btn btn-primary w-full sm:w-auto">
                    Generar planilla
                    <FileDown className="size-5" aria-hidden="true" />
                  </Link>
                  <Link href="/contacto" className="btn btn-ghost w-full sm:w-auto">
                    Hablar con admisiones
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-surface-container-lowest/70 bg-surface-container-lowest/90 p-4 shadow-[0_24px_50px_-34px_rgba(92,28,11,0.5)] backdrop-blur-sm sm:rounded-[1.9rem] sm:p-7">
                <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-on-surface sm:text-2xl">
                  <CheckCircle2 className="size-6 text-secondary" aria-hidden="true" />
                  Así de fácil
                </h3>

                <ol className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="relative flex gap-3.5 sm:gap-4">
                      {index < STEPS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[17px] top-9 h-[calc(100%-4px)] w-0.5 rounded-full bg-outline-variant/70"
                        />
                      )}
                      <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-extrabold text-on-primary shadow-sm">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">
                        <span className="block font-display text-base font-extrabold text-on-surface">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium leading-relaxed text-on-surface-variant">
                          {step.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-sun-container px-4 py-3 text-on-sun-container sm:mt-6">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-xs font-bold leading-relaxed">
                    Cupos limitados por grupo. Te recomendamos iniciar el proceso con
                    anticipación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
