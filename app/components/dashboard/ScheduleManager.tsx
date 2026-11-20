"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { formatDateTimeEs } from "@/lib/date";
import { getEventApiMeta } from "@/data/eventCategories";
import { changeEventStatus, deleteEvent, listAdminEvents } from "@/lib/events";
import { CHANNEL_ID_BY_API, getChannelLabel } from "@/data/channels";
import { changePostStatus, deletePost, listAdminPosts, retryPostChannel } from "@/lib/posts";
import type { EventApiResponse } from "@/types/event";
import type { PostApiResponse, PostStatus } from "@/types/post";

type Tab = "posts" | "events";

function StatusBadge({ status }: { status: PostStatus }) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={[
        "text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full",
        published
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container text-on-surface-variant",
      ].join(" ")}
    >
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}

export default function ScheduleManager() {
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<PostApiResponse[]>([]);
  const [events, setEvents] = useState<EventApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [postPage, eventPage] = await Promise.all([listAdminPosts(), listAdminEvents()]);
      setPosts(postPage.content);
      setEvents(eventPage.content);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudieron cargar las publicaciones."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const togglePost = async (post: PostApiResponse) => {
    const next: PostStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setBusyId(`post-${post.id}`);
    setErrorMessage(null);
    try {
      const updated = await changePostStatus(post.id, next);
      setPosts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudo cambiar el estado."
      );
    } finally {
      setBusyId(null);
    }
  };

  const retryPostChannels = async (post: PostApiResponse) => {
    setBusyId(`post-${post.id}`);
    setErrorMessage(null);
    try {
      let updated = post;
      for (const delivery of post.channels) {
        if (delivery.status === "SENT") continue;
        updated = await retryPostChannel(post.id, CHANNEL_ID_BY_API[delivery.channel]);
      }
      setPosts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudo reintentar el envío."
      );
    } finally {
      setBusyId(null);
    }
  };

  const removePost = async (post: PostApiResponse) => {
    if (!window.confirm(`¿Eliminar la publicación "${post.title}"?`)) return;
    setBusyId(`post-${post.id}`);
    setErrorMessage(null);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudo eliminar la publicación."
      );
    } finally {
      setBusyId(null);
    }
  };

  const toggleEvent = async (event: EventApiResponse) => {
    const next: PostStatus = event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setBusyId(`event-${event.id}`);
    setErrorMessage(null);
    try {
      const updated = await changeEventStatus(event.id, next);
      setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudo cambiar el estado del evento."
      );
    } finally {
      setBusyId(null);
    }
  };

  const removeEvent = async (event: EventApiResponse) => {
    if (!window.confirm(`¿Eliminar el evento "${event.title}"?`)) return;
    setBusyId(`event-${event.id}`);
    setErrorMessage(null);
    try {
      await deleteEvent(event.id);
      setEvents((prev) => prev.filter((item) => item.id !== event.id));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No se pudo eliminar el evento."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-primary">
            Cartelera
          </p>
          <h1 className="mb-3 font-display text-[2rem] font-extrabold tracking-tight text-balance text-on-surface">
            Publicaciones
          </h1>
          <p className="text-[1.0625rem] leading-relaxed text-on-surface-variant">
            Administra lo que se muestra en la cartelera del colegio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/schedule/nueva-publicacion"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dim"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Nueva publicación
          </Link>
          <Link
            href="/dashboard/schedule/nuevo-evento"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary-container/40"
          >
            <span className="material-symbols-outlined text-xl">event</span>
            Nuevo evento
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-error/30 bg-error-container/40 px-5 py-4 text-on-error-container">
          <span className="material-symbols-outlined text-[20px] text-error">error</span>
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      <div className="mb-6 flex w-max gap-2 rounded-full bg-surface-container-low p-1.5">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={[
            "rounded-full px-5 py-2 text-sm font-bold transition-colors",
            tab === "posts"
              ? "bg-surface-container-lowest text-primary shadow-sm dark:bg-surface-container-high"
              : "text-on-surface-variant hover:text-on-surface",
          ].join(" ")}
        >
          Publicaciones ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("events")}
          className={[
            "rounded-full px-5 py-2 text-sm font-bold transition-colors",
            tab === "events"
              ? "bg-surface-container-lowest text-primary shadow-sm dark:bg-surface-container-high"
              : "text-on-surface-variant hover:text-on-surface",
          ].join(" ")}
        >
          Eventos ({events.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest dark:bg-surface-container-low px-6 py-14 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-[24px] text-primary">
            progress_activity
          </span>
          <p className="text-sm font-semibold">Cargando…</p>
        </div>
      ) : tab === "posts" ? (
        posts.length === 0 ? (
          <EmptyState
            icon="campaign"
            title="Todavía no hay publicaciones"
            description="Crea la primera publicación para que aparezca en la cartelera."
            href="/dashboard/schedule/nueva-publicacion"
            action="Nueva publicación"
          />
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const busy = busyId === `post-${post.id}`;
              const coverMedia = post.media.find((item) => item.url === post.imageUrl);
              const coverIsVideo = coverMedia?.mimeType.startsWith("video/") ?? false;
              return (
                <article
                  key={post.id}
                  className="flex flex-col gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:flex-row sm:items-center"
                >
                  {coverIsVideo ? (
                    <div className="flex h-24 w-full items-center justify-center rounded-xl bg-surface-container-low text-primary sm:w-28">
                      <span className="material-symbols-outlined text-3xl">videocam</span>
                    </div>
                  ) : (
                    <img
                      src={post.imageUrl}
                      alt={`Portada de ${post.title}`}
                      className="h-24 w-full rounded-xl object-cover sm:w-28"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} />
                      <span className="text-xs font-medium text-on-surface-variant">
                        {formatDateTimeEs(post.publishedAt ?? post.createdAt)}
                      </span>
                    </div>
                    <h2 className="truncate text-base font-bold text-on-surface">
                      {post.title}
                    </h2>
                    <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                      {post.caption}
                    </p>
                    {post.channels.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {post.channels.map((delivery) => (
                          <span
                            key={delivery.channel}
                            title={delivery.errorMessage ?? undefined}
                            className={[
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                              delivery.status === "SENT"
                                ? "bg-secondary-container text-on-secondary-container"
                                : delivery.status === "FAILED"
                                  ? "bg-error-container text-on-error-container"
                                  : "bg-surface-container text-on-surface-variant",
                            ].join(" ")}
                          >
                            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                              {delivery.status === "SENT"
                                ? "check_circle"
                                : delivery.status === "FAILED"
                                  ? "error"
                                  : "schedule"}
                            </span>
                            {getChannelLabel(delivery.channel)}:{" "}
                            {delivery.status === "SENT"
                              ? "Enviado"
                              : delivery.status === "FAILED"
                                ? "Error"
                                : "Pendiente"}
                          </span>
                        ))}
                        {post.channels.some((delivery) => delivery.status !== "SENT") && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void retryPostChannels(post)}
                            className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary-container/40 disabled:opacity-50"
                          >
                            Reintentar envío
                          </button>
                        )}
                      </div>
                    )}
                    {post.channels.some(
                      (delivery) => delivery.status === "FAILED" && delivery.errorMessage
                    ) && (
                      <p className="mt-2 text-xs font-semibold text-error">
                        {post.channels
                          .filter(
                            (delivery) => delivery.status === "FAILED" && delivery.errorMessage
                          )
                          .map(
                            (delivery) =>
                              `${getChannelLabel(delivery.channel)}: ${delivery.errorMessage}`
                          )
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void togglePost(post)}
                      className="rounded-full border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-container/40 disabled:opacity-50"
                    >
                      {post.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removePost(post)}
                      className="rounded-full border border-error/30 px-4 py-2 text-xs font-bold text-error transition-colors hover:bg-error-container/40 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )
      ) : events.length === 0 ? (
        <EmptyState
          icon="event"
          title="Todavía no hay eventos"
          description="Crea un evento o efeméride para mostrarlo en el calendario."
          href="/dashboard/schedule/nuevo-evento"
          action="Nuevo evento"
        />
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const meta = getEventApiMeta(event.category, event.kind);
            const busy = busyId === `event-${event.id}`;
            return (
              <article
                key={event.id}
                className="flex flex-col gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:flex-row sm:items-center"
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={`Imagen de ${event.title}`}
                    className="h-24 w-full rounded-xl object-cover sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-xl bg-surface-container-low text-primary sm:w-28">
                    <span className="material-symbols-outlined text-3xl">event</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <StatusBadge status={event.status} />
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      {formatDateTimeEs(event.startsAt)}
                    </span>
                  </div>
                  <h2 className="truncate text-base font-bold text-on-surface">
                    {event.title}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                    {event.description ?? event.location ?? "Sin descripción"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void toggleEvent(event)}
                    className="rounded-full border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-container/40 disabled:opacity-50"
                  >
                    {event.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void removeEvent(event)}
                    className="rounded-full border border-error/30 px-4 py-2 text-xs font-bold text-error transition-colors hover:bg-error-container/40 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest dark:bg-surface-container-low px-6 py-14 text-center md:px-12">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h2 className="mb-2 font-display text-xl font-extrabold text-on-surface">{title}</h2>
      <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-on-surface-variant">
        {description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dim"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">
          add
        </span>
        {action}
      </Link>
    </section>
  );
}
