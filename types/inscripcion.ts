export type Shift = "MORNING" | "AFTERNOON";

export type GroupName = "MATERNAL" | "GROUP_I" | "GROUP_II" | "GROUP_III";

export type StudentSex = "FEMALE" | "MALE";

export type PreviousSchooling = "HOME" | "SAME_SCHOOL" | "OTHER_SCHOOL" | "DAYCARE" | "OTHER";

export type ResponsibleType = "MOTHER" | "FATHER" | "OTHER";

export type PickupType = "MOTHER" | "FATHER" | "BOTH" | "TRANSPORT" | "OTHER";

export type EnrollmentDocumentType =
  | "BIRTH_CERTIFICATE"
  | "VACCINE_CERTIFICATE"
  | "MOTHER_ID"
  | "FATHER_ID"
  | "STUDENT_PHOTO";

export type GuardianRelationship = "MOTHER" | "FATHER";

export interface StudentFormValues {
  lastNames: string;
  firstNames: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  sex: string;
  heightCm: string;
  weightKg: string;
  schoolRegistryNumber: string;
  phone: string;
  address: string;
}

export interface GuardianFormValues {
  fullName: string;
  nationalId: string;
  address: string;
  birthDate: string;
  occupation: string;
  works: boolean;
  employer: string;
  email: string;
  homePhone: string;
  mobilePhone: string;
  officePhone: string;
}

export interface DocumentoFormValues {
  documentType: EnrollmentDocumentType;
  presented: boolean;
  fileName: string;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
}

export interface InscripcionFormValues {
  schoolYear: string;
  shift: string;
  groupName: string;
  enrollmentDate: string;
  student: StudentFormValues;
  previousSchooling: string;
  previousInstitution: string;
  mother: GuardianFormValues;
  father: GuardianFormValues;
  responsibleType: string;
  responsibleOther: string;
  livesWithMother: boolean;
  livesWithFather: boolean;
  pickupType: string;
  pickupOther: string;
  illness: string;
  allergies: string;
  operated: boolean;
  operationDetails: string;
  psychologicalTreatment: boolean;
  psychologicalDetails: string;
  photoDataUrl: string | null;
  commitmentAccepted: boolean;
  commitmentSignatureName: string;
  commitmentSignatureDate: string;
  commitmentSignatureData: string | null;
  documents: DocumentoFormValues[];
}

export interface GuardianPayload {
  fullName: string;
  nationalId: string | null;
  address: string | null;
  birthDate: string | null;
  occupation: string | null;
  works: boolean;
  employer: string | null;
  email: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  officePhone: string | null;
}

export interface DocumentoPayload {
  documentType: EnrollmentDocumentType;
  presented: boolean;
  fileName: string | null;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
}

export interface InscripcionPayload {
  schoolYear: string;
  shift: Shift;
  groupName: GroupName;
  enrollmentDate: string;
  student: {
    lastNames: string;
    firstNames: string;
    birthDate: string;
    birthPlace: string | null;
    nationality: string;
    sex: StudentSex;
    heightCm: number | null;
    weightKg: number | null;
    schoolRegistryNumber: string | null;
    phone: string;
    address: string;
  };
  previousSchooling: PreviousSchooling;
  previousInstitution: string | null;
  mother: GuardianPayload | null;
  father: GuardianPayload | null;
  responsibleType: ResponsibleType;
  responsibleOther: string | null;
  livesWithMother: boolean;
  livesWithFather: boolean;
  pickupType: PickupType;
  pickupOther: string | null;
  illness: string | null;
  allergies: string | null;
  operated: boolean;
  operationDetails: string | null;
  psychologicalTreatment: boolean;
  psychologicalDetails: string | null;
  photoDataUrl: string | null;
  commitmentAccepted: boolean;
  commitmentSignatureName: string;
  commitmentSignatureDate: string;
  commitmentSignatureData: string | null;
  documents: DocumentoPayload[];
}

export interface StudentApiResponse {
  id: number;
  firstNames: string;
  lastNames: string;
  birthDate: string;
  birthPlace: string | null;
  nationality: string;
  sex: StudentSex;
  heightCm: number | null;
  weightKg: number | null;
  schoolRegistryNumber: string | null;
  phone: string | null;
  address: string | null;
}

export interface GuardianApiResponse {
  id: number;
  relationship: GuardianRelationship;
  fullName: string;
  nationalId: string | null;
  address: string | null;
  birthDate: string | null;
  occupation: string | null;
  works: boolean;
  employer: string | null;
  email: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  officePhone: string | null;
}

export interface DocumentoApiResponse {
  id: number;
  documentType: EnrollmentDocumentType;
  presented: boolean;
  fileName: string | null;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
}

export interface InscripcionApiResponse {
  id: number;
  schoolYear: string;
  shift: Shift;
  groupName: GroupName;
  enrollmentDate: string;
  student: StudentApiResponse;
  mother: GuardianApiResponse | null;
  father: GuardianApiResponse | null;
  previousSchooling: PreviousSchooling;
  previousInstitution: string | null;
  responsibleType: ResponsibleType;
  responsibleOther: string | null;
  livesWithMother: boolean;
  livesWithFather: boolean;
  pickupType: PickupType;
  pickupOther: string | null;
  illness: string | null;
  allergies: string | null;
  operated: boolean;
  operationDetails: string | null;
  psychologicalTreatment: boolean;
  psychologicalDetails: string | null;
  photoDataUrl: string | null;
  commitmentAccepted: boolean;
  commitmentSignatureName: string;
  commitmentSignatureDate: string;
  commitmentSignatureData: string | null;
  documents: DocumentoApiResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface InscripcionResumenApi {
  id: number;
  schoolYear: string;
  shift: Shift;
  groupName: GroupName;
  enrollmentDate: string;
  studentId: number;
  studentFullName: string;
  studentBirthDate: string;
  studentSex: StudentSex;
  motherName: string | null;
  fatherName: string | null;
  hasPhoto: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InscripcionListResponse {
  content: InscripcionResumenApi[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DocumentoSubidoResponse {
  storageKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}
