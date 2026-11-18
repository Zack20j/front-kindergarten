interface BottomActionBarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  publishing?: boolean;
  savingDraft?: boolean;
  sidebarCollapsed: boolean;
}

export default function BottomActionBar({
  onSaveDraft,
  onPublish,
  publishing = false,
  savingDraft = false,
  sidebarCollapsed,
}: BottomActionBarProps) {
  return (
    <div
      className={[
        "fixed bottom-0 right-0 left-0 z-30 border-t border-outline-variant/50 bg-surface-container-lowest/90 p-4 px-4 backdrop-blur-xl dark:bg-surface-container-low/90 md:px-8",
        "transition-[left] duration-300 ease-in-out",
        sidebarCollapsed ? "md:left-20" : "md:left-72",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 md:gap-4">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={savingDraft || publishing}
          className="rounded-full px-4 py-3 text-[0.875rem] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-60 md:px-6"
        >
          {savingDraft ? "Guardando…" : "Guardar borrador"}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing || savingDraft}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[0.875rem] font-bold text-on-primary shadow-sm transition-colors hover:bg-primary-dim active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:px-8"
        >
          <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          {publishing ? "Publicando…" : "Publicar ahora"}
        </button>
      </div>
    </div>
  );
}
