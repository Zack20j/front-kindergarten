const MAX_DESCRIPTION_LENGTH = 220;

interface EventMessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventMessageInput({ value, onChange }: EventMessageInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-on-surface" htmlFor="event-description">
        Mensaje para las familias <span className="text-error">*</span>
      </label>
      <textarea
        id="event-description"
        value={value}
        maxLength={MAX_DESCRIPTION_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Escribe una breve explicación del evento..."
        className="w-full resize-none rounded-2xl border border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest p-4 text-[0.9375rem] leading-relaxed text-on-surface transition-colors placeholder:text-on-surface-variant focus:border-primary focus:bg-surface-container-lowest dark:focus:bg-surface-container"
      />
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Texto claro y corto, fácil de leer desde un celular.</span>
        <span className="ml-3 shrink-0 text-xs font-medium text-on-surface-variant">{value.length} / {MAX_DESCRIPTION_LENGTH}</span>
      </div>
    </div>
  );
}
