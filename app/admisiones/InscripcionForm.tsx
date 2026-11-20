"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  CloudCheck,
  Eye,
  FileCheck2,
  HeartPulse,
  Info,
  Loader2,
  Paperclip,
  PenLine,
  Printer,
  Save,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  ACTA_TEXTO,
  BORRADOR_STORAGE_KEY,
  DOCUMENTOS,
  GRUPO_OPCIONES,
  NACIONALIDAD_OPCIONES,
  PROCEDENCIA_OPCIONES,
  RESPONSABLE_OPCIONES,
  RETIRO_OPCIONES,
  SECCIONES,
  SEXO_OPCIONES,
  TURNO_OPCIONES,
  createEmptyInscripcion,
  generarAniosEscolares,
} from "@/data/inscripcion";
import {
  comprimirFotoAlumno,
  formToPayload,
  subirDocumentoInscripcion,
  validarArchivoDocumento,
} from "@/lib/inscripciones";
import {
  progresoInscripcion,
  validarInscripcion,
  type ErroresInscripcion,
} from "@/lib/inscripcion-validacion";
import {
  calcularEdad,
  normalizarCedula,
  normalizarTelefono,
} from "@/lib/venezuela";
import { ApiError } from "@/lib/api";
import type {
  DocumentoFormValues,
  EnrollmentDocumentType,
  GuardianFormValues,
  InscripcionApiResponse,
  InscripcionFormValues,
  InscripcionPayload,
  StudentFormValues,
} from "@/types/inscripcion";
import PlanillaImpresion from "./PlanillaImpresion";
import FirmaCanvas from "./FirmaCanvas";
import {
  CheckboxField,
  FieldShell,
  RadioGroup,
  SectionCard,
  SelectField,
  TextAreaField,
  TextField,
  YesNoField,
} from "./CamposPlanilla";

interface InscripcionFormProps {
  initialData?: InscripcionFormValues;
  onSubmit: (payload: InscripcionPayload) => Promise<InscripcionApiResponse>;
  submitLabel?: string;
  storageKey?: string | null;
  onSaved?: (saved: InscripcionApiResponse) => void;
  stickyProgress?: boolean;
}

const OPCIONALES = new Set(["seccion-adicional", "seccion-documentos"]);

function normalizarBorrador(raw: string): InscripcionFormValues | null {
  try {
    const parsed = JSON.parse(raw) as Partial<InscripcionFormValues>;
    if (!parsed || typeof parsed !== "object") return null;
    const base = createEmptyInscripcion();
    const documents = base.documents.map((empty) => {
      const saved = Array.isArray(parsed.documents)
        ? parsed.documents.find((item) => item?.documentType === empty.documentType)
        : undefined;
      return saved ? { ...empty, ...saved } : empty;
    });
    return {
      ...base,
      ...parsed,
      student: { ...base.student, ...(parsed.student ?? {}) },
      mother: { ...base.mother, ...(parsed.mother ?? {}) },
      father: { ...base.father, ...(parsed.father ?? {}) },
      documents,
    };
  } catch {
    return null;
  }
}

