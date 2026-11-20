import type { Metadata } from "next";
import DetalleInscripcion from "@/app/components/dashboard/DetalleInscripcion";

export const metadata: Metadata = {
  title: "Detalle de inscripción - Panel - UEC Luisa Cáceres",
};

export default async function DetalleInscripcionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetalleInscripcion id={id} />;
}
