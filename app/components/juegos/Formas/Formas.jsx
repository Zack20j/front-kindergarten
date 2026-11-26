'use client';

import { useState } from 'react';
import MarcoJuego from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import SoloCliente from '../compartido/SoloCliente';
import useArrastrar from '../compartido/useArrastrar';
import { mezclar } from '../compartido/azar';
import { decir, sonidoAcierto, sonidoCasi, sonidoFiesta } from '../compartido/sonidos';
import estilos from './Formas.module.css';

const FORMAS = [
  { id: 'circulo', nombre: 'círculo', color: '#ff3b4e', d: 'M50 8a42 42 0 1 1 0 84 42 42 0 1 1 0-84z' },
  { id: 'cuadrado', nombre: 'cuadrado', color: '#2f9bff', d: 'M12 12h76v76H12z' },
  { id: 'triangulo', nombre: 'triángulo', color: '#2ec45a', d: 'M50 9l43 79H7z' },
  { id: 'estrella', nombre: 'estrella', color: '#ffd60a', d: 'M50 5l12 30 33 3-25 22 8 33-28-18-28 18 8-33L5 38l33-3z' },
  { id: 'corazon', nombre: 'corazón', color: '#ff70c0', d: 'M50 90C-20 45 20-12 50 24 80-12 120 45 50 90z' },
  { id: 'rombo', nombre: 'rombo', color: '#9b5de5', d: 'M50 5l38 45-38 45-38-45z' },
];

const CANTIDAD = 4; // formas por ronda (máximo 6)

function crearRonda() {
  const elegidas = mezclar(FORMAS).slice(0, CANTIDAD);
  return { huecos: elegidas, piezas: mezclar(elegidas) };
}

function Dibujo({ forma, hueco }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d={forma.d}
        fill={forma.color} fillOpacity={hueco ? 0.22 : 1}
        stroke={hueco ? forma.color : '#2b2350'} strokeWidth="4" strokeLinejoin="round"
        strokeDasharray={hueco ? '8 5' : undefined} />
    </svg>
  );
}

function Ronda({ alSeguir }) {
  const [{ huecos, piezas }] = useState(crearRonda);
  const [puestas, setPuestas] = useState([]);
  const [elegida, setElegida] = useState(null);
  const [casi, setCasi] = useState(null);

  function colocar(id, zonas) {
    if (zonas.includes(id)) {
      if (puestas.includes(id)) return;
      setPuestas([...puestas, id]);
      setElegida(null);
      decir(FORMAS.find((f) => f.id === id).nombre);
      if (puestas.length + 1 === CANTIDAD) sonidoFiesta();
      else sonidoAcierto();
    } else {
      setElegida(id);
      setCasi(id);
      sonidoCasi();
    }
  }

  const { propsPieza, arrastrando } = useArrastrar({
    alSoltar: colocar,
    alTocar: (id) => {
      setElegida(id);
      setCasi(null);
      decir(FORMAS.find((f) => f.id === id).nombre);
    },
  });
  const activa = arrastrando ?? elegida;

  return (
    <>
      <div className={estilos.fila}>
        {huecos.map((forma) => {
          const puesta = puestas.includes(forma.id);
          return (
            <button key={forma.id} type="button" data-zona={forma.id} disabled={puesta}
              className={`${estilos.hueco} ${activa === forma.id ? estilos.guia : ''} ${puesta ? estilos.puesta : ''}`}
              aria-label={`Hueco ${forma.nombre}`}
              onClick={() => elegida && colocar(elegida, [forma.id])}>
              <Dibujo forma={forma} hueco={!puesta} />
            </button>
          );
        })}
      </div>

      <div className={estilos.fila}>
        {piezas.map((forma) => (
          <div key={forma.id} className={estilos.base}>
            {!puestas.includes(forma.id) && (
              <button type="button" aria-label={forma.nombre} aria-pressed={elegida === forma.id}
                className={`${estilos.pieza} ${casi === forma.id ? estilos.temblar : ''}`}
                onAnimationEnd={() => setCasi(null)} {...propsPieza(forma.id)}>
                <Dibujo forma={forma} />
              </button>
            )}
          </div>
        ))}
      </div>

      {puestas.length === CANTIDAD && <Celebracion premio="🎉" alSeguir={alSeguir} />}
    </>
  );
}

export default function Formas({ rutaMenu }) {
  const [ronda, setRonda] = useState(0);
  return (
    <MarcoJuego titulo="Formas y colores" icono="🔺" rutaMenu={rutaMenu}>
      <SoloCliente>
        <Ronda key={ronda} alSeguir={() => setRonda((r) => r + 1)} />
      </SoloCliente>
    </MarcoJuego>
  );
}
