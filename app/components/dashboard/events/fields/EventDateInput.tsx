import { formatLongDateEs } from "@/lib/date";

interface EventDateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventDateInput({ value, onChange }: EventDateInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-on-surface" htmlFor="event-date">
        Fecha <span className="text-error">*</span>
      </label>
      <input
        id="event-date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest px-4 py-3.5 font-medium text-on-surface transition-colors focus:border-primary focus:bg-surface-container-lowest dark:focus:bg-surface-container"
      />
      <p className="mt-1.5 text-xs capitalize text-on-surface-variant">{formatLongDateEs(value)}</p>
    </div>
  );
}
