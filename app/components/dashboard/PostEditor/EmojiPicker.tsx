import { useEffect, useRef } from "react";
import { CONTENT_EMOJIS } from "@/data/emojis";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Selector de emojis"
      className="absolute bottom-full left-0 z-20 mb-2 grid w-64 grid-cols-6 gap-1 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-3 shadow-[0_24px_48px_-24px_rgba(31,48,56,0.35)] dark:bg-surface-container-low"
    >
      {CONTENT_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="menuitem"
          onClick={() => onSelect(emoji)}
          className="rounded-lg p-1.5 text-xl leading-none transition-colors hover:bg-surface-container-high"
          aria-label={`Insertar ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
