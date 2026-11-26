// Cada zona es una forma SVG pintable (lienzo 400 x 400).
// El orden importa: las últimas se dibujan por encima.
const circulo = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`;

export const PLANTILLAS = [
  {
    id: 'flor', icono: '🌸',
    zonas: [
      { id: 'tallo', d: 'M185 220h30v160h-30z' },
      { id: 'hoja-izq', d: 'M185 340C140 350 90 320 75 275c50-10 100 15 110 65z' },
      { id: 'hoja-der', d: 'M215 320c45 10 95-20 110-65-50-10-100 15-110 65z' },
      { id: 'petalo-1', d: circulo(200, 75, 55) },
      { id: 'petalo-2', d: circulo(285, 135, 55) },
      { id: 'petalo-3', d: circulo(252, 225, 55) },
      { id: 'petalo-4', d: circulo(148, 225, 55) },
      { id: 'petalo-5', d: circulo(115, 135, 55) },
      { id: 'centro', d: circulo(200, 155, 55) },
    ],
    detalles: 'M178 140v8M222 140v8M172 172q28 30 56 0',
  },
  {
    id: 'pez', icono: '🐠',
    zonas: [
      { id: 'cola', d: 'M290 200l90-80v160z' },
      { id: 'aleta-arriba', d: 'M130 115q50-90 130-10z' },
      { id: 'aleta-abajo', d: 'M140 285q50 90 120 5z' },
      { id: 'cuerpo', d: 'M30 200C90 70 240 70 320 200 240 330 90 330 30 200z' },
      { id: 'raya-1', d: 'M160 108q45 92 0 184l45 3q45-95 0-190z' },
      { id: 'ojo', d: circulo(100, 175, 26) },
      { id: 'burbuja-1', d: circulo(55, 75, 28) },
      { id: 'burbuja-2', d: circulo(110, 35, 20) },
    ],
    detalles: 'M96 175a6 6 0 1 0 12 0a6 6 0 1 0-12 0M52 225q22 18 45 5',
  },
  {
    id: 'casa', icono: '🏡',
    zonas: [
      { id: 'cesped', d: 'M10 330h380v60H10z' },
      { id: 'pared', d: 'M80 180h210v170H80z' },
      { id: 'chimenea', d: 'M235 70h40v90h-40z' },
      { id: 'techo', d: 'M50 190L185 55l135 135z' },
      { id: 'puerta', d: 'M160 350v-80a28 28 0 0 1 56 0v80z' },
      { id: 'ventana-1', d: 'M100 215h45v45h-45z' },
      { id: 'ventana-2', d: 'M230 215h45v45h-45z' },
      { id: 'sol', d: circulo(345, 60, 38) },
    ],
    detalles: 'M122 215v45M100 237h45M252 215v45M230 237h45M200 312v6',
  },
];
