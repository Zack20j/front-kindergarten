import Link from "next/link";

interface PublishedBannerProps {
  onDismiss: () => void;
}

/**
 * Confirms the publish actually reached the public page, with a direct
 * link to go check — without this, "Publicar" looked identical whether it
 * worked or not, which is exactly the kind of thing that erodes trust in
 * an admin tool.
 */
export default function PublishedBanner({ onDismiss }: PublishedBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-secondary/30 bg-secondary-container/50 px-5 py-4 text-on-secondary-container">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <div>
          <p className="font-bold text-sm">¡Publicado en la Cartelera!</p>
          <p className="text-xs text-on-secondary-container/80">Ya es visible para las familias.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/cartelera"
          target="_blank"
          className="rounded-full bg-secondary px-4 py-2 text-xs font-bold text-on-secondary transition-colors hover:bg-secondary-dim"
        >
          Ver en la Cartelera
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className="flex size-8 items-center justify-center rounded-full text-on-secondary-container transition-colors hover:bg-secondary/10"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
