'use client';

import estilos from './Celebracion.module.css';

const COLORES = ['#ff5a6e', '#ff9f1c', '#ffd60a', '#2ec45a', '#2f9bff', '#9b5de5'];

// Confeti. Si recibe alRepetir/alSeguir, muestra además la tarjeta de premio.
export default function Celebracion({ premio = '🌟', alRepetir, alSeguir }) {
  const conTarjeta = alRepetir || alSeguir;

  return (
    <div className={conTarjeta ? estilos.capa : estilos.soloConfeti}>
      <div className={estilos.confeti} aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => (
          <i key={i} style={{
            left: `${(i * 37) % 100}%`,
            background: COLORES[i % COLORES.length],
            animationDelay: `${(i % 10) * 0.12}s`,
            animationDuration: `${2 + (i % 5) * 0.3}s`,
          }} />
        ))}
      </div>
      {conTarjeta && (
        <div className={estilos.tarjeta} role="dialog" aria-label="¡Muy bien!">
          <div className={estilos.premio} aria-hidden="true">{premio}</div>
          <div className={estilos.estrellas} aria-hidden="true">⭐⭐⭐</div>
          <div className={estilos.botones}>
            {alRepetir && (
              <button type="button" onClick={alRepetir} aria-label="Jugar otra vez">🔁</button>
            )}
            {alSeguir && (
              <button type="button" onClick={alSeguir} aria-label="Siguiente" autoFocus>➡️</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
