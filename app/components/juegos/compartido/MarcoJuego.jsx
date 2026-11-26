'use client';

import Link from 'next/link';
import { alternarSonido, useSilencio } from './sonidos';
import './tema.css';
import estilos from './MarcoJuego.module.css';

// Marco común: botón de casa, icono del juego, sonido y zona de juego.
export default function MarcoJuego({ titulo, icono, rutaMenu = '/juegos', controles, children }) {
  const silencio = useSilencio();

  return (
    <main className={estilos.marco} data-juego>
      <header className={estilos.barra}>
        <Link href={rutaMenu} className={estilos.boton} aria-label="Volver al menú">🏠</Link>
        <h1 className={estilos.titulo}>
          <span aria-hidden="true">{icono}</span>
          <span className={estilos.oculto}>{titulo}</span>
        </h1>
        <button type="button" className={estilos.boton} onClick={alternarSonido}
          aria-label={silencio ? 'Activar sonido' : 'Quitar sonido'}>
          {silencio ? '🔇' : '🔊'}
        </button>
      </header>
      {controles && <nav className={estilos.controles} aria-label="Opciones">{controles}</nav>}
      <section className={estilos.zona}>{children}</section>
    </main>
  );
}

// Botón redondo grande para elegir nivel o dibujo.
export function Opcion({ activa, etiqueta, onClick, children }) {
  return (
    <button type="button" className={estilos.opcion} aria-pressed={activa}
      aria-label={etiqueta} onClick={onClick}>
      {children}
    </button>
  );
}
