import { useRef } from "react";
import { HELP_TOPICS, SUPPORT_EMAIL } from "@/data/helpTopics";
import { useClickOutside } from "@/hooks/useClickOutside";

interface HelpPanelProps {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, onClose);

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Ayuda"
      className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-[0_24px_48px_-24px_rgba(31,48,56,0.35)] dark:bg-surface-container-low"
    >
      <h3 className="mb-4 text-base font-bold text-on-surface">
        ¿Cómo funciona esta pantalla?
      </h3>

      <ul className="space-y-4">
        {HELP_TOPICS.map((topic) => (
          <li key={topic.title} className="flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary">{topic.icon}</span>
            <div>
              <p className="text-[0.875rem] font-semibold text-on-surface">{topic.title}</p>
              <p className="text-[0.8125rem] leading-snug text-on-surface-variant">
                {topic.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-low py-2.5 text-[0.8125rem] font-semibold text-primary transition-colors hover:bg-surface-container-high"
      >
        <span className="material-symbols-outlined text-[18px]">mail</span>
        Contactar soporte
      </a>
    </div>
  );
}
