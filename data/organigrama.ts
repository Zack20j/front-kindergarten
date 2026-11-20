/**
 * Datos del organigrama institucional del CEI "Luisa Cáceres de Arismendi".
 *
 * Edita este archivo para actualizar cargos, nombres o la matrícula sin tocar
 * el componente visual. Los comentarios "TODO: verificar" marcan datos
 * transcritos de un documento escaneado que conviene confirmar con el colegio.
 */

export interface GrupoDocentes {
  grupo: string;
  docentes: string[];
}

export interface RamaOrganigrama {
  id: string;
  cargo: string;
  personas?: string[];
  grupos?: GrupoDocentes[];
  nota?: string;
}

export const ORGANIGRAMA = {
  schoolYear: "2026-2027",
  directora: {
    cargo: "Directora",
    nombre: "Nancy García",
  },
  ramas: [
    {
      id: "secretaria",
      cargo: "Personal administrativo (Secretaria)",
      // TODO: verificar la escritura del apellido (¿Roche / Rocha?).
      personas: ["Demarney Roche"],
    },
    {
      id: "auxiliares",
      cargo: "Personal administrativo (Docentes auxiliares)",
      personas: ["Yolina Velásquez", "Sandra Hernández", "María Martínez"],
    },
    {
      id: "educacion-fisica",
      cargo: "Docente de Educación Física",
      personas: ["Alexnis Márquez"],
    },
    {
      id: "docente-pedagogica",
      cargo: "Docente Pedagógica",
      personas: ["Arledys Hernández"],
    },
    {
      id: "docentes-aula",
      cargo: "Docentes de aula",
      grupos: [
        {
          grupo: "Maternal",
          // TODO: verificar si "Jadelsy Misel" es nombre y apellido o si falta uno.
          docentes: ["Jadelsy Misel", "Gladys Orfila"],
        },
        {
          grupo: "I Grupo",
          // TODO: verificar el apellido de Oscarina.
          docentes: ["Oscarina", "Ilania Graterol", "Isis Simosa"],
        },
        {
          grupo: "II Grupo",
          docentes: [
            "Militza Hernández",
            "Cristina Pérez",
            "Adyarid Matos",
            "Fabiola Rengel",
          ],
        },
        {
          grupo: "III Grupo",
          // TODO: verificar "Josvelys Rogino" y la asignación por aula.
          docentes: [
            "Lubia Mariño",
            "Andreina Rojas",
            "Josvelys Rogino",
            "Xiomara Tovar",
            "Aracelys Mendoza",
          ],
        },
      ],
    },
    {
      id: "obrero",
      cargo: "Personal obrero",
      personas: ["Eliana Gutiérrez", "Adriana Aguilar", "Adriana Pérez"],
    },
    {
      id: "cocinero",
      cargo: "Personal cocinero",
      personas: ["Erika Romero", "Francisco Alcalá"],
    },
    {
      id: "vigilante",
      cargo: "Personal vigilante",
      // TODO: verificar "Jatdiel Flores" (transcripción manuscrita).
      personas: ["Jatdiel Flores", "Venancio Vargas", "Gregory Rondón"],
    },
  ] as RamaOrganigrama[],
  matricula: {
    varones: 116,
    hembras: 114,
    actualizadoEn: "2026-11-19",
  },
  comites: [
    "Consejo estudiantil",
    "Madres, Padres, Representantes y Responsables",
    "Académico",
    "Comunicación e información",
    "Seguridad y defensa integral",
    "Cultura",
    "Infraestructura y hábitat escolar",
    "Inclusión escolar",
    "Institucional para la paz y convivencia",
    "Contraloría social",
    "Ambiente, alimentación, salud integral",
    "Deporte y educación física",
  ],
} as const;

export type OrganigramaData = typeof ORGANIGRAMA;

export function matriculaTotal(): number {
  return ORGANIGRAMA.matricula.varones + ORGANIGRAMA.matricula.hembras;
}
