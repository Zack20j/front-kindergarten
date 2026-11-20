import {
  esCedulaValida,
  esEmailValido,
  esTelefonoValido,
  grupoEdadValido,
  normalizarCedula,
  parseIsoDate,
} from "@/lib/venezuela";
import type { GuardianFormValues, InscripcionFormValues } from "@/types/inscripcion";

export type ErroresInscripcion = Record<string, string>;

const TEXTO = (value: string | null | undefined) => (value ?? "").trim();

function tieneTexto(value: string | null | undefined): boolean {
  return TEXTO(value).length > 0;
}

function tieneDatosRepresentante(guardian: GuardianFormValues): boolean {
  return (
    tieneTexto(guardian.fullName) ||
    tieneTexto(guardian.nationalId) ||
    tieneTexto(guardian.address) ||
    tieneTexto(guardian.birthDate) ||
    tieneTexto(guardian.occupation) ||
    guardian.works ||
    tieneTexto(guardian.employer) ||
    tieneTexto(guardian.email) ||
    tieneTexto(guardian.homePhone) ||
    tieneTexto(guardian.mobilePhone) ||
    tieneTexto(guardian.officePhone)
  );
}

export function representanteCompleto(guardian: GuardianFormValues): boolean {
  return (
    tieneTexto(guardian.fullName) &&
    esCedulaValida(guardian.nationalId) &&
    (esTelefonoValido(guardian.homePhone) ||
      esTelefonoValido(guardian.mobilePhone) ||
      esTelefonoValido(guardian.officePhone))
  );
}

export function hayRepresentanteCompleto(data: InscripcionFormValues): boolean {
  return representanteCompleto(data.mother) || representanteCompleto(data.father);
}

function validarRepresentante(
  guardian: GuardianFormValues,
  prefijo: "mother" | "father",
  etiqueta: string,
  errors: ErroresInscripcion,
) {
  if (!tieneDatosRepresentante(guardian)) return;

  if (!tieneTexto(guardian.fullName)) {
    errors[`${prefijo}.fullName`] = `Indica el nombre y apellido de la ${etiqueta}.`;
  }
  if (!tieneTexto(guardian.nationalId)) {
    errors[`${prefijo}.nationalId`] = `La cédula de la ${etiqueta} es obligatoria.`;
  } else if (!esCedulaValida(guardian.nationalId)) {
    errors[`${prefijo}.nationalId`] =
      "Formato de cédula inválido. Usa V-12345678 o E-12345678.";
  }

  const telefonos = [
    { key: `${prefijo}.homePhone`, value: guardian.homePhone },
    { key: `${prefijo}.mobilePhone`, value: guardian.mobilePhone },
    { key: `${prefijo}.officePhone`, value: guardian.officePhone },
  ];
  let tieneTelefonoValido = false;
  for (const telefono of telefonos) {
    if (!tieneTexto(telefono.value)) continue;
    if (!esTelefonoValido(telefono.value)) {
      errors[telefono.key] =
        "Teléfono inválido. Usa un número venezolano, por ejemplo 0414-1234567.";
    } else {
      tieneTelefonoValido = true;
    }
  }
  if (!tieneTelefonoValido) {
    errors[`${prefijo}.mobilePhone`] =
      `Registra al menos un teléfono válido de la ${etiqueta}.`;
  }

  if (tieneTexto(guardian.email) && !esEmailValido(guardian.email)) {
    errors[`${prefijo}.email`] = "Correo electrónico inválido.";
  }

  if (tieneTexto(guardian.birthDate)) {
    const fecha = parseIsoDate(guardian.birthDate);
    if (!fecha) {
      errors[`${prefijo}.birthDate`] = "Fecha de nacimiento inválida.";
    } else if (fecha > new Date()) {
      errors[`${prefijo}.birthDate`] = "La fecha de nacimiento no puede estar en el futuro.";
    }
  }
}

