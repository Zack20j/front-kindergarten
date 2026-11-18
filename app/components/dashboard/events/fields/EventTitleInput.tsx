interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventTitleInput({ value, onChange }: EventTitleInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-on-surface" htmlFor="event-title">
        Título <span className="text-error">*</span>
      </label>
      <input
        id="event-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. Día Mundial de la Tierra"
        className="w-full rounded-2xl border border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest px-4 py-3.5 text-lg font-bold text-on-surface transition-colors placeholder:font-normal placeholder:text-on-surface-variant focus:border-primary focus:bg-surface-container-lowest dark:focus:bg-surface-container"
      />
    </div>
  );
}
