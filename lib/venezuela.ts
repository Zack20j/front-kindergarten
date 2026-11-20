export const CEDULA_REGEX = /^[VE]-\d{6,9}$/;
export const TELEFONO_REGEX = /^0(4(12|14|16|24|26)|2\d{2})-?\d{7}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizarCedula(value: string): string {
  const raw = (value ?? "").trim().toUpperCase().replace(/[^VE0-9]/g, "");
  const match = /^([VE])(\d{6,9})$/.exec(raw);
  return match ? `${match[1]}-${match[2]}` : (value ?? "").trim().toUpperCase();
}

export function esCedulaValida(value: string): boolean {
  return CEDULA_REGEX.test(normalizarCedula(value));
}

export function normalizarTelefono(value: string): string {
  let digits = (value ?? "").replace(/\D/g, "");
  if (digits.startsWith("58") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }
  if (digits.length === 10 && /^4/.test(digits)) {
    digits = `0${digits}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return digits;
}

export function esTelefonoValido(value: string): boolean {
  return TELEFONO_REGEX.test(normalizarTelefono(value));
}

export function esEmailValido(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export interface EdadCalculada {
  anios: number;
  meses: number;
}

export function calcularEdad(
  fechaNacimiento: string,
  referencia: string,
): EdadCalculada | null {
  const birth = parseIsoDate(fechaNacimiento);
  const reference = parseIsoDate(referencia);
  if (!birth || !reference || birth > reference) return null;

  let months =
    (reference.getFullYear() - birth.getFullYear()) * 12 +
    (reference.getMonth() - birth.getMonth());
  if (reference.getDate() < birth.getDate()) months -= 1;

  return {
    anios: Math.floor(months / 12),
    meses: months % 12,
  };
}

export function formatearEdad(edad: EdadCalculada | null): string {
  if (!edad) return "—";
  const anios = edad.anios === 1 ? "1 año" : `${edad.anios} años`;
  const meses = edad.meses === 1 ? "1 mes" : `${edad.meses} meses`;
  return `${anios} y ${meses}`;
}

export function formatearFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function fechaLarga(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function grupoEdadValido(
  groupName: string,
  birthDate: string,
  schoolYear: string,
): { valido: boolean; edad: number | null } {
  if (!groupName || !birthDate) return { valido: true, edad: null };
  const startYear = Number(schoolYear.slice(0, 4));
  if (!Number.isFinite(startYear)) return { valido: true, edad: null };

  const reference = new Date(startYear, 8, 1);
  const birth = parseIsoDate(birthDate);
  if (!birth) return { valido: false, edad: null };
  if (birth > reference) return { valido: false, edad: 0 };

  const edad =
    reference.getFullYear() -
    birth.getFullYear() -
    (reference < new Date(reference.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);

  const valido = (() => {
    switch (groupName) {
      case "MATERNAL":
        return edad < 4;
      case "GROUP_I":
        return edad >= 3 && edad < 5;
      case "GROUP_II":
        return edad >= 4 && edad < 6;
      case "GROUP_III":
        return edad >= 5 && edad < 7;
      default:
        return true;
    }
  })();

  return { valido, edad };
}
