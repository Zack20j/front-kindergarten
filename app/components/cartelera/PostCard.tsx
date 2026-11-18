import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { formatDateEs } from "@/lib/date";
import type { PostApiResponse } from "@/types/post";

export default function PostCard({ post }: { post: PostApiResponse }) {
  const coverMedia = post.media.find((item) => item.url === post.imageUrl);
  const coverIsVideo = coverMedia?.mimeType.startsWith("video/") ?? false;

  return (
    <Link
      href={`/cartelera/publicaciones/${post.slug}`}
      className="card-clay group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-container">
        {post.imageUrl ? (
          coverIsVideo ? (
            <video
              src={post.imageUrl}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
            />
          ) : (
            <img
              src={post.imageUrl}
              alt={`Portada de ${post.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-container/40 text-primary">
            <Newspaper className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-primary">
          {formatDateEs(post.publishedAt ?? post.createdAt)}
        </span>
        <h3 className="font-display text-lg font-extrabold leading-snug text-on-surface line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-on-surface-variant line-clamp-3">
          {post.caption}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-extrabold text-primary">
          Leer publicación
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
