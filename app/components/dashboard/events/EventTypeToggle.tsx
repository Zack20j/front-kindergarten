import type { EventKind } from "@/types/event";

interface EventTypeOption {
  kind: EventKind;
  title: string;
  description: string;
  icon: string;
}

const OPTIONS: EventTypeOption[] = [
  { kind: "calendar", title: "Evento de Calendario", description: "Reuniones, exámenes o feriados. Solo fecha y título.", icon: "calendar_month" },
  { kind: "ephemeris", title: "Efeméride", description: "Celebraciones y actos con foto y mensaje.", icon: "star" },
];

interface EventTypeToggleProps {
  value: EventKind;
  onChange: (kind: EventKind) => void;
}

/**
 * The one decision that determines which fields show up below
 * (EventComposer renders fewer fields for "calendar" than "ephemeris").
 * Kept as big, self-explanatory cards instead of the original's
 * radio + badge + "Seleccionado" pill combo.
 */
export default function EventTypeToggle({ value, onChange }: EventTypeToggleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {OPTIONS.map((option) => {
        const isActive = option.kind === value;
        return (
          <button
            key={option.kind}
            type="button"
            onClick={() => onChange(option.kind)}
            className={[
              "flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-colors",
              isActive
                ? "border-primary bg-primary/5"
                : "border-transparent bg-surface-container-high hover:bg-surface-container-highest",
            ].join(" ")}
          >
            <div
              className={[
                "flex size-12 shrink-0 items-center justify-center rounded-full",
                isActive ? "bg-primary text-on-primary" : "bg-surface-variant text-on-surface-variant",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {option.icon}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">{option.title}</h3>
              <p className="mt-0.5 text-sm text-on-surface-variant">{option.description}</p>
            </div>
            <span className="material-symbols-outlined ml-auto shrink-0 text-xl" style={{ color: isActive ? "var(--primary)" : "var(--outline)" }}>
              {isActive ? "check_circle" : "radio_button_unchecked"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
