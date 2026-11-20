import { apiFetch, apiFetchBlob } from "@/lib/api";
import { authFetch, getToken } from "@/lib/auth";
import { DOCUMENTOS, createEmptyDocuments, createEmptyGuardian } from "@/data/inscripcion";
import {
  normalizarCedula,
  normalizarTelefono,
} from "@/lib/venezuela";
import type {
  DocumentoFormValues,
  DocumentoPayload,
  DocumentoSubidoResponse,
  EnrollmentDocumentType,
  GuardianApiResponse,
  GuardianFormValues,
  GuardianPayload,
  InscripcionApiResponse,
  InscripcionFormValues,
  InscripcionListResponse,
  InscripcionPayload,
  InscripcionResumenApi,
  PickupType,
  PreviousSchooling,
  ResponsibleType,
  GroupName,
  Shift,
  StudentSex,
} from "@/types/inscripcion";

export const DOCUMENTO_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const DOCUMENTO_MAX_BYTES = 10 * 1024 * 1024;

function texto(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function nuloSiVacio(value: string | null | undefined): string | null {
  const trimmed = texto(value);
  return trimmed.length > 0 ? trimmed : null;
}

function parseDecimal(value: string): number | null {
  const trimmed = texto(value).replace(",", ".");
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function tieneDatosGuardian(guardian: GuardianFormValues): boolean {
  return (
    texto(guardian.fullName).length > 0 ||
    texto(guardian.nationalId).length > 0 ||
    texto(guardian.address).length > 0 ||
    texto(guardian.birthDate).length > 0 ||
    texto(guardian.occupation).length > 0 ||
    guardian.works ||
    texto(guardian.employer).length > 0 ||
    texto(guardian.email).length > 0 ||
    texto(guardian.homePhone).length > 0 ||
    texto(guardian.mobilePhone).length > 0 ||
    texto(guardian.officePhone).length > 0
  );
}

function guardianToPayload(guardian: GuardianFormValues): GuardianPayload | null {
  if (!tieneDatosGuardian(guardian)) return null;
  return {
    fullName: texto(guardian.fullName),
    nationalId: nuloSiVacio(normalizarCedula(guardian.nationalId)),
    address: nuloSiVacio(guardian.address),
    birthDate: nuloSiVacio(guardian.birthDate),
    occupation: nuloSiVacio(guardian.occupation),
    works: guardian.works,
    employer: nuloSiVacio(guardian.employer),
    email: nuloSiVacio(guardian.email),
    homePhone: nuloSiVacio(normalizarTelefono(guardian.homePhone)),
    mobilePhone: nuloSiVacio(normalizarTelefono(guardian.mobilePhone)),
    officePhone: nuloSiVacio(normalizarTelefono(guardian.officePhone)),
  };
}

export function formToPayload(data: InscripcionFormValues): InscripcionPayload {
  const documents: DocumentoPayload[] = data.documents.map((document) => ({
    documentType: document.documentType,
    presented: document.presented,
    fileName: nuloSiVacio(document.fileName),
    storageKey: document.storageKey,
    mimeType: document.mimeType,
    sizeBytes: document.sizeBytes,
  }));

  return {
    schoolYear: texto(data.schoolYear),
    shift: data.shift as Shift,
    groupName: data.groupName as GroupName,
    enrollmentDate: data.enrollmentDate,
    student: {
      lastNames: texto(data.student.lastNames),
      firstNames: texto(data.student.firstNames),
      birthDate: data.student.birthDate,
      birthPlace: nuloSiVacio(data.student.birthPlace),
      nationality: texto(data.student.nationality),
      sex: data.student.sex as StudentSex,
      heightCm: parseDecimal(data.student.heightCm),
      weightKg: parseDecimal(data.student.weightKg),
      schoolRegistryNumber: nuloSiVacio(data.student.schoolRegistryNumber),
      phone: normalizarTelefono(data.student.phone),
      address: texto(data.student.address),
    },
    previousSchooling: data.previousSchooling as PreviousSchooling,
    previousInstitution: nuloSiVacio(data.previousInstitution),
    mother: guardianToPayload(data.mother),
    father: guardianToPayload(data.father),
    responsibleType: data.responsibleType as ResponsibleType,
    responsibleOther:
      data.responsibleType === "OTHER" ? nuloSiVacio(data.responsibleOther) : null,
    livesWithMother: data.livesWithMother,
    livesWithFather: data.livesWithFather,
    pickupType: data.pickupType as PickupType,
    pickupOther: data.pickupType === "OTHER" ? nuloSiVacio(data.pickupOther) : null,
    illness: nuloSiVacio(data.illness),
    allergies: nuloSiVacio(data.allergies),
    operated: data.operated,
    operationDetails: data.operated ? nuloSiVacio(data.operationDetails) : null,
    psychologicalTreatment: data.psychologicalTreatment,
    psychologicalDetails: data.psychologicalTreatment
      ? nuloSiVacio(data.psychologicalDetails)
      : null,
    photoDataUrl: data.photoDataUrl,
    commitmentAccepted: data.commitmentAccepted,
    commitmentSignatureName: texto(data.commitmentSignatureName),
    commitmentSignatureDate: data.commitmentSignatureDate,
    commitmentSignatureData: data.commitmentSignatureData,
    documents,
  };
}

function guardianFromApi(guardian: GuardianApiResponse | null): GuardianFormValues {
  if (!guardian) return createEmptyGuardian();
  return {
    fullName: guardian.fullName,
    nationalId: guardian.nationalId ?? "",
    address: guardian.address ?? "",
    birthDate: guardian.birthDate ?? "",
    occupation: guardian.occupation ?? "",
    works: guardian.works,
    employer: guardian.employer ?? "",
    email: guardian.email ?? "",
    homePhone: guardian.homePhone ?? "",
    mobilePhone: guardian.mobilePhone ?? "",
    officePhone: guardian.officePhone ?? "",
  };
}

export function formFromApi(api: InscripcionApiResponse): InscripcionFormValues {
  const documents = createEmptyDocuments().map((empty) => {
    const saved = api.documents.find((item) => item.documentType === empty.documentType);
    if (!saved) return empty;
    return {
      documentType: saved.documentType,
      presented: saved.presented,
      fileName: saved.fileName ?? "",
      storageKey: saved.storageKey,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
    };
  });

  return {
    schoolYear: api.schoolYear,
    shift: api.shift,
    groupName: api.groupName,
    enrollmentDate: api.enrollmentDate,
    student: {
      lastNames: api.student.lastNames,
      firstNames: api.student.firstNames,
      birthDate: api.student.birthDate,
      birthPlace: api.student.birthPlace ?? "",
      nationality: api.student.nationality,
      sex: api.student.sex,
      heightCm: api.student.heightCm?.toString() ?? "",
      weightKg: api.student.weightKg?.toString() ?? "",
      schoolRegistryNumber: api.student.schoolRegistryNumber ?? "",
      phone: api.student.phone ?? "",
      address: api.student.address ?? "",
    },
    previousSchooling: api.previousSchooling,
    previousInstitution: api.previousInstitution ?? "",
    mother: guardianFromApi(api.mother),
    father: guardianFromApi(api.father),
    responsibleType: api.responsibleType,
    responsibleOther: api.responsibleOther ?? "",
    livesWithMother: api.livesWithMother,
    livesWithFather: api.livesWithFather,
    pickupType: api.pickupType,
    pickupOther: api.pickupOther ?? "",
    illness: api.illness ?? "",
    allergies: api.allergies ?? "",
    operated: api.operated,
    operationDetails: api.operationDetails ?? "",
    psychologicalTreatment: api.psychologicalTreatment,
    psychologicalDetails: api.psychologicalDetails ?? "",
    photoDataUrl: api.photoDataUrl,
    commitmentAccepted: api.commitmentAccepted,
    commitmentSignatureName: api.commitmentSignatureName,
    commitmentSignatureDate: api.commitmentSignatureDate,
    commitmentSignatureData: api.commitmentSignatureData,
    documents,
  };
}

export async function crearInscripcionPublica(
  payload: InscripcionPayload,
): Promise<InscripcionApiResponse> {
  return apiFetch<InscripcionApiResponse>("/public/enrollments", {
    method: "POST",
    body: payload,
  });
}

export async function listarInscripciones(params: {
  schoolYear?: string;
  group?: string;
  query?: string;
  page?: number;
  size?: number;
}): Promise<InscripcionListResponse> {
  const search = new URLSearchParams();
  if (params.schoolYear) search.set("schoolYear", params.schoolYear);
  if (params.group) search.set("group", params.group);
  if (params.query) search.set("q", params.query);
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 20));
  return authFetch<InscripcionListResponse>(`/enrollments?${search.toString()}`);
}

