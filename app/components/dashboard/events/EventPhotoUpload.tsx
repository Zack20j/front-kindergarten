import { useRef, type DragEvent } from "react";

interface EventPhotoUploadProps {
  image: { url: string; alt: string } | null;
  uploading?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export default function EventPhotoUpload({ image, uploading = false, onSelect, onRemove }: EventPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) onSelect(file);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-on-surface">
        Fotografía <span className="text-error">*</span>
      </label>

      {uploading ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-surface-container-low text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>
          <p className="text-sm font-semibold">Subiendo fotografía…</p>
        </div>
      ) : image ? (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-surface-container">
          <img src={image.url} alt={image.alt} className="size-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex size-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface backdrop-blur-md transition-colors hover:text-primary"
              aria-label="Cambiar fotografía"
            >
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex size-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface backdrop-blur-md transition-colors hover:text-error"
              aria-label="Quitar fotografía"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 p-8 text-center transition-colors hover:bg-primary/5"
        >
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
          </div>
          <p className="text-sm font-semibold text-on-surface">Arrastra una foto o haz clic para elegirla</p>
          <p className="mt-1 text-xs text-on-surface-variant">JPG, PNG o WebP, máx. 50 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
