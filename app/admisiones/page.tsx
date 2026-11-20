import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import InscripcionPublica from "./InscripcionPublica";

export const metadata: Metadata = {
  title: "Inscripción - UEC Luisa Cáceres de Arismendi",
  description:
    "Completa la planilla de inscripción digital del Centro de Educación Inicial Luisa Cáceres de Arismendi.",
};

export default function InscripcionPage() {
  return (
    <main className="flex-grow">
      <div className="print:hidden">
        <PageHero
          badge="Admisiones"
          title={
            <>
              Inscripción <span className="text-primary">digital</span>
            </>
          }
          description="Completa la planilla oficial desde casa o en el colegio, guarda tu avance y descarga el documento listo para imprimir."
          icon={ClipboardCheck}
          tone="primary"
        />

        <section className="mx-auto w-full max-w-7xl px-4 pb-3 pt-6 sm:px-6 sm:pt-8">
          <Reveal>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-container text-primary">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-on-surface">Guardado automático</p>
                  <p className="text-xs font-medium text-on-surface-variant">
                    No pierdes el avance si cierras la pestaña.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-container text-secondary">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-on-surface">Datos protegidos</p>
                  <p className="text-xs font-medium text-on-surface-variant">
                    Solo el personal autorizado consulta las planillas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sun-container text-on-sun-container">
                  <ClipboardCheck className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-on-surface">Lista para imprimir</p>
                  <p className="text-xs font-medium text-on-surface-variant">
                    Descarga la planilla en tamaño carta.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
        <InscripcionPublica />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 print:hidden">
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-xs font-semibold text-on-surface-variant">
            ¿Eres personal del colegio? El listado y detalle de inscripciones están en el panel
            administrativo.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary-dim"
          >
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Ir al panel
          </Link>
        </div>
      </section>
    </main>
  );
}
