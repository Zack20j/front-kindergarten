import { Image as ImageIcon } from 'lucide-react';

interface EfemerideCardProps {
    image: string;
    day: string;
    month: string;
    title: string;
    description: string;
}

export default function EfemerideCard({ image, day, month, title, description }: EfemerideCardProps) {
    return (
        <article className="card-clay group flex h-full flex-col overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary-container/30 text-primary">
                        <ImageIcon className="size-10" aria-hidden="true" />
                    </div>
                )}

                <div className="absolute left-3 top-3 flex size-14 flex-col items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/95 text-primary shadow-[0_10px_24px_-14px_rgba(31,48,56,0.55)] backdrop-blur">
                    <span className="font-display text-xl font-extrabold leading-none">{day}</span>
                    <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]">{month}</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-extrabold leading-snug text-on-surface">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-on-surface-variant line-clamp-3">
                    {description}
                </p>
            </div>
        </article>
    );
}
