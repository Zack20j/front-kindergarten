import type { MediaItem } from "@/types/post";

interface MediaThumbnailProps {
  item: MediaItem;
  onRemove: (id: number) => void;
}

export default function MediaThumbnail({ item, onRemove }: MediaThumbnailProps) {
  return (
    <div className="relative size-24 shrink-0 snap-start overflow-hidden rounded-2xl border border-outline-variant">
      <img className="size-full object-cover" src={item.url} alt={item.alt} />
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label="Quitar imagen"
        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface backdrop-blur-md transition-colors hover:text-error"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
}
