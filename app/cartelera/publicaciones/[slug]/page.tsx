import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { ArrowLeft, Newspaper } from "lucide-react";
import { ApiError } from "@/lib/api";
import { formatDateEs } from "@/lib/date";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/posts";
import type { ChannelApiName, PostApiResponse } from "@/types/post";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const page = await listPublishedPosts(0, 50);
    return (page.content ?? []).map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

const CHANNEL_LABELS: Record<ChannelApiName, string> = {
  TELEGRAM: "Telegram",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};

const loadPost = cache(async (slug: string): Promise<PostApiResponse | null> => {
  try {
    return await getPublishedPostBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) {
    return { title: "Publicación no encontrada - UEC Luisa Cáceres" };
  }
  return {
    title: `${post.title} - Cartelera - UEC Luisa Cáceres`,
    description: post.caption.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.caption.slice(0, 160),
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) {
    notFound();
  }

  const coverMedia = post.media.find((item) => item.url === post.imageUrl);
  const coverIsVideo = coverMedia?.mimeType.startsWith("video/") ?? false;
  const gallery = post.media.filter((item) => item.url !== post.imageUrl);

  return (
    <main className="flex-grow">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 md:py-16">
        <Link
          href="/cartelera"
          className="btn btn-ghost btn-sm mb-6 md:mb-8"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a la cartelera
        </Link>

        <article className="overflow-hidden rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-lowest shadow-[0_30px_60px_-32px_rgba(31,48,56,0.35)] sm:rounded-[2rem]">
          <div className="relative aspect-[4/3] w-full bg-surface-container md:aspect-[16/9]">
            {post.imageUrl ? (
              coverIsVideo ? (
                <video src={post.imageUrl} className="h-full w-full object-cover" controls />
              ) : (
                <img
                  src={post.imageUrl}
                  alt={`Portada de ${post.title}`}
                  className="h-full w-full object-cover"
                  decoding="async"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-container/30 text-primary">
                <Newspaper className="size-12" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-extrabold text-on-primary-container">
                {formatDateEs(post.publishedAt ?? post.createdAt)}
              </span>
              {post.channels.map((channel) => (
                <span
                  key={channel.channel}
                  className="rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 text-xs font-bold text-on-surface-variant"
                >
                  {CHANNEL_LABELS[channel.channel]}
                </span>
              ))}
            </div>

            <h1 className="mb-4 font-display text-3xl font-extrabold leading-tight text-balance text-on-surface md:text-4xl">
              {post.title}
            </h1>

            <p className="whitespace-pre-line text-[1.0625rem] font-medium leading-relaxed text-on-surface-variant">
              {post.caption}
            </p>

            {gallery.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {gallery.map((item) =>
                  item.mimeType.startsWith("video/") ? (
                    <video
                      key={item.id}
                      controls
                      className="w-full rounded-2xl bg-black"
                      src={item.url}
                    />
                  ) : (
                    <img
                      key={item.id}
                      src={item.url}
                      alt="Imagen de la publicación"
                      className="w-full rounded-2xl border border-outline-variant/40 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
