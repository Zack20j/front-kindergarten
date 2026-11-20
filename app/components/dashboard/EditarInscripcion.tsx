"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, Loader2, Pencil } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  actualizarInscripcion,
  formFromApi,
  obtenerInscripcion,
} from "@/lib/inscripciones";
import type {
  InscripcionApiResponse,
  InscripcionFormValues,
  InscripcionPayload,
} from "@/types/inscripcion";
import InscripcionForm from "@/app/admisiones/InscripcionForm";

export default function EditarInscripcion({ id }: { id: string }) {
  const router = useRouter();
  const [inscripcion, setInscripcion] = useState<InscripcionApiResponse | null>(null);
  const [initialData, setInitialData] = useState<InscripcionFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    obtenerInscripcion(id)
      .then((response) => {
        if (!active) return;
        setInscripcion(response);
        setInitialData(formFromApi(response));
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : "No se pudo cargar la inscripción.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const guardar = async (payload: InscripcionPayload) => {
    return actualizarInscripcion(id, payload);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 py-24 text-on-surface-variant md:px-8">
        <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Cargando inscripción…</p>
      </div>
    );
  }

  if (error || !initialData || !inscripcion) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <Link
          href="/dashboard/inscripciones"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Volver al listado
        </Link>
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm font-semibold text-on-error-container"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-error" aria-hidden="true" />
          <p>{error ?? "No se pudo preparar la edición."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Link
        href={`/dashboard/inscripciones/${id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Volver al detalle
      </Link>

      <div className="mb-5">
        <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
          <Pencil className="size-3.5" aria-hidden="true" />
          Edición de inscripción · Folio N° {inscripcion.id}
        </p>
        <h1 className="mt-1 font-display text-[2rem] font-extrabold leading-tight text-on-surface">
          {inscripcion.student.lastNames}, {inscripcion.student.firstNames}
        </h1>
        <p className="mt-1 text-sm font-semibold text-on-surface-variant">
          Los cambios se guardan directamente en el sistema del colegio. El borrador local está
          desactivado en esta vista.
        </p>
      </div>

      <InscripcionForm
        initialData={initialData}
        onSubmit={guardar}
        submitLabel="Guardar cambios"
        storageKey={null}
        stickyProgress={false}
        onSaved={() => router.push(`/dashboard/inscripciones/${id}`)}
      />
    </div>
  );
}
