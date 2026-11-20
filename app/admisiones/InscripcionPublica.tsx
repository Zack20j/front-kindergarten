"use client";

import { crearInscripcionPublica } from "@/lib/inscripciones";
import InscripcionForm from "./InscripcionForm";

export default function InscripcionPublica() {
  return <InscripcionForm onSubmit={crearInscripcionPublica} />;
}
