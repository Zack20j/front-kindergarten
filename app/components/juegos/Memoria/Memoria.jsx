'use client';

import { useEffect, useState } from 'react';
import MarcoJuego, { Opcion } from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import SoloCliente from '../compartido/SoloCliente';
import { mezclar } from '../compartido/azar';
import { decir, sonidoAcierto, sonidoFiesta, sonidoToque } from '../compartido/sonidos';
import estilos from './Memoria.module.css';

const ANIMALES = [
  { icono: '🐶', nombre: 'perro', color: '#ffd166' },
  { icono: '🐸', nombre: 'rana', color: '#a8ee8f' },
  { icono: '🐷', nombre: 'cerdito', color: '#ffb3d9' },
  { icono: '🐳', nombre: 'ballena', color: '#a5dcff' },
  { icono: '🦁', nombre: 'león', color: '#ffb87a' },
  { icono: '🐙', nombre: 'pulpo', color: '#d6b8ff' },
  { icono: '🐞', nombre: 'mariquita', color: '#ff9aa5' },
  { icono: '🐼', nombre: 'panda', color: '#e4e8f0' },
];

const TIEMPO_VISTAZO = 2500; // ver todas las cartas al empezar
const TIEMPO_ERROR = 1400; // antes de volver a taparlas

function crearCartas(parejas) {
  const elegidos = mezclar(ANIMALES).slice(0, parejas);
  return mezclar([...elegidos, ...elegidos]);
}

function Partida({ parejas, alRepetir }) {
  const [cartas] = useState(() => crearCartas(parejas));
  const [vistazo, setVistazo] = useState(true);
  const [abiertas, setAbiertas] = useState([]);
  const [halladas, setHalladas] = useState([]);
  const terminado = halladas.length === cartas.length;

  useEffect(() => {
    const t = setTimeout(() => setVistazo(false), TIEMPO_VISTAZO);
    return () => clearTimeout(t);
  }, []);

  // Si hay dos cartas distintas abiertas, se tapan solas.
  useEffect(() => {
    if (abiertas.length < 2) return;
    const t = setTimeout(() => setAbiertas([]), TIEMPO_ERROR);
    return () => clearTimeout(t);
  }, [abiertas]);

  function voltear(i) {
    if (vistazo || abiertas.length === 2 || abiertas.includes(i) || halladas.includes(i)) return;
    decir(cartas[i].nombre);
    const primera = abiertas[0];
    if (primera !== undefined && cartas[primera].icono === cartas[i].icono) {
      setHalladas([...halladas, primera, i]);
      setAbiertas([]);
      if (halladas.length + 2 === cartas.length) sonidoFiesta();
      else sonidoAcierto();
    } else {
      setAbiertas([...abiertas, i]);
      sonidoToque();
    }
  }

  return (
    <>
      <div className={`${estilos.mesa} ${parejas === 4 ? estilos.ocho : ''}`}>
        {cartas.map((carta, i) => {
          const visible = vistazo || abiertas.includes(i) || halladas.includes(i);
          return (
            <button key={i} type="button" onClick={() => voltear(i)}
              className={`${estilos.carta} ${visible ? estilos.visible : ''} ${halladas.includes(i) ? estilos.hallada : ''}`}
              aria-label={visible ? carta.nombre : `Carta ${i + 1} tapada`}>
              <span className={estilos.interior}>
                <span className={estilos.dorso} aria-hidden="true">⭐</span>
                <span className={estilos.frente} style={{ background: carta.color }} aria-hidden="true">
                  {carta.icono}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {terminado && <Celebracion premio="🏆" alRepetir={alRepetir} />}
    </>
  );
}

export default function Memoria({ rutaMenu }) {
  const [parejas, setParejas] = useState(3);
  const [partida, setPartida] = useState(0);

  return (
    <MarcoJuego titulo="Memoria" icono="🃏" rutaMenu={rutaMenu}
      controles={[3, 4].map((n) => (
        <Opcion key={n} etiqueta={`${n} parejas`} activa={parejas === n}
          onClick={() => setParejas(n)}>{n * 2}🃏</Opcion>
      ))}>
      <SoloCliente>
        <Partida key={`${parejas}-${partida}`} parejas={parejas}
          alRepetir={() => setPartida((p) => p + 1)} />
      </SoloCliente>
    </MarcoJuego>
  );
}
