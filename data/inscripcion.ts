import type {
  DocumentoFormValues,
  EnrollmentDocumentType,
  GuardianFormValues,
  InscripcionFormValues,
  StudentFormValues,
} from "@/types/inscripcion";

export interface Opcion {
  value: string;
  label: string;
}

export const TURNO_OPCIONES: Opcion[] = [
  { value: "MORNING", label: "Mañana" },
  { value: "AFTERNOON", label: "Tarde" },
];

export const GRUPO_OPCIONES: Opcion[] = [
  { value: "MATERNAL", label: "Maternal" },
  { value: "GROUP_I", label: "I Grupo" },
  { value: "GROUP_II", label: "II Grupo" },
  { value: "GROUP_III", label: "III Grupo" },
];

export const SEXO_OPCIONES: Opcion[] = [
  { value: "FEMALE", label: "Femenino" },
  { value: "MALE", label: "Masculino" },
];

export const NACIONALIDAD_OPCIONES: Opcion[] = [
  { value: "Venezolana", label: "Venezolana" },
  { value: "Extranjera", label: "Extranjera" },
];

export const PROCEDENCIA_OPCIONES: Opcion[] = [
  { value: "HOME", label: "Del hogar" },
  { value: "SAME_SCHOOL", label: "Del mismo plantel" },
  { value: "OTHER_SCHOOL", label: "Otro plantel" },
  { value: "DAYCARE", label: "Guardería" },
  { value: "OTHER", label: "Otros" },
];

export const RESPONSABLE_OPCIONES: Opcion[] = [
  { value: "MOTHER", label: "Mamá" },
  { value: "FATHER", label: "Papá" },
  { value: "OTHER", label: "Otros" },
];

export const RETIRO_OPCIONES: Opcion[] = [
  { value: "MOTHER", label: "Mamá" },
  { value: "FATHER", label: "Papá" },
  { value: "BOTH", label: "Ambos" },
  { value: "TRANSPORT", label: "Transporte" },
  { value: "OTHER", label: "Otros" },
];

export const DOCUMENTOS: {
  type: EnrollmentDocumentType;
  label: string;
  hint: string;
}[] = [
  {
    type: "BIRTH_CERTIFICATE",
    label: "Partida de nacimiento",
    hint: "Copia reciente del niño o niña.",
  },
  {
    type: "VACCINE_CERTIFICATE",
    label: "Certificado de vacuna",
    hint: "Esquema de vacunación al día.",
  },
  {
    type: "MOTHER_ID",
    label: "C.I. Madre",
    hint: "Cédula de la representante.",
  },
  {
    type: "FATHER_ID",
    label: "C.I. Padre",
    hint: "Cédula del representante.",
  },
  {
    type: "STUDENT_PHOTO",
    label: "Foto del alumno",
    hint: "Foto reciente tipo carnet.",
  },
];

export const SECCIONES = [
  { id: "seccion-inscripcion", label: "Datos de inscripción" },
  { id: "seccion-alumno", label: "Datos del alumno" },
  { id: "seccion-familia", label: "Datos familiares" },
  { id: "seccion-otros", label: "Otros datos" },
  { id: "seccion-adicional", label: "Información adicional" },
  { id: "seccion-documentos", label: "Documentos" },
  { id: "seccion-acta", label: "Acta de compromiso" },
] as const;

export type SeccionId = (typeof SECCIONES)[number]["id"];

export const ACTA_TEXTO = [
  "La siguiente acta de compromiso se encuentra dirigida al representante legal del estudiante, la cual será firmada por el mismo para garantizar su educación de acuerdo con lo establecido con los Art. 14, 73 y 103 de la Ley Orgánica de Educación (LOE), para dar continuidad al próximo año escolar.",
  "El representante se compromete a asegurar la asistencia regular del estudiante a clase, participar activamente en su proceso educativo asistiendo a reuniones y manteniéndose informado de su progreso, y llevar al estudiante con cualquier especialista recomendado para apoyar su aprendizaje. De igual manera cumplir y respetar los acuerdos de convivencia de nuestra institución educativa. De no cumplir con estos compromisos, el caso será remitido a las autoridades correspondientes.",
];

export const BORRADOR_STORAGE_KEY = "kindergarten.inscripcion.borrador.v1";

export function hoyLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function anioEscolarActual(): string {
  const today = new Date();
  const start = today.getMonth() + 1 >= 9 ? today.getFullYear() : today.getFullYear() - 1;
  return `${start}-${start + 1}`;
}

export function generarAniosEscolares(): string[] {
  const current = Number(anioEscolarActual().slice(0, 4));
  return Array.from({ length: 6 }, (_, index) => {
    const start = current - 2 + index;
    return `${start}-${start + 1}`;
  });
}

export function createEmptyStudent(): StudentFormValues {
  return {
    lastNames: "",
    firstNames: "",
    birthDate: "",
    birthPlace: "",
    nationality: "Venezolana",
    sex: "",
    heightCm: "",
    weightKg: "",
    schoolRegistryNumber: "",
    phone: "",
    address: "",
  };
}

export function createEmptyGuardian(): GuardianFormValues {
  return {
    fullName: "",
    nationalId: "",
    address: "",
    birthDate: "",
    occupation: "",
    works: false,
    employer: "",
    email: "",
    homePhone: "",
    mobilePhone: "",
    officePhone: "",
  };
}

export function createEmptyDocuments(): DocumentoFormValues[] {
  return DOCUMENTOS.map((documento) => ({
    documentType: documento.type,
    presented: false,
    fileName: "",
    storageKey: null,
    mimeType: null,
    sizeBytes: null,
  }));
}

export function createEmptyInscripcion(): InscripcionFormValues {
  const today = hoyLocal();
  return {
    schoolYear: anioEscolarActual(),
    shift: "MORNING",
    groupName: "",
    enrollmentDate: today,
    student: createEmptyStudent(),
    previousSchooling: "HOME",
    previousInstitution: "",
    mother: createEmptyGuardian(),
    father: createEmptyGuardian(),
    responsibleType: "",
    responsibleOther: "",
    livesWithMother: true,
    livesWithFather: false,
    pickupType: "",
    pickupOther: "",
    illness: "",
    allergies: "",
    operated: false,
    operationDetails: "",
    psychologicalTreatment: false,
    psychologicalDetails: "",
    photoDataUrl: null,
    commitmentAccepted: false,
    commitmentSignatureName: "",
    commitmentSignatureDate: today,
    commitmentSignatureData: null,
    documents: createEmptyDocuments(),
  };
}
