'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MarcoJuego, { Opcion } from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import { sonidoCasi, sonidoFiesta, sonidoToque } from '../compartido/sonidos';
import { NIVELES, trazarCamino } from './niveles';
import estilos from './Laberinto.module.css';

const FLECHAS = [
  { tecla: 'ArrowUp', icono: '⬆️', df: -1, dc: 0, nombre: 'Arriba', clase: 'arriba' },
  { tecla: 'ArrowLeft', icono: '⬅️', df: 0, dc: -1, nombre: 'Izquierda', clase: 'izquierda' },
  { tecla: 'ArrowDown', icono: '⬇️', df: 1, dc: 0, nombre: 'Abajo', clase: 'abajo' },
  { tecla: 'ArrowRight', icono: '➡️', df: 0, dc: 1, nombre: 'Derecha', clase: 'derecha' },
];

function Partida({ nivel, alRepetir, alSeguir }) {
  const { mapa, heroe, meta } = NIVELES[nivel];
  const camino = useMemo(() => trazarCamino(mapa), [mapa]);
  const [paso, setPaso] = useState(0);
  const pasoRef = useRef(0); // valor al instante para eventos muy seguidos
  const tablero = useRef(null);
  const lado = mapa.length;
  const llegado = paso === camino.length - 1;
  const posicion = camino[paso];

  function irA(nuevo) {
    if (nuevo === pasoRef.current || pasoRef.current === camino.length - 1) return;
    pasoRef.current = nuevo;
    setPaso(nuevo);
    if (nuevo === camino.length - 1) sonidoFiesta();
    else sonidoToque();
  }

  function mover({ df, dc }) {
    const { f, c } = camino[pasoRef.current];
    const nuevo = [pasoRef.current + 1, pasoRef.current - 1].find(
      (i) => camino[i]?.f === f + df && camino[i]?.c === c + dc);
    if (nuevo === undefined) sonidoCasi();
    else irA(nuevo);
  }

  // Con el dedo: el animal sigue solo a casillas cercanas (máximo 2 pasos).
  function seguirDedo(e) {
    const r = tablero.current.getBoundingClientRect();
    const c = Math.floor(((e.clientX - r.left) / r.width) * lado);
    const f = Math.floor(((e.clientY - r.top) / r.height) * lado);
    const i = camino.findIndex((p) => p.f === f && p.c === c);
    if (i >= 0 && Math.abs(i - pasoRef.current) <= 2) irA(i);
  }

  useEffect(() => {
    function alPulsar(e) {
      const flecha = FLECHAS.find((x) => x.tecla === e.key);
      if (!flecha) return;
      e.preventDefault();
      mover(flecha);
    }
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  });

  return (
    <div className={estilos.juego}>
      <div ref={tablero} className={estilos.tablero} role="img"
        aria-label="Laberinto: lleva al animal hasta su premio"
        style={{ '--lado': lado }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seguirDedo(e); }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && seguirDedo(e)}>
        {mapa.flatMap((fila, f) =>
          [...fila].map((tipo, c) => {
            const i = camino.findIndex((p) => p.f === f && p.c === c);
            return (
              <div key={`${f}-${c}`}
                className={[
                  tipo === '#' ? estilos.arbusto : estilos.camino,
                  i >= 0 && i <= paso ? estilos.pisado : '',
                  i === paso + 1 ? estilos.siguiente : '',
                ].join(' ')}>
                {tipo === '#' && '🌳'}
                {tipo === 'M' && !llegado && <span className={estilos.meta}>{meta}</span>}
                {i > paso && tipo !== 'M' && <span className={estilos.punto} />}
              </div>
            );
          }))}
        <div className={`${estilos.heroe} ${llegado ? estilos.feliz : ''}`}
          style={{ left: `${(posicion.c * 100) / lado}%`, top: `${(posicion.f * 100) / lado}%` }}>
          <span>{heroe}</span>
        </div>
      </div>

      <div className={estilos.flechas}>
        {FLECHAS.map((flecha) => (
          <button key={flecha.tecla} type="button" className={estilos[flecha.clase]}
            aria-label={flecha.nombre} onClick={() => mover(flecha)}>
            {flecha.icono}
          </button>
        ))}
      </div>

      {llegado && <Celebracion premio={`${heroe}${meta}`} alRepetir={alRepetir} alSeguir={alSeguir} />}
    </div>
  );
}

export default function Laberinto({ rutaMenu }) {
  const [nivel, setNivel] = useState(0);
  const [partida, setPartida] = useState(0);
  const repetir = () => setPartida((p) => p + 1);
  const seguir = () => { setNivel((n) => (n + 1) % NIVELES.length); repetir(); };

  return (
    <MarcoJuego titulo="Laberinto" icono="🗺️" rutaMenu={rutaMenu}
      controles={NIVELES.map((n, i) => (
        <Opcion key={n.heroe} etiqueta={`Laberinto ${i + 1}`} activa={nivel === i}
          onClick={() => setNivel(i)}>{n.heroe}</Opcion>
      ))}>
      <Partida key={`${nivel}-${partida}`} nivel={nivel} alRepetir={repetir} alSeguir={seguir} />
    </MarcoJuego>
  );
}
