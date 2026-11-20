import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  GRUPO_OPCIONES,
  PROCEDENCIA_OPCIONES,
  RESPONSABLE_OPCIONES,
  RETIRO_OPCIONES,
  SEXO_OPCIONES,
  TURNO_OPCIONES,
} from "@/data/inscripcion";
import { calcularEdad, formatearFecha } from "@/lib/venezuela";
import type { GuardianFormValues, InscripcionFormValues } from "@/types/inscripcion";
import styles from "./PlanillaImpresion.module.css";

interface PlanillaImpresionProps {
  data: InscripcionFormValues;
  folio?: number | null;
}

function labelDe(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function fechaImpresion(value: string | null | undefined): string {
  return value ? formatearFecha(value) : "";
}

function Row({
  template,
  children,
  style,
}: {
  template: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.row} style={{ gridTemplateColumns: template, ...style }}>
      {children}
    </div>
  );
}

function Cell({
  label,
  value,
  span,
  children,
}: {
  label: string;
  value?: string;
  span?: number;
  children?: ReactNode;
}) {
  return (
    <div className={styles.cell} style={span ? { gridColumn: `span ${span}` } : undefined}>
      <span className={styles.label}>{label}</span>
      {children ?? <div className={styles.value}>{value || "\u00A0"}</div>}
    </div>
  );
}

function Casilla({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className={styles.check}>
      <span className={styles.box}>{checked ? "X" : ""}</span>
      {label}
    </span>
  );
}

function GuardianBlock({
  title,
  guardian,
}: {
  title: string;
  guardian: GuardianFormValues;
}) {
  return (
    <div className={styles.block}>
      <div className={styles.subBar}>{title}</div>
      <Row template="1.9fr 1fr">
        <Cell label="Nombre y apellido" value={guardian.fullName} />
        <Cell label="C.I." value={guardian.nationalId} />
      </Row>
      <Row template="1.9fr 1fr">
        <Cell label="Dirección" value={guardian.address} />
        <Cell label="Fecha de nacimiento" value={fechaImpresion(guardian.birthDate)} />
      </Row>
      <Row template="1.2fr 0.9fr 1.7fr">
        <Cell label="Profesión / oficio" value={guardian.occupation} />
        <Cell label="¿Trabaja?">
          <div className={styles.checkLine} style={{ marginTop: 1 }}>
            <Casilla checked={guardian.works} label="Sí" />
            <Casilla checked={!guardian.works} label="No" />
          </div>
        </Cell>
        <Cell label="Nombre de la empresa" value={guardian.employer} />
      </Row>
      <Row template="1.5fr 1fr 1fr 1fr">
        <Cell label="E-mail" value={guardian.email} />
        <Cell label="Tel. habitación" value={guardian.homePhone} />
        <Cell label="Celular" value={guardian.mobilePhone} />
        <Cell label="Oficina" value={guardian.officePhone} />
      </Row>
    </div>
  );
}

