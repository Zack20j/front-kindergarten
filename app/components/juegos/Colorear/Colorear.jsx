'use client';

import { useState } from 'react';
import MarcoJuego, { Opcion } from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import { decir, sonidoFiesta, sonidoToque } from '../compartido/sonidos';
import { PLANTILLAS } from './plantillas';
import estilos from './Colorear.module.css';

const BLANCO = '#ffffff';
const COLORES = [
  { nombre: 'rojo', valor: '#ff3b4e' },
  { nombre: 'naranja', valor: '#ff9f1c' },
  { nombre: 'amarillo', valor: '#ffd60a' },
  { nombre: 'verde', valor: '#2ec45a' },
  { nombre: 'azul', valor: '#2f9bff' },
  { nombre: 'morado', valor: '#9b5de5' },
  { nombre: 'rosa', valor: '#ff70c0' },
  { nombre: 'marrón', valor: '#9a5b34' },
];

export default function Colorear({ rutaMenu }) {
  const [id, setId] = useState(PLANTILLAS[0].id);
  const [color, setColor] = useState(COLORES[0].valor);
  // Cada dibujo guarda su propio historial para poder deshacer.
  const [historial, setHistorial] = useState({});

  const plantilla = PLANTILLAS.find((p) => p.id === id);
  const pasos = historial[id] ?? [{}];
  const pintura = pasos[pasos.length - 1];
  const completo = plantilla.zonas.every((z) => pintura[z.id] && pintura[z.id] !== BLANCO);

  function guardar(nueva) {
    setHistorial((h) => ({ ...h, [id]: [...(h[id] ?? [{}]), nueva].slice(-40) }));
  }

  function pintar(zona) {
    if ((pintura[zona] ?? BLANCO) === color) return;
    const nueva = { ...pintura, [zona]: color };
    guardar(nueva);
    const ahoraCompleto = plantilla.zonas.every((z) => nueva[z.id] && nueva[z.id] !== BLANCO);
    if (ahoraCompleto && !completo) sonidoFiesta();
    else sonidoToque();
  }

  function deshacer() {
    setHistorial((h) => ({ ...h, [id]: pasos.slice(0, -1) }));
    sonidoToque();
  }

  return (
    <MarcoJuego titulo="Colorear" icono="🎨" rutaMenu={rutaMenu}
      controles={PLANTILLAS.map((p) => (
        <Opcion key={p.id} etiqueta={`Dibujo: ${p.id}`} activa={id === p.id}
          onClick={() => setId(p.id)}>{p.icono}</Opcion>
      ))}>
      <div className={estilos.taller}>
        <svg className={estilos.lienzo} viewBox="0 0 400 400" aria-label={`Dibujo para colorear: ${id}`}>
          {plantilla.zonas.map((zona, i) => (
            <path key={zona.id} d={zona.d} fill={pintura[zona.id] ?? BLANCO}
              className={estilos.zona} role="button" tabIndex={0}
              aria-label={`Pintar parte ${i + 1}`}
              onClick={() => pintar(zona.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pintar(zona.id); }
              }} />
          ))}
          <path d={plantilla.detalles} className={estilos.detalles} />
        </svg>

        <div className={estilos.paleta} role="group" aria-label="Colores">
          {COLORES.map((c) => (
            <button key={c.valor} type="button" className={estilos.color}
              style={{ background: c.valor }} aria-label={c.nombre} aria-pressed={color === c.valor}
              onClick={() => { setColor(c.valor); decir(c.nombre); }} />
          ))}
          <button type="button" className={estilos.color} aria-label="Goma de borrar"
            aria-pressed={color === BLANCO} onClick={() => { setColor(BLANCO); sonidoToque(); }}>
            🧽
          </button>
          <button type="button" className={estilos.color} aria-label="Deshacer"
            disabled={pasos.length < 2} onClick={deshacer}>↩️</button>
          <button type="button" className={estilos.color} aria-label="Limpiar todo el dibujo"
            disabled={Object.keys(pintura).length === 0} onClick={() => guardar({})}>🗑️</button>
        </div>
      </div>

      {completo && <Celebracion key={id} />}
    </MarcoJuego>
  );
}
