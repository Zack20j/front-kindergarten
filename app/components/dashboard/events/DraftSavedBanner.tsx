interface DraftSavedBannerProps {
  onDismiss: () => void;
}

/**
 * Confirms the event was created as DRAFT in the backend. Different copy
 * from PublishedBanner so the admin knows it is not visible to families yet.
 */
export default function DraftSavedBanner({ onDismiss }: DraftSavedBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary-container/40 px-5 py-4 text-on-primary-container">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <div>
          <p className="font-bold text-sm">Borrador guardado</p>
          <p className="text-xs text-on-primary-container/80">Aún no es visible para las familias.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar aviso"
        className="flex size-8 items-center justify-center rounded-full text-on-primary-container transition-colors hover:bg-primary/10"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