export default function InscripcionForm({
  initialData,
  onSubmit,
  submitLabel = "Guardar inscripción",
  storageKey = BORRADOR_STORAGE_KEY,
  onSaved,
  stickyProgress = true,
}: InscripcionFormProps) {
  const [data, setData] = useState<InscripcionFormValues>(
    () => initialData ?? createEmptyInscripcion(),
  );
  const [draftReady, setDraftReady] = useState(!storageKey);
  const [draftRecovered, setDraftRecovered] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<ErroresInscripcion>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<InscripcionApiResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<EnrollmentDocumentType | null>(null);
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const savedRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRefs = useRef<Partial<Record<EnrollmentDocumentType, HTMLInputElement | null>>>(
    {},
  );

  const liveErrors = useMemo(() => validarInscripcion(data), [data]);
  const progress = useMemo(() => progresoInscripcion(data, liveErrors), [data, liveErrors]);
  const errors = submitted ? { ...liveErrors, ...backendErrors } : backendErrors;
  const edad = calcularEdad(data.student.birthDate, data.enrollmentDate);
  const aniosEscolares = useMemo(() => {
    const base = generarAniosEscolares();
    return base.includes(data.schoolYear)
      ? base
      : [data.schoolYear, ...base].filter(Boolean);
  }, [data.schoolYear]);

  useEffect(() => {
    if (!storageKey || initialData) {
      setDraftReady(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const restored = normalizarBorrador(raw);
        if (restored) {
          setData(restored);
          setDraftRecovered(true);
        }
      }
    } catch {
      setDraftRecovered(false);
    }
    setDraftReady(true);
  }, [initialData, storageKey]);

  useEffect(() => {
    if (!storageKey || !draftReady) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(data));
        setSaveState("saved");
        setLastSavedAt(
          new Intl.DateTimeFormat("es-VE", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        );
      } catch {
        setSaveState("error");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [data, draftReady, storageKey]);

  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [previewOpen]);

  const resetSaved = () => {
    setSaved(null);
    setBackendErrors({});
  };

  const setTop = <K extends keyof InscripcionFormValues>(
    key: K,
    value: InscripcionFormValues[K],
  ) => {
    setData((previous) => ({ ...previous, [key]: value }));
    resetSaved();
  };

  const setStudent = <K extends keyof StudentFormValues>(key: K, value: StudentFormValues[K]) => {
    setData((previous) => ({
      ...previous,
      student: { ...previous.student, [key]: value },
    }));
    resetSaved();
  };

  const setGuardian = <K extends keyof GuardianFormValues>(
    which: "mother" | "father",
    key: K,
    value: GuardianFormValues[K],
  ) => {
    setData((previous) => ({
      ...previous,
      [which]: { ...previous[which], [key]: value },
    }));
    resetSaved();
  };

  const setDocument = (type: EnrollmentDocumentType, patch: Partial<DocumentoFormValues>) => {
    setData((previous) => ({
      ...previous,
      documents: previous.documents.map((document) =>
        document.documentType === type ? { ...document, ...patch } : document,
      ),
    }));
    resetSaved();
  };

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("La foto debe ser una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setPhotoError("La foto no puede superar los 12 MB.");
      return;
    }
    setPhotoError(null);
    setPhotoProcessing(true);
    try {
      const dataUrl = await comprimirFotoAlumno(file);
      setData((previous) => ({ ...previous, photoDataUrl: dataUrl }));
      resetSaved();
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "No se pudo procesar la foto.");
    } finally {
      setPhotoProcessing(false);
    }
  };

  const removePhoto = () => {
    setData((previous) => ({ ...previous, photoDataUrl: null }));
    setPhotoError(null);
    resetSaved();
  };

  const handleDocumentFile = async (
    document: DocumentoFormValues,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const error = validarArchivoDocumento(file);
    if (error) {
      setDocErrors((previous) => ({ ...previous, [document.documentType]: error }));
      return;
    }

    setDocErrors((previous) => {
      const next = { ...previous };
      delete next[document.documentType];
      return next;
    });
    setUploadingDoc(document.documentType);
    try {
      const uploaded = await subirDocumentoInscripcion(file);
      setDocument(document.documentType, {
        presented: true,
        fileName: uploaded.fileName,
        storageKey: uploaded.storageKey,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
      });
    } catch (error) {
      setDocErrors((previous) => ({
        ...previous,
        [document.documentType]:
          error instanceof ApiError
            ? error.message
            : "No se pudo subir el archivo. Intenta de nuevo.",
      }));
    } finally {
      setUploadingDoc(null);
    }
  };

  const removeDocumentFile = (document: DocumentoFormValues) => {
    setDocument(document.documentType, {
      presented: false,
      fileName: "",
      storageKey: null,
      mimeType: null,
      sizeBytes: null,
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validation = validarInscripcion(data);
    setSubmitted(true);
    setBackendErrors({});
    setTopError(null);

    if (Object.keys(validation).length > 0) {
      setTopError("Revisa los campos marcados en rojo antes de guardar la inscripción.");
      window.setTimeout(() => {
        document
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await onSubmit(formToPayload(data));
      setSaved(response);
      setSubmitted(false);
      setBackendErrors({});
      if (storageKey) {
        try {
          window.localStorage.removeItem(storageKey);
        } catch {
          // El borrador no pudo borrarse; no bloquea el envío.
        }
      }
      setSaveState("idle");
      onSaved?.(response);
      window.setTimeout(() => {
        savedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    } catch (error) {
      if (error instanceof ApiError) {
        setTopError(error.message);
        setBackendErrors(error.fieldErrors ?? {});
      } else {
        setTopError("No se pudo guardar la inscripción. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    setPreviewOpen(false);
    window.setTimeout(() => window.print(), 100);
  };

  return (
    <>
      <div className="print:hidden">
        <div
          className={`z-30 mb-4 rounded-2xl border border-outline-variant/50 bg-background/95 p-3 shadow-[0_12px_30px_-28px_rgba(31,48,56,0.45)] backdrop-blur ${
            stickyProgress ? "sticky top-[92px]" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
              <ClipboardList className="size-4 text-primary" aria-hidden="true" />
              Progreso de la planilla
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-primary">{progress.global}%</span>
              <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-on-surface-variant">
                {saveState === "saving" && (
                  <>
                    <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                    Guardando borrador…
                  </>
                )}
                {saveState === "saved" && (
                  <>
                    <CloudCheck className="size-3.5 text-secondary" aria-hidden="true" />
                    Borrador guardado{lastSavedAt ? ` · ${lastSavedAt}` : ""}
                  </>
                )}
                {saveState === "error" && (
                  <>
                    <AlertTriangle className="size-3.5 text-error" aria-hidden="true" />
                    No se pudo guardar el borrador
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
              style={{ width: `${progress.global}%` }}
              role="progressbar"
              aria-valuenow={progress.global}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso de la planilla"
            />
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {SECCIONES.map((seccion) => {
              const sectionProgress = progress.secciones[seccion.id];
              const optional = OPCIONALES.has(seccion.id);
              const complete =
                sectionProgress &&
                sectionProgress.total > 0 &&
                sectionProgress.completos === sectionProgress.total;
              return (
                <button
                  key={seccion.id}
                  type="button"
                  onClick={() => scrollToSection(seccion.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold transition-colors ${
                    complete
                      ? "border-secondary/30 bg-secondary-container text-on-secondary-container"
                      : "border-outline-variant/60 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {complete ? (
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <span
                      className="size-1.5 rounded-full bg-current opacity-60"
                      aria-hidden="true"
                    />
                  )}
                  {seccion.label}
                  {!optional && sectionProgress && sectionProgress.total > 0 && (
                    <span className="opacity-70">
                      {sectionProgress.completos}/{sectionProgress.total}
                    </span>
                  )}
                  {optional && <span className="opacity-60">opcional</span>}
                </button>
              );
            })}
          </div>
        </div>

        {draftRecovered && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-primary/25 bg-primary-container/40 px-4 py-3 text-sm font-semibold text-on-primary-container">
            <p className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Recuperamos el borrador que quedó guardado en este navegador.
            </p>
            <button
              type="button"
              onClick={() => setDraftRecovered(false)}
              aria-label="Cerrar aviso de borrador"
              className="grid size-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-primary/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div
          className="overflow-hidden rounded-[1.75rem] border border-outline-variant/50 bg-surface-container-lowest shadow-[0_28px_60px_-44px_rgba(31,48,56,0.5)]"
        >
          <div className="border-b border-outline-variant/40 bg-white px-4 py-5 text-slate-900 sm:px-6">
            <div className="grid grid-cols-[auto_1fr] items-start gap-3 sm:grid-cols-[auto_1fr_auto] sm:gap-5">
              <Image
                src="/images/logo.png"
                alt="Escudo del CEI Luisa Cáceres de Arismendi"
                width={160}
                height={160}
                unoptimized
                className="size-14 object-contain sm:size-24"
              />
              <div className="min-w-0 text-center">
                <p className="text-[0.56rem] font-extrabold uppercase leading-tight tracking-[0.04em] text-slate-800 sm:text-[0.7rem]">
                  República Bolivariana de Venezuela
                </p>
                <p className="text-[0.56rem] font-bold uppercase leading-tight text-slate-600 sm:text-[0.7rem]">
                  Ministerio del Poder Popular para la Educación
                </p>
                <p className="mt-1 text-[0.65rem] font-extrabold uppercase leading-tight text-[#0c6c8b] sm:text-base">
                  Centro de Educación Inicial &quot;Luisa Cáceres de Arismendi&quot;
                </p>
                <p className="text-[0.58rem] font-bold uppercase leading-tight text-slate-600 sm:text-[0.72rem]">
                  Puerto Ordaz - Estado Bolívar
                </p>
                <p className="mx-auto mt-1 w-fit rounded-full bg-slate-100 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-slate-800 sm:text-xs">
                  Año escolar {data.schoolYear || "20__-20__"}
                </p>
              </div>
              <div className="col-span-2 flex justify-center sm:col-span-1 sm:justify-end">
                <div className="relative w-28 sm:w-32">
                  <input
                    ref={photoInputRef}
                    id="foto-alumno"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhoto}
                    className="sr-only"
                  />
                  {data.photoDataUrl ? (
                    <div className="relative overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-50">
                      <img
                        src={data.photoDataUrl}
                        alt="Vista previa de la foto del alumno"
                        className="h-32 w-full object-cover sm:h-36"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-red-600"
                        aria-label="Quitar foto del alumno"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoProcessing}
                      className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-[#0c6c8b] hover:text-[#0c6c8b] disabled:opacity-60 sm:h-36"
                    >
                      {photoProcessing ? (
                        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                      ) : (
                        <Camera className="size-6" aria-hidden="true" />
                      )}
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.08em]">
                        {photoProcessing ? "Procesando…" : "Subir foto"}
                      </span>
                      <span className="px-2 text-center text-[0.55rem] font-medium leading-tight">
                        JPG, PNG o WebP
                      </span>
                    </button>
                  )}
                  {data.photoDataUrl && (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="mt-1 w-full text-center text-[0.62rem] font-bold text-[#0c6c8b] hover:underline"
                    >
                      Cambiar foto
                    </button>
                  )}
                  {photoError && (
                    <p className="mt-1 text-[0.65rem] font-semibold leading-snug text-red-600">
                      {photoError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h1 className="mt-5 text-center font-display text-xl font-extrabold tracking-[0.08em] text-slate-900 sm:text-2xl">
              PLANILLA DE INSCRIPCIÓN
            </h1>
            <p className="mx-auto mt-1 max-w-xl text-center text-xs font-medium leading-relaxed text-slate-500">
              Completa la planilla digital. Puedes guardar el borrador y continuar más tarde desde
              este mismo navegador.
            </p>
          </div>

          <form className="space-y-4 p-3 sm:p-5" onSubmit={handleSubmit} noValidate>
            {topError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-error-container/50 px-4 py-3 text-sm font-semibold text-on-error-container"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-error" aria-hidden="true" />
                <span>{topError}</span>
              </div>
            )}

            {saved && (
              <div
                ref={savedRef}
                role="status"
                className="flex flex-col gap-3 rounded-xl border border-secondary/30 bg-secondary-container/60 px-4 py-3 text-on-secondary-container sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-extrabold">Inscripción guardada correctamente.</p>
                    <p className="text-xs font-semibold opacity-85">
                      Folio N° {saved.id}. Puedes imprimir o descargar la planilla.
                    </p>
                  </div>
                </div>
                <button type="button" onClick={handlePrint} className="btn btn-sun btn-sm">
                  <Printer className="size-4" aria-hidden="true" />
                  Imprimir planilla
                </button>
              </div>
            )}

            <SectionCard
              id="seccion-inscripcion"
              step={1}
              title="Datos de inscripción"
              description="Año escolar, turno, grupo y fecha."
              icon={ClipboardList}
              progress={progress.secciones["seccion-inscripcion"]}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SelectField
                  id="schoolYear"
                  label="Año escolar"
                  value={data.schoolYear}
                  onChange={(value) => setTop("schoolYear", value)}
                  options={aniosEscolares.map((year) => ({ value: year, label: year }))}
                  error={errors.schoolYear}
                  required
                />
                <SelectField
                  id="shift"
                  label="Turno"
                  value={data.shift}
                  onChange={(value) => setTop("shift", value)}
                  options={TURNO_OPCIONES}
                  error={errors.shift}
                  required
                />
                <SelectField
                  id="groupName"
                  label="Grupo"
                  value={data.groupName}
                  onChange={(value) => setTop("groupName", value)}
                  options={GRUPO_OPCIONES}
                  error={errors.groupName}
                  required
                />
                <TextField
                  id="enrollmentDate"
                  label="Fecha de inscripción"
                  type="date"
                  value={data.enrollmentDate}
                  onChange={(value) => setTop("enrollmentDate", value)}
                  error={errors.enrollmentDate}
                  required
                />
              </div>
            </SectionCard>

            <SectionCard
              id="seccion-alumno"
              step={2}
              title="Datos del alumno"
              description="La edad y los meses se calculan automáticamente."
              icon={UserRound}
              tone="secondary"
              progress={progress.secciones["seccion-alumno"]}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  id="student.lastNames"
                  label="Apellidos"
                  value={data.student.lastNames}
                  onChange={(value) => setStudent("lastNames", value)}
                  error={errors["student.lastNames"]}
                  required
                />
                <TextField
                  id="student.firstNames"
                  label="Nombres"
                  value={data.student.firstNames}
                  onChange={(value) => setStudent("firstNames", value)}
                  error={errors["student.firstNames"]}
                  required
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <TextField
                  id="student.birthDate"
                  label="Fecha de nacimiento"
                  type="date"
                  value={data.student.birthDate}
                  onChange={(value) => setStudent("birthDate", value)}
                  error={errors["student.birthDate"]}
                  required
                />
                <TextField
                  id="student.birthPlace"
                  label="Lugar de nacimiento"
                  value={data.student.birthPlace}
                  onChange={(value) => setStudent("birthPlace", value)}
                  placeholder="Ciudad, estado"
                />
                <TextField
                  id="student.edad"
                  label="Edad"
                  value={edad ? String(edad.anios) : ""}
                  onChange={() => undefined}
                  readOnly
                  hint="Calculada"
                />
                <TextField
                  id="student.meses"
                  label="Meses"
                  value={edad ? String(edad.meses) : ""}
                  onChange={() => undefined}
                  readOnly
                  hint="Calculados"
                />
                <SelectField
                  id="student.nationality"
                  label="Nacionalidad"
                  value={data.student.nationality}
                  onChange={(value) => setStudent("nationality", value)}
                  options={NACIONALIDAD_OPCIONES}
                  error={errors["student.nationality"]}
                  required
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SelectField
                  id="student.sex"
                  label="Sexo"
                  value={data.student.sex}
                  onChange={(value) => setStudent("sex", value)}
                  options={SEXO_OPCIONES}
                  error={errors["student.sex"]}
                  required
                />
                <TextField
                  id="student.heightCm"
                  label="Talla (cm)"
                  value={data.student.heightCm}
                  onChange={(value) => setStudent("heightCm", value)}
                  error={errors["student.heightCm"]}
                  inputMode="decimal"
                  placeholder="Ej. 98.5"
                />
                <TextField
                  id="student.weightKg"
                  label="Peso (kg)"
                  value={data.student.weightKg}
                  onChange={(value) => setStudent("weightKg", value)}
                  error={errors["student.weightKg"]}
                  inputMode="decimal"
                  placeholder="Ej. 16.2"
                />
                <TextField
                  id="student.schoolRegistryNumber"
                  label="N° Registro Escolar"
                  value={data.student.schoolRegistryNumber}
                  onChange={(value) => setStudent("schoolRegistryNumber", value)}
                  placeholder="Opcional"
                />
                <TextField
                  id="student.phone"
                  label="Teléfono"
                  type="tel"
                  value={data.student.phone}
                  onChange={(value) => setStudent("phone", value)}
                  onBlur={() => setStudent("phone", normalizarTelefono(data.student.phone))}
                  error={errors["student.phone"]}
                  required
                  placeholder="0414-1234567"
                />
              </div>
              <div className="mt-3">
                <TextAreaField
                  id="student.address"
                  label="Dirección"
                  value={data.student.address}
                  onChange={(value) => setStudent("address", value)}
                  error={errors["student.address"]}
                  required
                  rows={2}
                  placeholder="Calle, casa, sector y referencia"
                />
              </div>
              <div className="mt-3">
                <RadioGroup
                  name="previousSchooling"
                  label="Procedencia"
                  value={data.previousSchooling}
                  onChange={(value) => setTop("previousSchooling", value)}
                  options={PROCEDENCIA_OPCIONES}
                  error={errors.previousSchooling}
                  required
                />
              </div>
              <div className="mt-3">
                <TextField
                  id="previousInstitution"
                  label="Institución donde estudió"
                  value={data.previousInstitution}
                  onChange={(value) => setTop("previousInstitution", value)}
                  error={errors.previousInstitution}
                  hint="Indícala si viene de otro plantel, guardería u otro espacio."
                />
              </div>
            </SectionCard>

            <SectionCard
              id="seccion-familia"
              step={3}
              title="Datos familiares"
              description="Madre y padre comparten los mismos campos. Completa al menos uno con nombre, cédula y teléfono."
              icon={UsersRound}
              tone="tertiary"
              progress={progress.secciones["seccion-familia"]}
            >
              <div className="space-y-4">
                <GuardianFields
                  title="Madre"
                  prefix="mother"
                  guardian={data.mother}
                  errors={errors}
                  onChange={(key, value) => setGuardian("mother", key, value)}
                  onNormalizeCedula={() =>
                    setGuardian("mother", "nationalId", normalizarCedula(data.mother.nationalId))
                  }
                  onNormalizePhone={(key) =>
                    setGuardian("mother", key, normalizarTelefono(data.mother[key]))
                  }
                  tone="tertiary"
                />
                <GuardianFields
                  title="Padre"
                  prefix="father"
                  guardian={data.father}
                  errors={errors}
                  onChange={(key, value) => setGuardian("father", key, value)}
                  onNormalizeCedula={() =>
                    setGuardian("father", "nationalId", normalizarCedula(data.father.nationalId))
                  }
                  onNormalizePhone={(key) =>
                    setGuardian("father", key, normalizarTelefono(data.father[key]))
                  }
                  tone="primary"
                />
              </div>
            </SectionCard>

            <SectionCard
              id="seccion-otros"
              step={4}
              title="Otros datos importantes"
              description="Responsables, convivencia y retiro del alumno."
              icon={HeartPulse}
              tone="sun"
              progress={progress.secciones["seccion-otros"]}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <RadioGroup
                    name="responsibleType"
                    label="Responsable del niño/a ante la institución"
                    value={data.responsibleType}
                    onChange={(value) => setTop("responsibleType", value)}
                    options={RESPONSABLE_OPCIONES}
                    error={errors.responsibleType}
                    required
                  />
                  {data.responsibleType === "OTHER" && (
                    <div className="mt-2">
                      <TextField
                        id="responsibleOther"
                        label="Especificar responsable"
                        value={data.responsibleOther}
                        onChange={(value) => setTop("responsibleOther", value)}
                        error={errors.responsibleOther}
                        required
                      />
                    </div>
                  )}
                </div>
                <div>
                  <FieldShell
                    id="livesWithMother"
                    label="El niño/a actualmente vive con"
                    required
                    error={errors["livesWith"]}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      <CheckboxField
                        id="livesWithMother"
                        label="Mamá"
                        checked={data.livesWithMother}
                        onChange={(value) => setTop("livesWithMother", value)}
                      />
                      <CheckboxField
                        id="livesWithFather"
                        label="Papá"
                        checked={data.livesWithFather}
                        onChange={(value) => setTop("livesWithFather", value)}
                      />
                    </div>
                  </FieldShell>
                </div>
              </div>
              <div className="mt-4">
                <RadioGroup
                  name="pickupType"
                  label="Responsable de retirar al niño/a de la institución"
                  value={data.pickupType}
                  onChange={(value) => setTop("pickupType", value)}
                  options={RETIRO_OPCIONES}
                  error={errors.pickupType}
                  required
                />
                {data.pickupType === "OTHER" && (
                  <div className="mt-2 sm:max-w-md">
                    <TextField
                      id="pickupOther"
                      label="Especificar quién retira"
                      value={data.pickupOther}
                      onChange={(value) => setTop("pickupOther", value)}
                      error={errors.pickupOther}
                      required
                    />
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard
              id="seccion-adicional"
              step={5}
              title="Información adicional"
              description="Salud y antecedentes relevantes para el acompañamiento."
              icon={HeartPulse}
              tone="primary"
              progress={progress.secciones["seccion-adicional"]}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextAreaField
                  id="illness"
                  label="¿Padece alguna enfermedad?"
                  value={data.illness}
                  onChange={(value) => setTop("illness", value)}
                  error={errors.illness}
                  placeholder="Indica condiciones de salud o escribe «Ninguna»."
                  rows={3}
                />
                <TextAreaField
                  id="allergies"
                  label="¿Es alérgico/a?"
                  value={data.allergies}
                  onChange={(value) => setTop("allergies", value)}
                  error={errors.allergies}
                  placeholder="Indica alergias o escribe «Ninguna»."
                  rows={3}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <YesNoField
                    name="operated"
                    label="¿Ha sido operado/a?"
                    value={data.operated}
                    onChange={(value) => setTop("operated", value)}
                  />
                  {data.operated && (
                    <div className="mt-2">
                      <TextField
                        id="operationDetails"
                        label="¿De qué?"
                        value={data.operationDetails}
                        onChange={(value) => setTop("operationDetails", value)}
                        error={errors.operationDetails}
                        required
                      />
                    </div>
                  )}
                </div>
                <div>
                  <YesNoField
                    name="psychologicalTreatment"
                    label="¿Recibe tratamiento psicológico?"
                    value={data.psychologicalTreatment}
                    onChange={(value) => setTop("psychologicalTreatment", value)}
                  />
                  {data.psychologicalTreatment && (
                    <div className="mt-2">
                      <TextAreaField
                        id="psychologicalDetails"
                        label="Explique"
                        value={data.psychologicalDetails}
                        onChange={(value) => setTop("psychologicalDetails", value)}
                        error={errors.psychologicalDetails}
                        required
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="seccion-documentos"
              step={6}
              title="Documentos presentados"
              description="Marca los recaudos entregados y adjunta una copia si la tienes (opcional)."
              icon={FileCheck2}
              tone="secondary"
              progress={progress.secciones["seccion-documentos"]}
            >
              <div className="space-y-2.5">
                {DOCUMENTOS.map((documento) => {
                  const saved = data.documents.find(
                    (item) => item.documentType === documento.type,
                  );
                  if (!saved) return null;
                  const uploading = uploadingDoc === documento.type;
                  const docError = docErrors[documento.type];
                  return (
                    <div
                      key={documento.type}
                      className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <CheckboxField
                        id={`documento-${documento.type}`}
                        label={documento.label}
                        hint={documento.hint}
                        checked={saved.presented}
                        onChange={(value) =>
                          setDocument(documento.type, { presented: value })
                        }
                      />
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <input
                          ref={(element) => {
                            documentInputRefs.current[documento.type] = element;
                          }}
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(event) => void handleDocumentFile(saved, event)}
                        />
                        {saved.storageKey ? (
                          <>
                            <span className="max-w-48 truncate rounded-full bg-secondary-container px-2.5 py-1 text-[0.65rem] font-bold text-on-secondary-container">
                              {saved.fileName}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDocumentFile(saved)}
                              className="grid size-8 place-items-center rounded-full border border-outline-variant/60 text-on-surface-variant transition-colors hover:border-error/40 hover:text-error"
                              aria-label={`Quitar archivo de ${documento.label}`}
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={uploading}
                            onClick={() => documentInputRefs.current[documento.type]?.click()}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-outline-variant/60 px-3 py-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
                          >
                            {uploading ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Paperclip className="size-3.5" aria-hidden="true" />
                            )}
                            {uploading ? "Subiendo…" : "Adjuntar"}
                          </button>
                        )}
                      </div>
                      {docError && (
                        <p className="text-[0.68rem] font-semibold text-error sm:col-span-2">
                          {docError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[0.7rem] font-medium leading-relaxed text-on-surface-variant">
                Los archivos se suben al servidor al seleccionarlos y quedan vinculados al enviar la
                planilla. Formatos: PDF, JPG, PNG o WebP · máximo 10 MB por archivo.
              </p>
            </SectionCard>

            <SectionCard
              id="seccion-acta"
              step={7}
              title="Acta de compromiso"
              description="Lee el compromiso y firma como representante."
              icon={PenLine}
              tone="tertiary"
              progress={progress.secciones["seccion-acta"]}
            >
              <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant">
                {ACTA_TEXTO.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mb-2 text-justify last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-4">
                <CheckboxField
                  id="commitmentAccepted"
                  label="Acepto el acta de compromiso"
                  hint="Al marcar esta casilla confirmas que leíste y aceptas el compromiso."
                  checked={data.commitmentAccepted}
                  onChange={(value) => setTop("commitmentAccepted", value)}
                />
                {errors.commitmentAccepted && (
                  <p className="mt-1 text-[0.7rem] font-semibold text-error">
                    {errors.commitmentAccepted}
                  </p>
                )}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <TextField
                  id="commitmentSignatureName"
                  label="Nombre completo del representante"
                  value={data.commitmentSignatureName}
                  onChange={(value) => setTop("commitmentSignatureName", value)}
                  error={errors.commitmentSignatureName}
                  required
                />
                <TextField
                  id="commitmentSignatureDate"
                  label="Fecha de la firma"
                  type="date"
                  value={data.commitmentSignatureDate}
                  onChange={(value) => setTop("commitmentSignatureDate", value)}
                  error={errors.commitmentSignatureDate}
                  required
                />
              </div>
              <div className="mt-3">
                <p className="mb-1 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
                  Firma del representante
                </p>
                <FirmaCanvas
                  value={data.commitmentSignatureData}
                  onChange={(value) => setTop("commitmentSignatureData", value)}
                />
              </div>
            </SectionCard>

            <div className="rounded-[1.5rem] border border-outline-variant/50 bg-surface-container-low p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-xs font-medium leading-relaxed text-on-surface-variant">
                  El borrador queda en este navegador. Al guardar, la inscripción se registra en el
                  sistema del colegio y podrás imprimir la planilla.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    Vista previa
                  </button>
                  <button type="button" onClick={handlePrint} className="btn btn-ghost btn-sm">
                    <Printer className="size-4" aria-hidden="true" />
                    Imprimir / PDF
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="size-4" aria-hidden="true" />
                    )}
                    {isSubmitting ? "Guardando…" : submitLabel}
                  </button>
                </div>
              </div>
              {saveState === "saved" && (
                <p className="mt-2 flex items-center gap-1.5 text-[0.68rem] font-semibold text-secondary">
                  <CloudCheck className="size-3.5" aria-hidden="true" />
                  Borrador guardado automáticamente{lastSavedAt ? ` a las ${lastSavedAt}` : ""}.
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("¿Borrar el borrador guardado en este navegador?")) return;
              try {
                if (storageKey) window.localStorage.removeItem(storageKey);
              } catch {
                // Ignorar almacenamiento no disponible.
              }
              setData(initialData ?? createEmptyInscripcion());
              setSubmitted(false);
              setBackendErrors({});
              setSaveState("idle");
              setDraftRecovered(false);
              setTopError(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:text-error"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Borrar borrador
          </button>
        </div>
      </div>

      <div className="hidden print:block">
        <PlanillaImpresion data={data} folio={saved?.id ?? null} />
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-inverse-surface/65 p-2 backdrop-blur-sm sm:p-6 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de la planilla"
        >
          <div className="mx-auto flex h-full w-full max-w-[1050px] flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 px-4 py-3">
              <p className="font-display text-base font-extrabold text-on-surface">
                Vista previa · Tamaño carta
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={handlePrint} className="btn btn-primary btn-sm">
                  <Printer className="size-4" aria-hidden="true" />
                  Imprimir / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="grid size-10 place-items-center rounded-full border border-outline-variant/60 text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
                  aria-label="Cerrar vista previa"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-surface-container-high/50 p-3 sm:p-5">
              <div className="mx-auto w-max shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)]">
                <PlanillaImpresion data={data} folio={saved?.id ?? null} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GuardianFields({
  title,
  prefix,
  guardian,
  errors,
  onChange,
  onNormalizeCedula,
  onNormalizePhone,
  tone,
}: {
  title: string;
  prefix: "mother" | "father";
  guardian: GuardianFormValues;
  errors: ErroresInscripcion;
  onChange: <K extends keyof GuardianFormValues>(key: K, value: GuardianFormValues[K]) => void;
  onNormalizeCedula: () => void;
  onNormalizePhone: (key: "homePhone" | "mobilePhone" | "officePhone") => void;
  tone: "tertiary" | "primary";
}) {
  const toneClasses =
    tone === "tertiary"
      ? "bg-tertiary-container/60 text-on-tertiary-container"
      : "bg-primary-container/60 text-on-primary-container";

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest">
      <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${toneClasses}`}>
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em]">{title}</p>
        <span className="rounded-full bg-white/50 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.08em]">
          Datos personales
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            id={`${prefix}.fullName`}
            label="Nombre y apellido"
            value={guardian.fullName}
            onChange={(value) => onChange("fullName", value)}
            error={errors[`${prefix}.fullName`]}
            autoComplete="name"
          />
          <TextField
            id={`${prefix}.nationalId`}
            label="C.I."
            value={guardian.nationalId}
            onChange={(value) => onChange("nationalId", value)}
            onBlur={onNormalizeCedula}
            error={errors[`${prefix}.nationalId`]}
            placeholder="V-12345678"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            id={`${prefix}.address`}
            label="Dirección"
            value={guardian.address}
            onChange={(value) => onChange("address", value)}
            error={errors[`${prefix}.address`]}
          />
          <TextField
            id={`${prefix}.birthDate`}
            label="Fecha de nacimiento"
            type="date"
            value={guardian.birthDate}
            onChange={(value) => onChange("birthDate", value)}
            error={errors[`${prefix}.birthDate`]}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField
            id={`${prefix}.occupation`}
            label="Profesión u oficio"
            value={guardian.occupation}
            onChange={(value) => onChange("occupation", value)}
            error={errors[`${prefix}.occupation`]}
          />
          <YesNoField
            name={`${prefix}.works`}
            label="¿Trabaja?"
            value={guardian.works}
            onChange={(value) => onChange("works", value)}
          />
          <TextField
            id={`${prefix}.employer`}
            label="Nombre de la empresa"
            value={guardian.employer}
            onChange={(value) => onChange("employer", value)}
            error={errors[`${prefix}.employer`]}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            id={`${prefix}.email`}
            label="E-mail"
            type="email"
            value={guardian.email}
            onChange={(value) => onChange("email", value)}
            error={errors[`${prefix}.email`]}
            placeholder="correo@ejemplo.com"
          />
          <TextField
            id={`${prefix}.homePhone`}
            label="Teléfono de habitación"
            type="tel"
            value={guardian.homePhone}
            onChange={(value) => onChange("homePhone", value)}
            onBlur={() => onNormalizePhone("homePhone")}
            error={errors[`${prefix}.homePhone`]}
            placeholder="0286-1234567"
          />
          <TextField
            id={`${prefix}.mobilePhone`}
            label="Celular"
            type="tel"
            value={guardian.mobilePhone}
            onChange={(value) => onChange("mobilePhone", value)}
            onBlur={() => onNormalizePhone("mobilePhone")}
            error={errors[`${prefix}.mobilePhone`]}
            placeholder="0414-1234567"
          />
          <TextField
            id={`${prefix}.officePhone`}
            label="Oficina"
            type="tel"
            value={guardian.officePhone}
            onChange={(value) => onChange("officePhone", value)}
            onBlur={() => onNormalizePhone("officePhone")}
            error={errors[`${prefix}.officePhone`]}
            placeholder="0212-1234567"
          />
        </div>
      </div>
    </div>
  );
}