export function validarInscripcion(data: InscripcionFormValues): ErroresInscripcion {
  const errors: ErroresInscripcion = {};

  if (!tieneTexto(data.schoolYear)) {
    errors.schoolYear = "Selecciona el año escolar.";
  }
  if (!tieneTexto(data.shift)) {
    errors.shift = "Selecciona el turno.";
  }
  if (!tieneTexto(data.groupName)) {
    errors.groupName = "Selecciona el grupo.";
  }
  if (!tieneTexto(data.enrollmentDate)) {
    errors.enrollmentDate = "Indica la fecha de inscripción.";
  } else if (!parseIsoDate(data.enrollmentDate)) {
    errors.enrollmentDate = "Fecha de inscripción inválida.";
  }

  const student = data.student;
  if (!tieneTexto(student.lastNames)) {
    errors["student.lastNames"] = "Los apellidos son obligatorios.";
  }
  if (!tieneTexto(student.firstNames)) {
    errors["student.firstNames"] = "Los nombres son obligatorios.";
  }
  if (!tieneTexto(student.birthDate)) {
    errors["student.birthDate"] = "La fecha de nacimiento es obligatoria.";
  } else {
    const fecha = parseIsoDate(student.birthDate);
    if (!fecha) {
      errors["student.birthDate"] = "Fecha de nacimiento inválida.";
    } else if (fecha > new Date()) {
      errors["student.birthDate"] = "La fecha de nacimiento no puede estar en el futuro.";
    } else if (tieneTexto(data.groupName) && tieneTexto(data.schoolYear)) {
      const { valido, edad } = grupoEdadValido(
        data.groupName,
        student.birthDate,
        data.schoolYear,
      );
      if (!valido) {
        errors["student.birthDate"] =
          edad === null
            ? "No se pudo calcular la edad del alumno."
            : `La edad (${edad} años) no corresponde al grupo seleccionado. Verifica la fecha de nacimiento o el grupo.`;
      }
    }
  }
  if (!tieneTexto(student.nationality)) {
    errors["student.nationality"] = "La nacionalidad es obligatoria.";
  }
  if (!tieneTexto(student.sex)) {
    errors["student.sex"] = "Selecciona el sexo.";
  }
  if (!tieneTexto(student.phone)) {
    errors["student.phone"] = "El teléfono del alumno es obligatorio.";
  } else if (!esTelefonoValido(student.phone)) {
    errors["student.phone"] =
      "Teléfono inválido. Usa un número venezolano, por ejemplo 0414-1234567.";
  }
  if (!tieneTexto(student.address)) {
    errors["student.address"] = "La dirección es obligatoria.";
  }
  if (tieneTexto(student.heightCm)) {
    const talla = Number(student.heightCm.replace(",", "."));
    if (!Number.isFinite(talla) || talla < 30 || talla > 200) {
      errors["student.heightCm"] = "La talla debe estar entre 30 y 200 cm.";
    }
  }
  if (tieneTexto(student.weightKg)) {
    const peso = Number(student.weightKg.replace(",", "."));
    if (!Number.isFinite(peso) || peso < 5 || peso > 120) {
      errors["student.weightKg"] = "El peso debe estar entre 5 y 120 kg.";
    }
  }

  validarRepresentante(data.mother, "mother", "madre", errors);
  validarRepresentante(data.father, "father", "padre", errors);
  if (!hayRepresentanteCompleto(data)) {
    errors["mother.fullName"] =
      "Completa al menos un representante (madre o padre) con nombre, cédula y teléfono.";
  }

  if (!tieneTexto(data.previousSchooling)) {
    errors.previousSchooling = "Selecciona la procedencia del alumno.";
  } else if (
    ["OTHER_SCHOOL", "DAYCARE", "OTHER"].includes(data.previousSchooling) &&
    !tieneTexto(data.previousInstitution)
  ) {
    errors.previousInstitution = "Indica la institución donde estudió el alumno.";
  }

  if (!tieneTexto(data.responsibleType)) {
    errors.responsibleType = "Selecciona el responsable ante la institución.";
  } else if (data.responsibleType === "OTHER" && !tieneTexto(data.responsibleOther)) {
    errors.responsibleOther = "Especifica quién es el responsable.";
  }

  if (!data.livesWithMother && !data.livesWithFather) {
    errors["livesWith"] = "Marca al menos una opción.";
  }

  if (!tieneTexto(data.pickupType)) {
    errors.pickupType = "Selecciona quién retira al alumno.";
  } else if (data.pickupType === "OTHER" && !tieneTexto(data.pickupOther)) {
    errors.pickupOther = "Especifica quién retira al alumno.";
  }

  if (data.operated && !tieneTexto(data.operationDetails)) {
    errors.operationDetails = "Indica de qué fue operado el alumno.";
  }
  if (data.psychologicalTreatment && !tieneTexto(data.psychologicalDetails)) {
    errors.psychologicalDetails = "Explica el tratamiento psicológico.";
  }

  if (!data.commitmentAccepted) {
    errors.commitmentAccepted = "Debes aceptar el acta de compromiso.";
  }
  if (!tieneTexto(data.commitmentSignatureName)) {
    errors.commitmentSignatureName = "Escribe el nombre del representante que firma.";
  }
  if (!tieneTexto(data.commitmentSignatureDate)) {
    errors.commitmentSignatureDate = "Indica la fecha de la firma.";
  } else if (!parseIsoDate(data.commitmentSignatureDate)) {
    errors.commitmentSignatureDate = "Fecha de firma inválida.";
  }

  return errors;
}

