'use client';

import { useState } from 'react';
import MarcoJuego from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import SoloCliente from '../compartido/SoloCliente';
import { mezclar } from '../compartido/azar';
import { decir, sonidoCasi, sonidoFiesta } from '../compartido/sonidos';
import estilos from './Contar.module.css';

const COSAS = ['🍎', '🦆', '🎈', '🐟', '🍓', '🚗', '🐤', '🌼'];
const PALABRAS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco'];

function crearRonda(anterior) {
  const numeros = [1, 2, 3, 4, 5];
  const cantidad = mezclar(numeros.filter((n) => n !== anterior))[0];
  const otras = mezclar(numeros.filter((n) => n !== cantidad)).slice(0, 2);
  return {
    cantidad,
    cosa: mezclar(COSAS)[0],
    respuestas: [cantidad, ...otras].sort((a, b) => a - b),
  };
}

function Ronda({ cantidad, cosa, respuestas, alSeguir }) {
  const [contadas, setContadas] = useState([]); // orden en que se tocan
  const [probadas, setProbadas] = useState([]);
  const [acertado, setAcertado] = useState(false);

  function contar(i) {
    const yaEstaba = contadas.indexOf(i);
    if (yaEstaba >= 0) return decir(PALABRAS[yaEstaba + 1]);
    setContadas([...contadas, i]);
    decir(PALABRAS[contadas.length + 1]);
  }

  function responder(n) {
    if (n === cantidad) {
      setAcertado(true);
      sonidoFiesta();
      decir(`¡${PALABRAS[n]}!`);
    } else {
      setProbadas((p) => [...p, n]);
      sonidoCasi();
    }
  }

  // Tras un intento, el siguiente objeto sin contar parpadea como pista.
  const pista = probadas.length > 0
    ? [...Array(cantidad).keys()].find((i) => !contadas.includes(i))
    : undefined;

  return (
    <>
      <div className={estilos.prado}>
        {Array.from({ length: cantidad }, (_, i) => {
          const orden = contadas.indexOf(i) + 1;
          return (
            <button key={i} type="button" onClick={() => contar(i)}
              className={`${estilos.cosa} ${orden ? estilos.contada : ''} ${pista === i ? estilos.pista : ''}`}
              aria-label={orden ? `Contado: ${orden}` : 'Contar este'}>
              <span aria-hidden="true">{cosa}</span>
              {orden > 0 && <b>{orden}</b>}
            </button>
          );
        })}
      </div>

      <div className={estilos.respuestas}>
        {respuestas.map((n) => (
          <button key={n} type="button" onClick={() => responder(n)}
            className={`${estilos.respuesta} ${probadas.includes(n) ? estilos.probada : ''}`}
            aria-label={`Hay ${n}`}>
            <strong>{n}</strong>
            <span aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>
          </button>
        ))}
      </div>

      {acertado && <Celebracion premio={`${cantidad} ${cosa}`} alSeguir={alSeguir} />}
    </>
  );
}

function Rondas() {
  const [ronda, setRonda] = useState(() => ({ ...crearRonda(), numero: 0 }));
  const seguir = () => setRonda((r) => ({ ...crearRonda(r.cantidad), numero: r.numero + 1 }));
  return <Ronda key={ronda.numero} {...ronda} alSeguir={seguir} />;
}

export default function Contar({ rutaMenu }) {
  return (
    <MarcoJuego titulo="Contar del uno al cinco" icono="🖐️" rutaMenu={rutaMenu}>
      <SoloCliente><Rondas /></SoloCliente>
    </MarcoJuego>
  );
}
