import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Mail,
  Newspaper,
  Palette,
  Sparkles,
  Sun,
} from "lucide-react";
import EfemerideCard from "../components/cartelera/EfemerideCard";
import PostCard from "../components/cartelera/PostCard";
import QuickLinkCard from "../components/cartelera/QuickLinkCard";
import SchoolCalendar from "../components/cartelera/SchoolCalendar";
import UrgentBanner from "../components/cartelera/UrgentBanner";
import PageHero from "../components/ui/PageHero";
import { addDaysIso, eventCalendarDate, monthQueryRange, splitIsoDate, todayCalendarDate } from "@/lib/date";
import { listPublishedEvents } from "@/lib/events";
import { listPublishedPosts } from "@/lib/posts";
import type { EventApiResponse } from "@/types/event";
import type { PostApiResponse } from "@/types/post";

const ENLACES = [
    { icon: Mail, title: "Correo institucional", href: "mailto:info@luisacaceres.edu.ve", iconColor: "text-tertiary", bgColor: "bg-tertiary-container" },
    { icon: BookOpen, title: "Libros didácticos", href: "/material/libros-didacticos", iconColor: "text-primary", bgColor: "bg-primary-container" },
    { icon: Palette, title: "Para pintar", href: "/material/para-pintar", iconColor: "text-tertiary", bgColor: "bg-tertiary-container" },
];

const EPHEMERIS_LIMIT = 3;

export const revalidate = 60;

async function fetchPublishedPosts(): Promise<PostApiResponse[]> {
    try {
        const page = await listPublishedPosts(0, 6);
        return page.content;
    } catch {
        return [];
    }
}

async function fetchPublishedEvents(
    params: Parameters<typeof listPublishedEvents>[0]
): Promise<EventApiResponse[]> {
    try {
        return await listPublishedEvents(params);
    } catch {
        return [];
    }
}

export default async function CarteleraPage() {
    const today = todayCalendarDate();
    const year = Number(today.slice(0, 4));
    const month = Number(today.slice(5, 7)) - 1;
    const monthRange = monthQueryRange(year, month);

    const [posts, monthEvents, ephemerides, featuredEvents] = await Promise.all([
        fetchPublishedPosts(),
        fetchPublishedEvents(monthRange),
        fetchPublishedEvents({
            from: `${year}-01-01T00:00:00Z`,
            to: `${year}-12-31T23:59:59Z`,
            kind: "EPHEMERIS",
        }),
        fetchPublishedEvents({
            from: `${today}T00:00:00Z`,
            to: `${addDaysIso(today, 120)}T23:59:59Z`,
            featured: true,
        }),
    ]);

    const ephemerisWithImage = ephemerides.filter((event) => Boolean(event.imageUrl));
    const now = new Date().toISOString();
    const upcomingEphemerides = ephemerisWithImage.filter((event) => event.endsAt >= now);
    const visibleEphemerides = (upcomingEphemerides.length > 0 ? upcomingEphemerides : ephemerisWithImage)
        .slice(0, EPHEMERIS_LIMIT);

    const urgentEvent = featuredEvents[0];

    return (
        <main className="flex-grow">
            {urgentEvent && (
                <UrgentBanner
                    notice={{
                        active: true,
                        text: urgentEvent.description ?? urgentEvent.title,
                    }}
                />
            )}

            <PageHero
                badge="Novedades"
                title={
                    <>
                        Cartelera <span className="text-secondary">informativa</span>
                    </>
                }
                description="Mantente al día con las novedades, fechas importantes y recursos de nuestra institución."
                icon={Newspaper}
                tone="secondary"
            />

            <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 md:py-16">
                {posts.length > 0 && (
                    <section className="mb-10 md:mb-20">
                        <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                            <div className="flex items-center gap-3">
                                <span className="icon-tile size-11 shrink-0 bg-primary-container text-primary sm:size-12" aria-hidden="true">
                                    <Sparkles className="size-5 sm:size-6" strokeWidth={2.1} />
                                </span>
                                <div>
                                    <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-primary sm:text-[0.68rem] sm:tracking-[0.16em]">
                                        Lo último
                                    </p>
                                    <h2 className="font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
                                        Últimas publicaciones
                                    </h2>
                                </div>
                            </div>
                            <p className="max-w-sm text-sm font-semibold leading-relaxed text-on-surface-variant sm:text-right">
                                Noticias y avisos compartidos con nuestras familias.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                <div className="mb-10 md:mb-20">
                    <SchoolCalendar initialEvents={monthEvents} initialToday={today} />
                </div>

                {visibleEphemerides.length > 0 && (
                    <section className="mb-10 md:mb-20">
                        <div className="mb-5 flex items-center gap-3 sm:mb-7">
                            <span className="icon-tile size-11 shrink-0 bg-sun-container text-on-sun-container sm:size-12" aria-hidden="true">
                                <Sun className="size-5 sm:size-6" strokeWidth={2.1} />
                            </span>
                            <div>
                                <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-tertiary sm:text-[0.68rem] sm:tracking-[0.16em]">
                                    Fechas para recordar
                                </p>
                                <h2 className="font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
                                    Efemérides
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                            {visibleEphemerides.map((event) => {
                                const { day, month: monthLabel } = splitIsoDate(eventCalendarDate(event));
                                return (
                                    <EfemerideCard
                                        key={event.id}
                                        image={event.imageUrl ?? ""}
                                        day={day}
                                        month={monthLabel}
                                        title={event.title}
                                        description={event.description ?? ""}
                                    />
                                );
                            })}
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-5 flex items-center gap-3 sm:mb-7">
                        <span className="icon-tile size-11 shrink-0 bg-secondary-container text-secondary sm:size-12" aria-hidden="true">
                            <BookOpen className="size-5 sm:size-6" strokeWidth={2.1} />
                        </span>
                        <div>
                            <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-secondary sm:text-[0.68rem] sm:tracking-[0.16em]">
                                Recursos
                            </p>
                            <h2 className="font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
                                Enlaces de interés
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
                        {ENLACES.map((enlace) => (
                            <QuickLinkCard key={enlace.title} {...enlace} />
                        ))}
                    </div>
                </section>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-low p-5 sm:mt-14 sm:flex-row sm:items-center sm:rounded-[1.75rem] sm:p-6">
                    <p className="text-sm font-semibold text-on-surface-variant">
                        ¿Tienes dudas sobre alguna actividad? Escríbenos y te ayudamos.
                    </p>
                    <Link href="/contacto" className="btn btn-primary btn-sm w-full shrink-0 sm:w-auto">
                        Contactar al colegio
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
