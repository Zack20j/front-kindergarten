'use client';

import { useSyncExternalStore } from 'react';

const sinSuscripcion = () => () => {};

// Pinta los hijos solo en el navegador. Así podemos usar Math.random()
// sin errores de hidratación entre servidor y cliente.
export default function SoloCliente({ children }) {
  const enCliente = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  return enCliente ? children : <p aria-label="Cargando" style={{ fontSize: 64 }}>⏳</p>;
}