const CAMPOS_POR_SECCION: Record<string, string[]> = {
  "seccion-inscripcion": ["schoolYear", "shift", "groupName", "enrollmentDate"],
  "seccion-alumno": [
    "student.lastNames",
    "student.firstNames",
    "student.birthDate",
    "student.nationality",
    "student.sex",
    "student.phone",
    "student.address",
  ],
  "seccion-otros": ["responsibleType", "pickupType", "livesWith"],
  "seccion-acta": [
    "commitmentAccepted",
    "commitmentSignatureName",
    "commitmentSignatureDate",
  ],
};

function getValue(data: InscripcionFormValues, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, data);
}

function campoCompleto(data: InscripcionFormValues, path: string): boolean {
  if (path === "livesWith") return data.livesWithMother || data.livesWithFather;
  const value = getValue(data, path);
  return typeof value === "boolean" ? value : tieneTexto(String(value ?? ""));
}

export interface ProgresoSeccion {
  completos: number;
  total: number;
  porcentaje: number;
}

export function progresoInscripcion(
  data: InscripcionFormValues,
  errors: ErroresInscripcion,
): { global: number; secciones: Record<string, ProgresoSeccion> } {
  const secciones: Record<string, ProgresoSeccion> = {};
  let completosGlobal = 0;
  let totalGlobal = 0;

  for (const [seccion, campos] of Object.entries(CAMPOS_POR_SECCION)) {
    const completos = campos.filter(
      (campo) => campoCompleto(data, campo) && !errors[campo],
    ).length;
    const total = campos.length;
    secciones[seccion] = {
      completos,
      total,
      porcentaje: total === 0 ? 100 : Math.round((completos / total) * 100),
    };
    completosGlobal += completos;
    totalGlobal += total;
  }

  secciones["seccion-familia"] = {
    completos: hayRepresentanteCompleto(data) ? 1 : 0,
    total: 1,
    porcentaje: hayRepresentanteCompleto(data) ? 100 : 0,
  };
  completosGlobal += secciones["seccion-familia"].completos;
  totalGlobal += 1;

  secciones["seccion-adicional"] = {
    completos: 0,
    total: 0,
    porcentaje:
      !errors.operationDetails && !errors.psychologicalDetails ? 100 : 0,
  };
  secciones["seccion-documentos"] = { completos: 0, total: 0, porcentaje: 100 };

  return {
    global: totalGlobal === 0 ? 0 : Math.round((completosGlobal / totalGlobal) * 100),
    secciones,
  };
}

export function normalizarCedulaFormulario(value: string): string {
  return normalizarCedula(value);
}
