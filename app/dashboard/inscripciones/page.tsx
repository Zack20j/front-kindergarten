import type { Metadata } from "next";
import ListaInscripciones from "@/app/components/dashboard/ListaInscripciones";

export const metadata: Metadata = {
  title: "Inscripciones - Panel - UEC Luisa Cáceres",
};

export default function InscripcionesPage() {
  return <ListaInscripciones />;
}
