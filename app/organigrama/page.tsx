import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Briefcase,
  Check,
  ChevronDown,
  GraduationCap,
  HeartHandshake,
  Info,
  Network,
  School,
  Shield,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { ORGANIGRAMA, matriculaTotal, type RamaOrganigrama } from "@/data/organigrama";
import styles from "./Organigrama.module.css";

export const metadata: Metadata = {
  title: "Organigrama institucional - UEC Luisa Cáceres de Arismendi",
  description:
    "Organigrama, equipos de trabajo, matrícula y comités del Consejo Educativo del CEI Luisa Cáceres de Arismendi.",
};

const BRANCH_ICONS: Record<string, LucideIcon> = {
  secretaria: Briefcase,
  auxiliares: Users,
  "educacion-fisica": HeartHandshake,
  "docente-pedagogica": GraduationCap,
  "docentes-aula": Baby,
  obrero: Sparkles,
  cocinero: UtensilsCrossed,
  vigilante: Shield,
};

const MOSTRAR_NOMBRES =
  process.env.NEXT_PUBLIC_ORGANIGRAMA_MOSTRAR_NOMBRES !== "false";

function BranchDetails({
  rama,
  mostrarNombres,
}: {
  rama: RamaOrganigrama;
  mostrarNombres: boolean;
}) {
  const Icon = BRANCH_ICONS[rama.id] ?? Users;
  const totalPersonas =
    rama.personas?.length ??
    rama.grupos?.reduce((total, group) => total + group.docentes.length, 0) ??
    0;
  const wide = Boolean(rama.grupos);
  const nombreUnidad = totalPersonas === 1 ? "integrante" : "integrantes";

  return (
    <div className={`${styles.branch} ${wide ? styles.branchWide : ""}`}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-container text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className={styles.summaryTitle}>{rama.cargo}</span>
          <span className={styles.summaryMeta}>
            {mostrarNombres ? `${totalPersonas} ${nombreUnidad}` : `${totalPersonas} cargos`}
          </span>
          <ChevronDown className={`${styles.chevron} size-4`} aria-hidden="true" />
        </summary>
        <div className={styles.content}>
          {rama.grupos ? (
            <div className={styles.groupGrid}>
              {rama.grupos.map((group) => (
                <div key={group.grupo} className={styles.group}>
                  <p className={styles.groupTitle}>{group.grupo}</p>
                  {mostrarNombres ? (
                    <div className={styles.names}>
                      {group.docentes.map((docente) => (
                        <span key={docente} className={styles.name}>
                          {docente}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-on-surface-variant">
                      {group.docentes.length}{" "}
                      {group.docentes.length === 1 ? "docente" : "docentes"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : mostrarNombres ? (
            <div className={styles.names}>
              {rama.personas?.map((persona) => (
                <span key={persona} className={styles.name}>
                  {persona}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-on-surface-variant">
              Cargo cubierto. Los nombres del personal no se muestran en esta versión pública.
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

export default function OrganigramaPage() {
  const total = matriculaTotal();
  const fechaMatricula = new Intl.DateTimeFormat("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${ORGANIGRAMA.matricula.actualizadoEn}T12:00:00`));

  return (
    <main className="flex-grow">
      <PageHero
        badge="Nuestra institución"
        title={
          <>
            Organigrama <span className="text-primary">institucional</span>
          </>
        }
        description="La estructura de trabajo que acompaña a los niños y niñas del CEI Luisa Cáceres de Arismendi."
        icon={Network}
        tone="primary"
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">
                Matrícula estudiantil
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-on-surface">{total}</p>
              <p className="text-xs font-semibold text-on-surface-variant">
                {ORGANIGRAMA.matricula.varones} varones · {ORGANIGRAMA.matricula.hembras} hembras
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">
                Año escolar
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-on-surface">
                {ORGANIGRAMA.schoolYear}
              </p>
              <p className="text-xs font-semibold text-on-surface-variant">
                Matrícula actualizada el {fechaMatricula}
              </p>
            </div>
            <div className="rounded-2xl border border-sun/40 bg-sun-container p-4 text-on-sun-container">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] opacity-80">
                Comités del Consejo Educativo
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold">
                {ORGANIGRAMA.comites.length}
              </p>
              <p className="text-xs font-semibold opacity-85">
                Participación de la comunidad educativa
              </p>
            </div>
          </div>
        </Reveal>

        {!MOSTRAR_NOMBRES && (
          <div className={styles.hiddenNote + " mt-4"}>
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Esta versión pública muestra los cargos y la estructura, sin los nombres del personal.
          </div>
        )}

        <Reveal delay={80}>
          <div className={styles.tree + " mt-8"}>
            <div className={styles.root}>
              <div className="rounded-[1.5rem] border border-primary/25 bg-gradient-to-br from-primary-container to-surface-container-lowest p-5 text-center shadow-[0_22px_44px_-34px_rgba(12,108,139,0.55)]">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-on-primary shadow-sm">
                  <School className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-primary">
                  {ORGANIGRAMA.directora.cargo}
                </p>
                <p className="font-display text-2xl font-extrabold text-on-surface">
                  {MOSTRAR_NOMBRES ? ORGANIGRAMA.directora.nombre : "Dirección del plantel"}
                </p>
                <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                  Máxima autoridad del centro educativo
                </p>
              </div>
            </div>

            <div className={styles.trunk} aria-hidden="true" />

            <div className={styles.branches}>
              {ORGANIGRAMA.ramas.map((rama) => (
                <BranchDetails key={rama.id} rama={rama} mostrarNombres={MOSTRAR_NOMBRES} />
              ))}

              <div className={`${styles.branch} ${styles.branchWide}`}>
                <details className={styles.details} open>
                  <summary className={styles.summary}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-container text-secondary">
                      <Users className="size-4" aria-hidden="true" />
                    </span>
                    <span className={styles.summaryTitle}>Matrícula estudiantil</span>
                    <span className={styles.summaryMeta}>Total {total}</span>
                    <ChevronDown className={`${styles.chevron} size-4`} aria-hidden="true" />
                  </summary>
                  <div className={styles.content}>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2">
                        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant">
                          Varones
                        </p>
                        <p className="font-display text-2xl font-extrabold text-primary">
                          {ORGANIGRAMA.matricula.varones}
                        </p>
                      </div>
                      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2">
                        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant">
                          Hembras
                        </p>
                        <p className="font-display text-2xl font-extrabold text-tertiary">
                          {ORGANIGRAMA.matricula.hembras}
                        </p>
                      </div>
                      <div className="rounded-xl border border-secondary/30 bg-secondary-container/50 px-3 py-2">
                        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container">
                          Total
                        </p>
                        <p className="font-display text-2xl font-extrabold text-on-secondary-container">
                          {total}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-[0.68rem] font-medium text-on-surface-variant">
                      El total se calcula automáticamente. Datos actualizados el {fechaMatricula}.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-outline-variant/50 bg-surface-container-lowest shadow-[0_22px_46px_-38px_rgba(31,48,56,0.4)]">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 bg-surface-container-low px-5 py-4">
              <span className="grid size-9 place-items-center rounded-xl bg-sun-container text-on-sun-container">
                <HeartHandshake className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold text-on-surface">
                  Comités del Consejo Educativo
                </h2>
                <p className="text-xs font-medium text-on-surface-variant">
                  Organización complementaria de participación y corresponsabilidad.
                </p>
              </div>
            </div>
            <ul className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
              {ORGANIGRAMA.comites.map((comite) => (
                <li
                  key={comite}
                  className="flex items-start gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary">
                    <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold leading-snug text-on-surface-variant">
                    {comite}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4 sm:flex-row sm:items-center">
            <p className="text-xs font-semibold leading-relaxed text-on-surface-variant">
              La estructura y la matrícula pueden actualizarse durante el año escolar.
            </p>
            <Link href="/contacto" className="btn btn-primary btn-sm w-full shrink-0 sm:w-auto">
              Contactar al colegio
            </Link>
          </div>
        </Reveal>

        {process.env.NODE_ENV !== "production" && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-[0.68rem] font-semibold text-on-surface-variant">
            <Info className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden="true" />
            <span>
              Datos editables en <code>data/organigrama.ts</code>. Revisa los comentarios «TODO:
              verificar» con el colegio antes de publicar nombres.
            </span>
          </div>
        )}
      </section>
    </main>
  );
}
