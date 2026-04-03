import type { ContactInfo } from "./landingData";
import { Mail, MapPin } from "lucide-react";

type FooterProps = {
  contact: ContactInfo;
};

export default function Footer({ contact }: FooterProps) {
  return (
    <footer id="contacto" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Contacto</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Estamos listos para recibir a tus pequeños.</h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Visítanos o escríbenos para conocer el proceso de inscripción y nuestras próximas jornadas abiertas.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-[#f9fafb] p-6 shadow-sm shadow-slate-200/50">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Dirección</p>
              <p className="mt-4 text-base font-semibold text-slate-950">{contact.address}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">San Cristóbal, Táchira</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-[#f9fafb] p-6 shadow-sm shadow-slate-200/50">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700/70">Redes</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500" />
                  {contact.email}
                </p>
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  {contact.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
          © 2026 U.E.C. Luisa Cáceres de Arismendi. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