export default function PlanillaImpresion({ data, folio }: PlanillaImpresionProps) {
  const edad = calcularEdad(data.student.birthDate, data.enrollmentDate);
  const turno = labelDe(TURNO_OPCIONES, data.shift);
  const grupo = labelDe(GRUPO_OPCIONES, data.groupName);
  const sexo = labelDe(SEXO_OPCIONES, data.student.sex);

  return (
    <article className={styles.sheet} aria-label="Planilla de inscripción imprimible">
      <header className={styles.header}>
        <Image
          src="/images/logo.png"
          alt="Escudo del CEI Luisa Cáceres de Arismendi"
          width={180}
          height={180}
          unoptimized
          className={styles.logo}
        />
        <div className={styles.institution}>
          <div>REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
          <div>MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN</div>
          <div className={styles.school}>
            CENTRO DE EDUCACIÓN INICIAL &quot;LUISA CÁCERES DE ARISMENDI&quot;
          </div>
          <div>PUERTO ORDAZ - ESTADO BOLÍVAR</div>
          <div className={styles.year}>
            AÑO ESCOLAR {data.schoolYear || "20__-20__"}
          </div>
        </div>
        <div className={styles.photoBox}>
          {data.photoDataUrl ? (
            <img
              src={data.photoDataUrl}
              alt="Foto del alumno"
              className={styles.photoImage}
            />
          ) : (
            <span>
              FOTO
              <br />
              DEL ALUMNO
            </span>
          )}
        </div>
      </header>

      <h1 className={styles.title}>PLANILLA DE INSCRIPCIÓN</h1>

      <div className={styles.block}>
        <Row template="1.05fr 0.9fr 1fr 1.25fr">
          <Cell label="Año escolar" value={data.schoolYear} />
          <Cell label="Turno" value={turno} />
          <Cell label="Grupo" value={grupo} />
          <Cell label="Fecha de inscripción" value={fechaImpresion(data.enrollmentDate)} />
        </Row>
      </div>

      <div className={styles.sectionBar}>Datos del alumno</div>
      <div className={styles.block}>
        <Row template="1fr 1.5fr">
          <Cell label="Apellidos" value={data.student.lastNames} />
          <Cell label="Nombres" value={data.student.firstNames} />
        </Row>
        <Row template="1.15fr 1.85fr 0.55fr 0.55fr 1.1fr">
          <Cell label="Fecha de nacimiento" value={fechaImpresion(data.student.birthDate)} />
          <Cell label="Lugar" value={data.student.birthPlace} />
          <Cell label="Edad" value={edad ? String(edad.anios) : ""} />
          <Cell label="Meses" value={edad ? String(edad.meses) : ""} />
          <Cell label="Nacionalidad" value={data.student.nationality} />
        </Row>
        <Row template="0.85fr 0.8fr 0.8fr 1.4fr 1.2fr">
          <Cell label="Sexo" value={sexo} />
          <Cell label="Talla" value={data.student.heightCm ? `${data.student.heightCm} cm` : ""} />
          <Cell label="Peso" value={data.student.weightKg ? `${data.student.weightKg} kg` : ""} />
          <Cell label="N° Registro Escolar" value={data.student.schoolRegistryNumber} />
          <Cell label="Teléfono" value={data.student.phone} />
        </Row>
        <Row template="1fr">
          <Cell label="Dirección" value={data.student.address} />
        </Row>
        <Row template="1fr">
          <Cell label="Procedencia">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              {PROCEDENCIA_OPCIONES.map((option) => (
                <Casilla
                  key={option.value}
                  checked={data.previousSchooling === option.value}
                  label={option.label}
                />
              ))}
            </div>
          </Cell>
        </Row>
        <Row template="1fr">
          <Cell label="Institución donde estudió" value={data.previousInstitution} />
        </Row>
      </div>

      <div className={styles.sectionBar}>Datos familiares</div>
      <GuardianBlock title="Madre" guardian={data.mother} />
      <GuardianBlock title="Padre" guardian={data.father} />

      <div className={styles.sectionBar}>Otros datos importantes</div>
      <div className={styles.block}>
        <Row template="1.6fr 1fr">
          <Cell label="Responsable del niño/a ante la institución">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              {RESPONSABLE_OPCIONES.map((option) => (
                <Casilla
                  key={option.value}
                  checked={data.responsibleType === option.value}
                  label={option.label}
                />
              ))}
              {data.responsibleType === "OTHER" && (
                <span className={styles.muted}>Especificar: {data.responsibleOther}</span>
              )}
            </div>
          </Cell>
          <Cell label="El niño/a vive con">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              <Casilla checked={data.livesWithMother} label="Mamá" />
              <Casilla checked={data.livesWithFather} label="Papá" />
            </div>
          </Cell>
        </Row>
        <Row template="1fr">
          <Cell label="Responsable de retirar al niño/a de la institución">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              {RETIRO_OPCIONES.map((option) => (
                <Casilla
                  key={option.value}
                  checked={data.pickupType === option.value}
                  label={option.label}
                />
              ))}
              {data.pickupType === "OTHER" && (
                <span className={styles.muted}>Especificar: {data.pickupOther}</span>
              )}
            </div>
          </Cell>
        </Row>
      </div>

      <div className={styles.sectionBar}>Información adicional</div>
      <div className={styles.block}>
        <Row template="1fr 1fr">
          <Cell label="¿Padece alguna enfermedad?" value={data.illness} />
          <Cell label="¿Es alérgico/a?" value={data.allergies} />
        </Row>
        <Row template="1.1fr 1.1fr">
          <Cell label="¿Ha sido operado?">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              <Casilla checked={data.operated} label="Sí" />
              <Casilla checked={!data.operated} label="No" />
              <span>¿De qué? {data.operated ? data.operationDetails : ""}</span>
            </div>
          </Cell>
          <Cell label="¿Recibe tratamiento psicológico?">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              <Casilla checked={data.psychologicalTreatment} label="Sí" />
              <Casilla checked={!data.psychologicalTreatment} label="No" />
              <span>
                Explique: {data.psychologicalTreatment ? data.psychologicalDetails : ""}
              </span>
            </div>
          </Cell>
        </Row>
      </div>

      <div className={styles.sectionBar}>Documentos presentados al momento de inscribir</div>
      <div className={styles.block}>
        <Row template="1fr">
          <Cell label="Documentos">
            <div className={styles.checkLine} style={{ marginTop: 1 }}>
              {data.documents.map((document) => (
                <Casilla
                  key={document.documentType}
                  checked={document.presented}
                  label={
                    document.documentType === "BIRTH_CERTIFICATE"
                      ? "Partida de nacimiento"
                      : document.documentType === "VACCINE_CERTIFICATE"
                        ? "Certificado de vacuna"
                        : document.documentType === "MOTHER_ID"
                          ? "C.I. Madre"
                          : document.documentType === "FATHER_ID"
                            ? "C.I. Padre"
                            : "Foto del alumno"
                  }
                />
              ))}
            </div>
          </Cell>
        </Row>
      </div>

      <div className={styles.acta}>
        <div className={styles.sectionBar}>Acta de compromiso</div>
        <div className={styles.block}>
          <div style={{ padding: "3pt 4pt 4pt" }}>
            <p className={styles.actaText}>
              La siguiente acta de compromiso se encuentra dirigida al representante legal del
              estudiante, la cual será firmada por el mismo para garantizar su educación de acuerdo
              con lo establecido con los Art. 14, 73 y 103 de la Ley Orgánica de Educación (LOE),
              para dar continuidad al próximo año escolar.
            </p>
            <p className={styles.actaText}>
              El representante se compromete a asegurar la asistencia regular del estudiante a clase,
              participar activamente en su proceso educativo asistiendo a reuniones y manteniéndose
              informado de su progreso, y llevar al estudiante con cualquier especialista recomendado
              para apoyar su aprendizaje. De igual manera cumplir y respetar los acuerdos de
              convivencia de nuestra institución educativa. De no cumplir con estos compromisos, el
              caso será remitido a las autoridades correspondientes.
            </p>
            <div className={styles.checkLine} style={{ marginTop: 5 }}>
              <Casilla checked={data.commitmentAccepted} label="Acepto el acta de compromiso" />
            </div>

            <div className={styles.signatureGrid}>
              <div className={styles.signatureBox}>
                {data.commitmentSignatureData && (
                  <img
                    src={data.commitmentSignatureData}
                    alt="Firma del representante"
                    className={styles.signatureImage}
                  />
                )}
                <div>Firma del representante</div>
              </div>
              <div className={styles.signatureBox}>
                <div style={{ minHeight: "0.32in", fontWeight: 600 }}>
                  {data.commitmentSignatureName || "\u00A0"}
                </div>
                <div>Nombre y apellido · Fecha: {fechaImpresion(data.commitmentSignatureDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>CEI &quot;Luisa Cáceres de Arismendi&quot; · Puerto Ordaz, Estado Bolívar</span>
        <span>{folio ? `Folio N° ${folio}` : "Planilla de inscripción"}</span>
      </div>
    </article>
  );
}
