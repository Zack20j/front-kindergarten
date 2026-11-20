import type { Metadata } from "next";
import EditarInscripcion from "@/app/components/dashboard/EditarInscripcion";

export const metadata: Metadata = {
  title: "Editar inscripción - Panel - UEC Luisa Cáceres",
};

export default async function EditarInscripcionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditarInscripcion id={id} />;
}
