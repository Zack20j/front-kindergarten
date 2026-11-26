'use client';

import { useRef, useState } from 'react';

const MARGEN = 28; // px de tolerancia alrededor de cada destino
const UMBRAL = 8; // px para distinguir un toque de un arrastre

// Arrastre con dedo, lápiz o ratón (Pointer Events).
// Los destinos se marcan con data-zona="id".
export default function useArrastrar({ alSoltar, alTocar }) {
  const [arrastre, setArrastre] = useState(null);
  const inicio = useRef(null);

  function terminar() {
    inicio.current = null;
    setArrastre(null);
  }

  function propsPieza(id) {
    return {
      onPointerDown(e) {
        if (e.button !== 0 || inicio.current) return; // un solo dedo a la vez
        e.currentTarget.setPointerCapture(e.pointerId);
        inicio.current = { id, puntero: e.pointerId, x: e.clientX, y: e.clientY, movido: false };
      },
      onPointerMove(e) {
        const s = inicio.current;
        if (!s || s.puntero !== e.pointerId) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (!s.movido && Math.hypot(dx, dy) < UMBRAL) return;
        s.movido = true;
        setArrastre({ id: s.id, dx, dy });
      },
      onPointerUp(e) {
        const s = inicio.current;
        if (!s || s.puntero !== e.pointerId) return;
        terminar();
        if (!s.movido) return alTocar(s.id);

        const raiz = e.currentTarget.closest('[data-juego]') || document;
        const zonas = [...raiz.querySelectorAll('[data-zona]')]
          .filter((zona) => {
            const r = zona.getBoundingClientRect();
            return (
              e.clientX >= r.left - MARGEN && e.clientX <= r.right + MARGEN &&
              e.clientY >= r.top - MARGEN && e.clientY <= r.bottom + MARGEN
            );
          })
          .map((zona) => zona.dataset.zona);
        if (zonas.length) alSoltar(s.id, zonas);
      },
      onPointerCancel: terminar,
      onLostPointerCapture: terminar,
      onClick(e) {
        if (e.detail === 0) alTocar(id); // teclado
      },
      style:
        arrastre?.id === id
          ? { transform: `translate(${arrastre.dx}px, ${arrastre.dy}px) scale(1.08)`, zIndex: 10, transition: 'none' }
          : undefined,
    };
  }

  return { propsPieza, arrastrando: arrastre?.id ?? null };
}
