'use client';

import React, { useState } from 'react';
import { ClipboardCheck, FileText, Search } from 'lucide-react';
import { FormDataPlanilla, PlanillaTemplate } from './PlanillaTemplate';
import { usePdfGenerator } from './usePdfGenerator';
import { FormularioPlanilla } from './FormularioPlanilla';
import PdfPreviewFrame from './PdfPreviewFrame';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';

const STEPS = [
  { icon: ClipboardCheck, label: 'Completa tus datos' },
  { icon: Search, label: 'Revisa la vista previa' },
  { icon: FileText, label: 'Descarga tu planilla' },
];

export default function GeneradorPlanillaPage() {
  const [formData, setFormData] = useState<FormDataPlanilla | null>(null);
  const { targetRef, generarPdf, pdfBlobUrl, isGenerating } = usePdfGenerator();

  return (
    <main className="flex-grow">
      <PageHero
        badge="Admisiones"
        title={
          <>
            Genera tu <span className="text-primary">planilla</span>
          </>
        }
        description="Completa el formulario, revisa el documento y descarga tu planilla oficial lista para imprimir."
        icon={ClipboardCheck}
        tone="primary"
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 md:py-14">
        <Reveal>
          <ol className="mb-7 grid gap-2.5 sm:mb-8 sm:grid-cols-3 sm:gap-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.label}
                  className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun-container font-display text-sm font-extrabold text-on-sun-container sm:size-9">
                    {index + 1}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-on-surface">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal variant="left" className="lg:col-span-5">
            <FormularioPlanilla
              onSubmitData={setFormData}
              pdfBlobUrl={pdfBlobUrl}
              isGenerating={isGenerating}
              onProcesar={generarPdf}
            />
          </Reveal>

          <Reveal variant="right" delay={100} className="lg:col-span-7">
            <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_50px_-38px_rgba(31,48,56,0.45)] sm:rounded-[1.75rem]">
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-outline-variant/40 bg-surface-container-low px-4 py-3 sm:px-5 sm:py-3.5">
                <span className="flex items-center gap-2 font-display text-sm font-extrabold text-on-surface">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary-container text-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  Vista previa del documento
                </span>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container">
                  Tamaño carta
                </span>
              </div>

              <div className="bg-surface-container-high/40 p-3 sm:p-6">
                <PdfPreviewFrame>
                  <PlanillaTemplate ref={targetRef} data={formData} />
                </PdfPreviewFrame>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
