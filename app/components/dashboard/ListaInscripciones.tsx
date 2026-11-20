"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { eliminarInscripcion, listarInscripciones } from "@/lib/inscripciones";
import { anioEscolarActual, generarAniosEscolares, GRUPO_OPCIONES, TURNO_OPCIONES } from "@/data/inscripcion";
import { formatearFecha } from "@/lib/venezuela";
import type { InscripcionListResponse, InscripcionResumenApi } from "@/types/inscripcion";

const PAGE_SIZE = 15;

interface Filtros {
  year: string;
  group: string;
  query: string;
}

function label(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function iniciales(nombre: string): string {
  const parts = nombre.replace(",", "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function ListaInscripciones() {
  const [filters, setFilters] = useState<Filtros>({
    year: anioEscolarActual(),
    group: "",
    query: "",
  });
  const [applied, setApplied] = useState<Filtros>(filters);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<InscripcionListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [anios] = useState(() => generarAniosEscolares());

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listarInscripciones({
        schoolYear: applied.year || undefined,
        group: applied.group || undefined,
        query: applied.query || undefined,
        page,
        size: PAGE_SIZE,
      });
      setData(response);
    } catch (loadError) {
      if (loadError instanceof ApiError) {
        setForbidden(loadError.status === 403);
        setError(loadError.message);
      } else {
        setError("No se pudieron cargar las inscripciones.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [applied, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    setApplied(filters);
  };

  const remove = async (inscripcion: InscripcionResumenApi) => {
    if (
      !window.confirm(
        `¿Eliminar la inscripción de ${inscripcion.studentFullName}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setBusyId(inscripcion.id);
    setError(null);
    try {
      await eliminarInscripcion(inscripcion.id);
      await load();
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "No se pudo eliminar la inscripción.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Administración
          </p>
          <h1 className="font-display text-[2rem] font-extrabold tracking-tight text-on-surface">
            Inscripciones
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            Consulta, edita y descarga las planillas registradas. Solo la dirección tiene acceso a
            estos datos.
          </p>
        </div>
        <Link href="/admisiones" className="btn btn-primary btn-sm">
          <Plus className="size-4" aria-hidden="true" />
          Nueva inscripción
        </Link>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-5 grid gap-2.5 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-3 sm:grid-cols-2 lg:grid-cols-[9rem_10rem_1fr_auto]"
      >
        <label className="block">
          <span className="mb-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
            Año escolar
          </span>
          <select
            value={filters.year}
            onChange={(event) => setFilters((previous) => ({ ...previous, year: event.target.value }))}
            className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-3 py-2.5 text-sm font-semibold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todos</option>
            {anios.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
            Grupo
          </span>
          <select
            value={filters.group}
            onChange={(event) => setFilters((previous) => ({ ...previous, group: event.target.value }))}
            className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-3 py-2.5 text-sm font-semibold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todos</option>
            {GRUPO_OPCIONES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
            Buscar alumno
          </span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
              aria-hidden="true"
            />
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters((previous) => ({ ...previous, query: event.target.value }))
              }
              placeholder="Nombre, apellido o registro escolar"
              className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest py-2.5 pl-9 pr-3 text-sm font-semibold text-on-surface placeholder:font-normal placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn btn-primary btn-sm w-full lg:w-auto">
            <Search className="size-4" aria-hidden="true" />
            Buscar
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-2xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm font-semibold text-on-error-container"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-error" aria-hidden="true" />
          <div>
            <p>{error}</p>
            {forbidden && (
              <p className="mt-1 text-xs font-medium">
                Inicia sesión con una cuenta ADMIN para consultar las planillas.
              </p>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-6 py-16 text-on-surface-variant">
          <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm font-semibold">Cargando inscripciones…</p>
        </div>
      ) : data && data.content.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-container text-primary">
            <ClipboardList className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl font-extrabold text-on-surface">
            No hay inscripciones con estos filtros
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-on-surface-variant">
            Prueba con otro año escolar, otro grupo o crea una nueva inscripción desde la planilla
            digital.
          </p>
          <Link href="/admisiones" className="btn btn-primary btn-sm mt-5">
            <Plus className="size-4" aria-hidden="true" />
            Nueva inscripción
          </Link>
        </div>
      ) : data ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-surface-container-low text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Alumno</th>
                    <th className="px-4 py-3">Grupo / turno</th>
                    <th className="px-4 py-3">Representante</th>
                    <th className="px-4 py-3">Inscripción</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((inscripcion) => (
                    <tr
                      key={inscripcion.id}
                      className="border-t border-outline-variant/40 transition-colors hover:bg-surface-container-low/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-container text-xs font-extrabold text-primary">
                            {inscripcion.hasPhoto ? (
                              <Users className="size-4" aria-hidden="true" />
                            ) : (
                              iniciales(inscripcion.studentFullName)
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-on-surface">
                              {inscripcion.studentFullName}
                            </p>
                            <p className="text-xs font-medium text-on-surface-variant">
                              Nacimiento: {formatearFecha(inscripcion.studentBirthDate)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-on-surface">
                          {label(GRUPO_OPCIONES, inscripcion.groupName)}
                        </p>
                        <p className="text-xs font-medium text-on-surface-variant">
                          {label(TURNO_OPCIONES, inscripcion.shift)} · {inscripcion.schoolYear}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-on-surface">
                          {inscripcion.motherName ?? "—"}
                        </p>
                        {inscripcion.fatherName && (
                          <p className="text-xs font-medium text-on-surface-variant">
                            {inscripcion.fatherName}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-on-surface">
                          {formatearFecha(inscripcion.enrollmentDate)}
                        </p>
                        <p className="text-xs font-medium text-on-surface-variant">
                          Folio N° {inscripcion.id}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/dashboard/inscripciones/${inscripcion.id}`}
                            className="grid size-9 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label={`Ver inscripción de ${inscripcion.studentFullName}`}
                            title="Ver detalle"
                          >
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/dashboard/inscripciones/${inscripcion.id}/editar`}
                            className="grid size-9 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label={`Editar inscripción de ${inscripcion.studentFullName}`}
                            title="Editar"
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            disabled={busyId === inscripcion.id}
                            onClick={() => void remove(inscripcion)}
                            className="grid size-9 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:border-error/40 hover:text-error disabled:opacity-50"
                            aria-label={`Eliminar inscripción de ${inscripcion.studentFullName}`}
                            title="Eliminar"
                          >
                            {busyId === inscripcion.id ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="size-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2.5 p-3 md:hidden">
              {data.content.map((inscripcion) => (
                <article
                  key={inscripcion.id}
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-on-surface">
                        {inscripcion.studentFullName}
                      </p>
                      <p className="text-xs font-medium text-on-surface-variant">
                        {label(GRUPO_OPCIONES, inscripcion.groupName)} ·{" "}
                        {label(TURNO_OPCIONES, inscripcion.shift)}
                      </p>
                      <p className="text-xs font-medium text-on-surface-variant">
                        {inscripcion.schoolYear} · {formatearFecha(inscripcion.enrollmentDate)}
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[0.6rem] font-extrabold text-on-surface-variant">
                      N° {inscripcion.id}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-on-surface-variant">
                    Representante: {inscripcion.motherName ?? inscripcion.fatherName ?? "—"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/dashboard/inscripciones/${inscripcion.id}`}
                      className="btn btn-ghost btn-sm flex-1"
                    >
                      <Eye className="size-4" aria-hidden="true" />
                      Ver
                    </Link>
                    <Link
                      href={`/dashboard/inscripciones/${inscripcion.id}/editar`}
                      className="btn btn-ghost btn-sm flex-1"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === inscripcion.id}
                      onClick={() => void remove(inscripcion)}
                      className="grid size-11 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:border-error/40 hover:text-error disabled:opacity-50"
                      aria-label={`Eliminar inscripción de ${inscripcion.studentFullName}`}
                    >
                      {busyId === inscripcion.id ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-on-surface-variant">
            <p>
              {data.totalElements} inscripción{data.totalElements === 1 ? "" : "es"} · página{" "}
              {data.totalPages === 0 ? 0 : data.page + 1} de {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={data.page === 0}
                onClick={() => setPage((previous) => Math.max(0, previous - 1))}
                className="inline-flex items-center gap-1 rounded-full border border-outline-variant/50 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </button>
              <button
                type="button"
                disabled={data.last}
                onClick={() => setPage((previous) => previous + 1)}
                className="inline-flex items-center gap-1 rounded-full border border-outline-variant/50 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
