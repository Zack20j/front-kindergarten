import Link from 'next/link';
import '../compartido/tema.css';
import estilos from './MenuPrincipal.module.css';

// Para añadir un juego nuevo basta con añadir una línea aquí.
const JUEGOS = [
  { ruta: 'rompecabezas', nombre: 'Puzle', icono: '🧩', color: 'var(--kid-azul)' },
  { ruta: 'laberinto', nombre: 'Laberinto', icono: '🐶', color: 'var(--kid-verde)' },
  { ruta: 'colorear', nombre: 'Colorear', icono: '🎨', color: 'var(--kid-rosa)' },
  { ruta: 'memoria', nombre: 'Memoria', icono: '🃏', color: 'var(--kid-morado)' },
  { ruta: 'contar', nombre: 'Contar', icono: '🖐️', color: 'var(--kid-naranja)' },
  { ruta: 'formas', nombre: 'Formas', icono: '⭐', color: 'var(--kid-rojo)' },
];

// No necesita 'use client': son solo enlaces.
export default function MenuPrincipal({ base = '/juegos' }) {
  return (
    <main className={estilos.menu}>
      <h1 className={estilos.titulo}><span aria-hidden="true">🌈</span> ¡A jugar! <span aria-hidden="true">🎈</span></h1>
      <ul className={estilos.rejilla}>
        {JUEGOS.map((juego, i) => (
          <li key={juego.ruta}>
            <Link href={`${base}/${juego.ruta}`} className={estilos.tarjeta}
              style={{ '--color': juego.color, '--retraso': `${i * 0.2}s` }}>
              <span className={estilos.icono} aria-hidden="true">{juego.icono}</span>
              <span className={estilos.nombre}>{juego.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
