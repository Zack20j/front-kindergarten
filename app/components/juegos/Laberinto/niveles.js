// A = salida, M = meta, . = camino, # = arbusto
// El camino debe ser UNO solo, sin bifurcaciones.
export const NIVELES = [
  { heroe: '🐶', meta: '🦴', mapa: ['A..##', '##.##', '##...', '####.', '####M'] },
  { heroe: '🐰', meta: '🥕', mapa: ['A....', '####.', '.....', '.####', '....M'] },
  { heroe: '🐝', meta: '🌻', mapa: ['A#...', '.#.#.', '.#.#.', '.#.#.', '...#M'] },
];

// Convierte el mapa en la lista ordenada de casillas desde A hasta M.
export function trazarCamino(mapa) {
  let actual;
  mapa.forEach((fila, f) => {
    const c = fila.indexOf('A');
    if (c >= 0) actual = { f, c };
  });

  const camino = [actual];
  let anterior = null;
  while (mapa[actual.f][actual.c] !== 'M') {
    const siguiente = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      .map(([df, dc]) => ({ f: actual.f + df, c: actual.c + dc }))
      .find(({ f, c }) =>
        mapa[f]?.[c] && mapa[f][c] !== '#' && !(anterior && anterior.f === f && anterior.c === c));
    if (!siguiente) break;
    anterior = actual;
    actual = siguiente;
    camino.push(actual);
  }
  return camino;
}
