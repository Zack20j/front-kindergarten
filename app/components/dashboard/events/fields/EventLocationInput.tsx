interface EventLocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventLocationInput({ value, onChange }: EventLocationInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-on-surface" htmlFor="event-location">
        Lugar <span className="font-normal text-on-surface-variant">(opcional)</span>
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest px-4 py-3.5 transition-colors focus-within:border-primary focus-within:bg-surface-container-lowest dark:focus-within:bg-surface-container">
        <span className="material-symbols-outlined text-xl text-primary">location_on</span>
        <input
          id="event-location"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej. Patio Central, Cancha, Auditorio"
          className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-on-surface-variant"
        />
      </div>
    </div>
  );
}
