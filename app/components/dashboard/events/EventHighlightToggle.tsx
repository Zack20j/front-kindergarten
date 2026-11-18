interface EventHighlightToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function EventHighlightToggle({ checked, onChange }: EventHighlightToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-high p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <span className="material-symbols-outlined text-xl">campaign</span>
        </div>
        <div>
          <span className="block text-sm font-bold text-on-surface">Aviso urgente</span>
          <span className="text-xs text-on-surface-variant">Mostrarlo también arriba de toda la cartelera pública</span>
        </div>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" type="checkbox" />
        <div className="peer h-6 w-12 rounded-full bg-surface-variant after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-primary/70" />
      </label>
    </div>
  );
}
