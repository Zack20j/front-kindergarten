"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, PenLine } from "lucide-react";

interface FirmaCanvasProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function FirmaCanvas({ value, onChange }: FirmaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastEmittedRef = useRef<string | null>(value);
  const [hasInk, setHasInk] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (value === lastEmittedRef.current) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!value) {
      lastEmittedRef.current = null;
      return;
    }

    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setHasInk(true);
    };
    image.src = value;
  }, [value]);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.strokeStyle = "#12232c";
    context.lineWidth = 2.6;
    context.lineCap = "round";
    context.lineJoin = "round";
    return context;
  };

  const pointerPosition = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const context = getContext();
    if (!context) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const { x, y } = pointerPosition(event);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 0.1, y + 0.1);
    context.stroke();
    setHasInk(true);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const context = getContext();
    if (!context) return;
    const { x, y } = pointerPosition(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const end = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    lastEmittedRef.current = dataUrl;
    onChange(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    lastEmittedRef.current = null;
    setHasInk(false);
    onChange(null);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-dashed border-outline-variant bg-white">
        <canvas
          ref={canvasRef}
          width={640}
          height={200}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          className="block h-40 w-full touch-none cursor-crosshair"
          aria-label="Lienzo para la firma del representante"
          role="img"
        />
        {!hasInk && (
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-xs font-semibold text-slate-400">
            <PenLine className="size-5" aria-hidden="true" />
            Firma aquí con el dedo o el mouse
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-medium text-on-surface-variant">
          Firma táctil opcional. También puedes dejar constancia con tu nombre y fecha.
        </p>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 px-3 py-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:border-error/40 hover:text-error"
        >
          <Eraser className="size-3.5" aria-hidden="true" />
          Limpiar
        </button>
      </div>
    </div>
  );
}
