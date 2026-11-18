import { useRef, type DragEvent } from "react";
import type { MediaItem } from "@/types/post";
import MediaThumbnail from "./MediaThumbnail";

interface MediaUploaderProps {
  media: MediaItem[];
  uploading?: boolean;
  onFilesSelected: (files: FileList) => void;
  onRemove: (id: number) => void;
}

export default function MediaUploader({ media, uploading = false, onFilesSelected, onRemove }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!uploading && e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
  };

  return (
    <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6 md:p-8 dark:bg-surface-container-low">
      <h2 className="mb-6 flex items-center gap-2 text-[1.25rem] font-bold text-on-surface">
        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
          perm_media
        </span>
        Multimedia
      </h2>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5 md:p-10"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files) {
              onFilesSelected(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-3xl">
            {uploading ? "progress_activity" : "cloud_upload"}
          </span>
        </div>
        <h3 className="mb-1 text-[1.0625rem] font-semibold text-on-surface">
          {uploading ? "Subiendo archivos…" : "Arrastra y suelta tus archivos aquí"}
        </h3>
        <p className="mb-6 text-[0.875rem] text-on-surface-variant">
          Soporta JPG, PNG, WebP y MP4 (máx. 50 MB)
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="rounded-full bg-surface-container-high px-6 py-2 text-[0.875rem] font-semibold text-on-surface transition-colors hover:bg-surface-container-highest disabled:opacity-60"
        >
          Explorar archivos
        </button>
      </div>

      <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2">
        {media.map((item) => (
          <MediaThumbnail key={item.id} item={item} onRemove={onRemove} />
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Añadir más multimedia"
          className="relative flex size-24 shrink-0 snap-start items-center justify-center overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/50 hover:text-primary"
        >
          <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
        </button>
      </div>
    </section>
  );
}
