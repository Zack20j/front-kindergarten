import type { Metadata } from "next";
import Link from "next/link";
import {
  Bus,
  ClipboardCheck,
  Clock,
  Info,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import LocationMap from "../components/contact/LocationMap";
import { GOOGLE_MAPS_EMBED, UBICACION_COLEGIO } from "@/data/ubicacion";

export const metadata: Metadata = {
  title: "Ubicación - UEC Luisa Cáceres de Arismendi",
  description:
    "Mapa de Google Maps y dirección del Centro de Educación Inicial Luisa Cáceres de Arismendi en Puerto Ordaz.",
};

export default function UbicacionPage() {
  const googleHref = `https://www.google.com/maps/dir/?api=1&destination=${UBICACION_COLEGIO.lat},${UBICACION_COLEGIO.lng}`;

  return (
    <main className="flex-grow">
      <PageHero
        badge="Cómo llegar"
        title={
          <>
            Nuestra <span className="text-primary">ubicación</span>
          </>
        }
        description="Estamos en la Urbanización Villa Asia, UD-236, cerca del Estadio Los Criollitos y de la UNEXPO. Consulta el mapa y la ruta."
        icon={MapPin}
        tone="tertiary"
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <Reveal variant="left" className="lg:col-span-8">
            <div className="space-y-3">
              <div>
                <h2 className="font-display text-xl font-extrabold text-on-surface sm:text-2xl">
                  Ubicación en Google Maps
                </h2>
                <p className="mt-1 text-sm font-medium leading-relaxed text-on-surface-variant">
                  Abre el mapa para explorar el sector, trazar la ruta o iniciar la
                  navegación desde tu teléfono.
                </p>
              </div>

              <LocationMap
                embedSrc={GOOGLE_MAPS_EMBED}
                title="Ubicación del plantel"
                mapsHref={googleHref}
              />
            </div>
          </Reveal>

          <Reveal variant="right" delay={100} className="lg:col-span-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-outline-variant/50 bg-surface-container-lowest shadow-[0_22px_46px_-38px_rgba(31,48,56,0.45)]">
                <div className="border-b border-outline-variant/40 bg-surface-container-low px-5 py-4">
                  <p className="flex items-center gap-2 font-display text-base font-extrabold text-on-surface">
                    <span className="grid size-9 place-items-center rounded-xl bg-tertiary-container text-tertiary">
                      <MapPin className="size-4" aria-hidden="true" />
                    </span>
                    Dirección del plantel
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-sm font-bold leading-relaxed text-on-surface">
                    {UBICACION_COLEGIO.direccion}
                  </p>
                  <p className="flex items-start gap-2 text-xs font-medium leading-relaxed text-on-surface-variant">
                    <Bus className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden="true" />
                    {UBICACION_COLEGIO.referencia}
                  </p>
                  <div className="space-y-2 border-t border-outline-variant/40 pt-3">
                    <a
                      href={`tel:${UBICACION_COLEGIO.telefono.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
                    >
                      <Phone className="size-3.5 text-primary" aria-hidden="true" />
                      {UBICACION_COLEGIO.telefono}
                    </a>
                    <a
                      href={`mailto:${UBICACION_COLEGIO.correo}`}
                      className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
                    >
                      <Mail className="size-3.5 text-primary" aria-hidden="true" />
                      {UBICACION_COLEGIO.correo}
                    </a>
                    <p className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                      <Clock className="size-3.5 text-primary" aria-hidden="true" />
                      {UBICACION_COLEGIO.horario}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      href={googleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm w-full"
                    >
                      <Navigation className="size-4" aria-hidden="true" />
                      Cómo llegar
                    </a>
                    <Link href="/admisiones" className="btn btn-ghost btn-sm w-full">
                      <ClipboardCheck className="size-4" aria-hidden="true" />
                      Ir a la inscripción
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-sun/40 bg-sun-container p-4 text-on-sun-container">
                <p className="flex items-start gap-2 text-xs font-semibold leading-relaxed">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Las coordenadas del mapa son una referencia. Confirma la ubicación exacta con la
                  dirección del plantel.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-low p-4">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant">
                  Referencias cercanas
                </p>
                <ul className="mt-2 space-y-1.5 text-xs font-semibold text-on-surface-variant">
                  <li>· Estadio Los Criollitos</li>
                  <li>· UNEXPO · Politécnico Exp. Ciudad Guayana</li>
                  <li>· Urbanización Mediterráneo y Villa Africana</li>
                  <li>· UD-236, UD-237, UD-238, UD-241 y UD-258</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
