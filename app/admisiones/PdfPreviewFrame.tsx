'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const SHEET_WIDTH_PX = 794;

export default function PdfPreviewFrame({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [frameHeight, setFrameHeight] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;

    const update = () => {
      const nextScale = Math.min(1, Math.max(0.2, frame.clientWidth / SHEET_WIDTH_PX));
      setScale(nextScale);
      setFrameHeight(sheet.scrollHeight * nextScale);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(sheet);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full">
      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{ height: frameHeight > 0 ? `${frameHeight}px` : undefined }}
      >
        <div
          ref={sheetRef}
          className="absolute left-1/2 top-0 w-[210mm] origin-top"
          style={{ transform: `translateX(-50%) scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
