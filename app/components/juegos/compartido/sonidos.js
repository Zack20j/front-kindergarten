'use client';

import { useSyncExternalStore } from 'react';

// Sonidos generados con Web Audio y voz del navegador: sin archivos ni librerías.
let silencio = false;
let audio = null;
const oyentes = new Set();

function suscribir(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

export function alternarSonido() {
  silencio = !silencio;
  if (silencio) window.speechSynthesis?.cancel();
  oyentes.forEach((fn) => fn());
}

export function useSilencio() {
  return useSyncExternalStore(suscribir, () => silencio, () => false);
}

function tocar(notas, duracion = 0.18) {
  if (silencio || typeof window === 'undefined') return;
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!Contexto) return;
  audio = audio || new Contexto();
  if (audio.state === 'suspended') audio.resume();

  notas.forEach((frecuencia, i) => {
    const inicio = audio.currentTime + i * 0.11;
    const oscilador = audio.createOscillator();
    const volumen = audio.createGain();
    oscilador.type = 'triangle';
    oscilador.frequency.value = frecuencia;
    volumen.gain.setValueAtTime(0.15, inicio);
    volumen.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);
    oscilador.connect(volumen).connect(audio.destination);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracion);
  });
}

export const sonidoToque = () => tocar([520], 0.1);
export const sonidoAcierto = () => tocar([523, 659, 784]);
export const sonidoCasi = () => tocar([330, 294]); // suave, nunca de "error"
export const sonidoFiesta = () => tocar([523, 659, 784, 1047, 784, 1047], 0.25);

export function decir(texto) {
  if (silencio || typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-ES';
  voz.rate = 0.85;
  voz.pitch = 1.2;
  window.speechSynthesis.speak(voz);
}
