'use client';

import { useState } from 'react';
import MarcoJuego, { Opcion } from '../compartido/MarcoJuego';
import Celebracion from '../compartido/Celebracion';
import SoloCliente from '../compartido/SoloCliente';
import useArrastrar from '../compartido/useArrastrar';
import { mezclar } from '../compartido/azar';
import { sonidoAcierto, sonidoCasi, sonidoFiesta, sonidoToque } from '../compartido/sonidos';
import { DIBUJOS } from './dibujos';
import estilos from './Rompecabezas.module.css';

const NIVELES = { 4: { columnas: 2, filas: 2 }, 6: { columnas: 3, filas: 2 } };

// Muestra el trozo del dibujo que corresponde a la pieza n.
function Trozo({ dibujo, n, total }) {
  const { columnas, filas } = NIVELES[total];
  const ancho = 300 / columnas;
  const alto = 200 / filas;
  const x = (n % columnas) * ancho;
  const y = Math.floor(n / columnas) * alto;
  return (
    <svg viewBox={`${x} ${y} ${ancho} ${alto}`} aria-hidden="true">
      {DIBUJOS[dibujo].contenido}
    </svg>
  );
}

function Tablero({ dibujo, total, alRepetir, alSeguir }) {
  const [orden] = useState(() => mezclar([...Array(total).keys()]));
  const [puestas, setPuestas] = useState([]);
  const [elegida, setElegida] = useState(null);
  const [casi, setCasi] = useState(null);
  const { columnas, filas } = NIVELES[total];
  const terminado = puestas.length === total;

  function colocar(pieza, zonas) {
    if (zonas.includes(String(pieza))) {
      setPuestas((p) => (p.includes(pieza) ? p : [...p, pieza]));
      setElegida(null);
      if (puestas.length + 1 === total) sonidoFiesta();
      else sonidoAcierto();
    } else {
      setElegida(pieza); // se ilumina su sitio correcto
      setCasi(pieza);
      sonidoCasi();
    }
  }

  const { propsPieza, arrastrando } = useArrastrar({
    alSoltar: colocar,
    alTocar: (pieza) => { setElegida(pieza); setCasi(null); sonidoToque(); },
  });
  const activa = arrastrando ?? elegida;

  return (
    <div className={estilos.mesa} style={{ '--columnas': columnas }}>
      <div className={estilos.tablero} style={{ gridTemplateRows: `repeat(${filas}, 1fr)` }}>
        {Array.from({ length: total }, (_, n) => {
          const puesta = puestas.includes(n);
          return (
            <button key={n} type="button" data-zona={n} disabled={puesta}
              className={`${estilos.hueco} ${puesta ? estilos.puesta : ''} ${activa === n ? estilos.guia : ''}`}
              aria-label={`Hueco ${n + 1}`}
              onClick={() => elegida !== null && colocar(elegida, [String(n)])}>
              <Trozo dibujo={dibujo} n={n} total={total} />
            </button>
          );
        })}
      </div>

      <div className={estilos.bandeja}>
        {orden.map((n) => (
          <div key={n} className={estilos.base}>
            {!puestas.includes(n) && (
              <button type="button" aria-label={`Pieza ${n + 1}`} aria-pressed={elegida === n}
                className={`${estilos.pieza} ${casi === n ? estilos.temblar : ''}`}
                onAnimationEnd={() => setCasi(null)} {...propsPieza(n)}>
                <Trozo dibujo={dibujo} n={n} total={total} />
              </button>
            )}
          </div>
        ))}
      </div>

      {terminado && <Celebracion premio={DIBUJOS[dibujo].icono} alRepetir={alRepetir} alSeguir={alSeguir} />}
    </div>
  );
}

export default function Rompecabezas({ rutaMenu }) {
  const [dibujo, setDibujo] = useState('casa');
  const [total, setTotal] = useState(4);
  const [partida, setPartida] = useState(0);
  const nombres = Object.keys(DIBUJOS);
  const repetir = () => setPartida((p) => p + 1);
  const seguir = () => {
    setDibujo(nombres[(nombres.indexOf(dibujo) + 1) % nombres.length]);
    repetir();
  };

  return (
    <MarcoJuego titulo="Rompecabezas" icono="🧩" rutaMenu={rutaMenu}
      controles={
        <>
          {nombres.map((nombre) => (
            <Opcion key={nombre} etiqueta={`Dibujo: ${nombre}`} activa={dibujo === nombre}
              onClick={() => setDibujo(nombre)}>{DIBUJOS[nombre].icono}</Opcion>
          ))}
          {[4, 6].map((n) => (
            <Opcion key={n} etiqueta={`${n} piezas`} activa={total === n}
              onClick={() => setTotal(n)}>{n}🧩</Opcion>
          ))}
        </>
      }>
      <SoloCliente>
        <Tablero key={`${dibujo}-${total}-${partida}`} dibujo={dibujo} total={total}
          alRepetir={repetir} alSeguir={seguir} />
      </SoloCliente>
    </MarcoJuego>
  );
}
