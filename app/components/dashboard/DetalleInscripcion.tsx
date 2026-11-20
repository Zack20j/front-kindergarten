"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  HeartPulse,
  Loader2,
  MapPin,
  PenLine,
  Pencil,
  Phone,
  Printer,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  DOCUMENTO_MIME_TYPES,
  descargarDocumentoInscripcion,
  formFromApi,
  obtenerInscripcion,
} from "@/lib/inscripciones";
import {
  DOCUMENTOS,
  GRUPO_OPCIONES,
  PROCEDENCIA_OPCIONES,
  RESPONSABLE_OPCIONES,
  RETIRO_OPCIONES,
  SEXO_OPCIONES,
  TURNO_OPCIONES,
} from "@/data/inscripcion";
import {
  calcularEdad,
  formatearEdad,
  formatearFecha,
  fechaLarga,
} from "@/lib/venezuela";
import type {
  EnrollmentDocumentType,
  GuardianApiResponse,
  InscripcionApiResponse,
} from "@/types/inscripcion";
import PlanillaImpresion from "@/app/admisiones/PlanillaImpresion";

function label(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function siNo(value: boolean): string {
  return value ? "Sí" : "No";
}

function GuardianDetail({
  title,
  guardian,
}: {
  title: string;
  guardian: GuardianApiResponse | null;
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-primary-container text-primary">
          <UserRound className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-on-surface">
          {title}
        </h3>
      </div>
      {!guardian ? (
        <p className="text-xs font-semibold text-on-surface-variant">No registrado.</p>
      ) : (
        <dl className="grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Nombre
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.fullName}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              C.I.
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.nationalId ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Dirección
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.address ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Fecha de nacimiento
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">
              {formatearFecha(guardian.birthDate)}
            </dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Profesión / oficio
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.occupation ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              ¿Trabaja?
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{siNo(guardian.works)}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Empresa
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.employer ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              E-mail
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">{guardian.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
              Teléfonos
            </dt>
            <dd className="mt-0.5 font-semibold text-on-surface">
              {[guardian.homePhone, guardian.mobilePhone, guardian.officePhone]
                .filter(Boolean)
                .join(" · ") || "—"}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

export default function DetalleInscripcion({ id }: { id: string }) {
  const [inscripcion, setInscripcion] = useState<InscripcionApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<EnrollmentDocumentType | null>(null);

  useEffect(() => {
    let active = true;
    obtenerInscripcion(id)
      .then((response) => {
        if (active) setInscripcion(response);
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

  const descargar = async (
    documentType: EnrollmentDocumentType,
    fileName: string | null,
  ) => {
    setDownloading(documentType);
    setError(null);
    try {
      await descargarDocumentoInscripcion(
        Number(id),
        documentType,
        fileName ?? `${documentType}.pdf`,
      );
    } catch (downloadError) {
      setError(
        downloadError instanceof ApiError
          ? downloadError.message
          : "No se pudo descargar el documento.",
      );
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 py-24 text-on-surface-variant md:px-8">
        <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Cargando inscripción…</p>
      </div>
    );
  }

  if (error && !inscripcion) {
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
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!inscripcion) return null;

  const edad = calcularEdad(inscripcion.student.birthDate, inscripcion.enrollmentDate);
  const documentos = DOCUMENTOS.map((definition) => {
    const saved = inscripcion.documents.find(
      (item) => item.documentType === definition.type,
    );
    return { definition, saved };
  });

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 print:hidden">
        <Link
          href="/dashboard/inscripciones"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Volver al listado
        </Link>

        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              Inscripción · Folio N° {inscripcion.id}
            </p>
            <h1 className="mt-1 font-display text-[2rem] font-extrabold leading-tight text-on-surface">
              {inscripcion.student.lastNames}, {inscripcion.student.firstNames}
            </h1>
            <p className="mt-1 text-sm font-semibold text-on-surface-variant">
              {label(GRUPO_OPCIONES, inscripcion.groupName)} ·{" "}
              {label(TURNO_OPCIONES, inscripcion.shift)} · {inscripcion.schoolYear}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="btn btn-ghost btn-sm">
              <Printer className="size-4" aria-hidden="true" />
              Imprimir planilla
            </button>
            <Link
              href={`/dashboard/inscripciones/${inscripcion.id}/editar`}
              className="btn btn-primary btn-sm"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
            </Link>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm font-semibold text-on-error-container"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-error" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary-container text-primary">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-extrabold text-on-surface">
                  Datos de inscripción
                </h2>
              </div>
              <div className="grid gap-3 text-xs sm:grid-cols-4">
                <div>
                  <p className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Año escolar
                  </p>
                  <p className="mt-0.5 font-bold text-on-surface">{inscripcion.schoolYear}</p>
                </div>
                <div>
                  <p className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Fecha
                  </p>
                  <p className="mt-0.5 font-bold text-on-surface">
                    {formatearFecha(inscripcion.enrollmentDate)}
                  </p>
                </div>
                <div>
                  <p className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Procedencia
                  </p>
                  <p className="mt-0.5 font-bold text-on-surface">
                    {label(PROCEDENCIA_OPCIONES, inscripcion.previousSchooling)}
                  </p>
                </div>
                <div>
                  <p className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Institución
                  </p>
                  <p className="mt-0.5 font-bold text-on-surface">
                    {inscripcion.previousInstitution ?? "—"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-secondary-container text-secondary">
                    <UserRound className="size-4" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-base font-extrabold text-on-surface">
                    Datos del alumno
                  </h2>
                </div>
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[0.65rem] font-bold text-on-surface-variant">
                  {formatearEdad(edad)}
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="mx-auto w-28 shrink-0 sm:mx-0">
                  {inscripcion.photoDataUrl ? (
                    <img
                      src={inscripcion.photoDataUrl}
                      alt={`Foto de ${inscripcion.student.firstNames}`}
                      className="h-36 w-full rounded-xl border border-outline-variant/60 object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center text-[0.62rem] font-bold uppercase text-on-surface-variant">
                      Sin foto
                    </div>
                  )}
                </div>
                <dl className="grid flex-1 gap-x-4 gap-y-2.5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Nacimiento
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {fechaLarga(inscripcion.student.birthDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Lugar
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {inscripcion.student.birthPlace ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Nacionalidad
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {inscripcion.student.nationality}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Sexo
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {label(SEXO_OPCIONES, inscripcion.student.sex)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Talla / peso
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {inscripcion.student.heightCm ?? "—"} cm ·{" "}
                      {inscripcion.student.weightKg ?? "—"} kg
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Registro escolar
                    </dt>
                    <dd className="mt-0.5 font-bold text-on-surface">
                      {inscripcion.student.schoolRegistryNumber ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Teléfono
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-1 font-bold text-on-surface">
                      <Phone className="size-3 text-primary" aria-hidden="true" />
                      {inscripcion.student.phone ?? "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                      Dirección
                    </dt>
                    <dd className="mt-0.5 flex items-start gap-1 font-bold text-on-surface">
                      <MapPin className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden="true" />
                      {inscripcion.student.address ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-tertiary-container text-tertiary">
                  <Users className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-extrabold text-on-surface">
                  Datos familiares
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <GuardianDetail title="Madre" guardian={inscripcion.mother} />
                <GuardianDetail title="Padre" guardian={inscripcion.father} />
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-sun-container text-on-sun-container">
                  <HeartPulse className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-extrabold text-on-surface">
                  Otros datos e información adicional
                </h2>
              </div>
              <dl className="grid gap-x-4 gap-y-2.5 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Responsable ante la institución
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {label(RESPONSABLE_OPCIONES, inscripcion.responsibleType)}
                    {inscripcion.responsibleOther ? ` · ${inscripcion.responsibleOther}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Vive con
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {[
                      inscripcion.livesWithMother ? "Mamá" : null,
                      inscripcion.livesWithFather ? "Papá" : null,
                    ]
                      .filter(Boolean)
                      .join(" y ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Retira al alumno
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {label(RETIRO_OPCIONES, inscripcion.pickupType)}
                    {inscripcion.pickupOther ? ` · ${inscripcion.pickupOther}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Enfermedad / alergias
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {inscripcion.illness ?? "Ninguna"} · {inscripcion.allergies ?? "Ninguna"}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Operado
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {siNo(inscripcion.operated)}
                    {inscripcion.operationDetails ? ` · ${inscripcion.operationDetails}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.08em] text-on-surface-variant/80">
                    Tratamiento psicológico
                  </dt>
                  <dd className="mt-0.5 font-bold text-on-surface">
                    {siNo(inscripcion.psychologicalTreatment)}
                    {inscripcion.psychologicalDetails
                      ? ` · ${inscripcion.psychologicalDetails}`
                      : ""}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary-container text-primary">
                  <FileText className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-extrabold text-on-surface">
                  Documentos
                </h2>
              </div>
              <ul className="space-y-2">
                {documentos.map(({ definition, saved }) => (
                  <li
                    key={definition.type}
                    className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      {saved?.presented ? (
                        <CheckCircle2 className="size-4 shrink-0 text-secondary" aria-hidden="true" />
                      ) : (
                        <XCircle className="size-4 shrink-0 text-on-surface-variant/50" aria-hidden="true" />
                      )}
                      <span className="min-w-0 flex-1 text-xs font-bold text-on-surface">
                        {definition.label}
                      </span>
                      {saved?.storageKey && (
                        <button
                          type="button"
                          disabled={downloading === definition.type}
                          onClick={() =>
                            void descargar(definition.type, saved.fileName ?? null)
                          }
                          className="grid size-8 shrink-0 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
                          aria-label={`Descargar ${definition.label}`}
                        >
                          {downloading === definition.type ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Download className="size-3.5" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                    {saved?.fileName && (
                      <p className="mt-1 truncate pl-6 text-[0.65rem] font-medium text-on-surface-variant">
                        {saved.fileName}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-tertiary-container text-tertiary">
                  <PenLine className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-extrabold text-on-surface">
                  Acta de compromiso
                </h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-on-surface-variant">
                <p className="flex items-start gap-1.5">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-secondary" aria-hidden="true" />
                  {inscripcion.commitmentAccepted
                    ? "Acta aceptada por el representante."
                    : "Acta no aceptada."}
                </p>
                <p>
                  Firma: <span className="font-bold text-on-surface">{inscripcion.commitmentSignatureName}</span>
                </p>
                <p>
                  Fecha:{" "}
                  <span className="font-bold text-on-surface">
                    {formatearFecha(inscripcion.commitmentSignatureDate)}
                  </span>
                </p>
                {inscripcion.commitmentSignatureData && (
                  <img
                    src={inscripcion.commitmentSignatureData}
                    alt="Firma del representante"
                    className="mt-2 max-h-20 rounded-lg border border-outline-variant/50 bg-white object-contain"
                  />
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-4 text-[0.68rem] font-semibold leading-relaxed text-on-surface-variant">
              <p>
                Registrada:{" "}
                <span className="font-bold text-on-surface">
                  {new Intl.DateTimeFormat("es-VE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(inscripcion.createdAt))}
                </span>
              </p>
              <p className="mt-1">
                Última actualización:{" "}
                <span className="font-bold text-on-surface">
                  {new Intl.DateTimeFormat("es-VE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(inscripcion.updatedAt))}
                </span>
              </p>
              <p className="mt-2 text-[0.62rem] font-medium">
                Los documentos descargables requieren una sesión autenticada. Tipos permitidos:{" "}
                {DOCUMENTO_MIME_TYPES.map((type) => type.split("/")[1]).join(", ")}.
              </p>
            </section>
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <PlanillaImpresion data={formFromApi(inscripcion)} folio={inscripcion.id} />
      </div>
    </>
  );
}