export async function obtenerInscripcion(id: number | string): Promise<InscripcionApiResponse> {
  return authFetch<InscripcionApiResponse>(`/enrollments/${id}`);
}

export async function actualizarInscripcion(
  id: number | string,
  payload: InscripcionPayload,
): Promise<InscripcionApiResponse> {
  return authFetch<InscripcionApiResponse>(`/enrollments/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function eliminarInscripcion(id: number): Promise<void> {
  await authFetch<void>(`/enrollments/${id}`, { method: "DELETE" });
}

export async function subirDocumentoInscripcion(
  file: File,
): Promise<DocumentoSubidoResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<DocumentoSubidoResponse>("/public/enrollments/documents", {
    method: "POST",
    body: formData,
  });
}

export async function descargarDocumentoInscripcion(
  inscripcionId: number,
  documentType: EnrollmentDocumentType,
  fileName: string,
): Promise<void> {
  const blob = await apiFetchBlob(
    `/enrollments/${inscripcionId}/documents/${documentType}`,
    { token: getToken() },
  );
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || `${documentType}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function documentoLabel(type: EnrollmentDocumentType): string {
  return DOCUMENTOS.find((documento) => documento.type === type)?.label ?? type;
}

export function validarArchivoDocumento(file: File): string | null {
  if (!DOCUMENTO_MIME_TYPES.includes(file.type)) {
    return "Formato no permitido. Adjunta un archivo PDF, JPG, PNG o WebP.";
  }
  if (file.size > DOCUMENTO_MAX_BYTES) {
    return "El archivo supera el límite de 10 MB.";
  }
  return null;
}

export async function comprimirFotoAlumno(
  file: File,
  maxWidth = 640,
  maxHeight = 800,
  quality = 0.82,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("La foto debe ser una imagen JPG, PNG o WebP.");
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("No se pudo procesar la imagen"));
    element.src = dataUrl;
  });

  const ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la vista previa de la foto");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function resumenNombre(inscripcion: InscripcionResumenApi): string {
  return inscripcion.studentFullName;
}

export function documentoDesdeArchivo(
  document: DocumentoFormValues,
  uploaded: DocumentoSubidoResponse,
): DocumentoFormValues {
  return {
    ...document,
    presented: true,
    fileName: uploaded.fileName,
    storageKey: uploaded.storageKey,
    mimeType: uploaded.mimeType,
    sizeBytes: uploaded.sizeBytes,
  };
}
