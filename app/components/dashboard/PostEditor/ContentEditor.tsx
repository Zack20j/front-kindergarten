import { useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

/**
 * Inserts text at the current caret position (or replaces the selection),
 * respects maxLength, and restores focus + caret right after the inserted text.
 */
function insertAtCursor(
  textarea: HTMLTextAreaElement | null,
  value: string,
  maxLength: number,
  onChange: (value: string) => void,
  insertion: string
) {
  const start = textarea?.selectionStart ?? value.length;
  const end = textarea?.selectionEnd ?? value.length;
  const nextValue = value.slice(0, start) + insertion + value.slice(end);

  if (nextValue.length > maxLength) return;

  onChange(nextValue);

  requestAnimationFrame(() => {
    if (!textarea) return;
    const caretPosition = start + insertion.length;
    textarea.focus();
    textarea.setSelectionRange(caretPosition, caretPosition);
  });
}

export default function ContentEditor({ value, onChange, maxLength }: ContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleInsert = (text: string) => {
    insertAtCursor(textareaRef.current, value, maxLength, onChange, text);
  };

  const handleEmojiSelect = (emoji: string) => {
    handleInsert(emoji);
    setIsEmojiPickerOpen(false);
  };

  return (
    <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest dark:bg-surface-container-low p-2">
      <div className="p-6 pb-4">
        <label className="sr-only" htmlFor="post-content">
          Mensaje Principal
        </label>
        <textarea
          id="post-content"
          ref={textareaRef}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="¿Qué quieres compartir con la comunidad escolar hoy?"
          className="w-full resize-none border-none bg-transparent text-[1.0625rem] leading-relaxed text-on-surface placeholder:text-on-surface-variant"
        />
      </div>

      <div className="m-2 flex items-center justify-between rounded-full bg-surface-container-high px-4 py-3">
        <div className="flex gap-1">
          <div className="relative">
            <button
              type="button"
              title="Añadir Emoji"
              aria-haspopup="menu"
              aria-expanded={isEmojiPickerOpen}
              onClick={() => setIsEmojiPickerOpen((open) => !open)}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              <span className="material-symbols-outlined text-xl">mood</span>
            </button>
            {isEmojiPickerOpen && (
              <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setIsEmojiPickerOpen(false)} />
            )}
          </div>

          <button
            type="button"
            title="Hashtags (#)"
            onClick={() => handleInsert("#")}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <span className="material-symbols-outlined text-xl">tag</span>
          </button>

          <button
            type="button"
            title="Menciones"
            onClick={() => handleInsert("@")}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <span className="material-symbols-outlined text-xl">alternate_email</span>
          </button>
        </div>
        <span className="px-3 text-[0.875rem] font-medium text-on-surface-variant">
          {value.length} / {maxLength}
        </span>
      </div>
    </section>
  );
}
