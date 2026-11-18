"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getEventApiMeta } from "@/data/eventCategories";
import {
  buildMonthGrid,
  eventCalendarDate,
  formatCalendarDateLong,
  formatEventSchedule,
  monthLabelEs,
  monthQueryRange,
  todayCalendarDate,
} from "@/lib/date";
import { listPublishedEvents } from "@/lib/events";
import type { EventApiResponse } from "@/types/event";
import EventModal from "./EventModal";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface SchoolCalendarProps {
  initialEvents: EventApiResponse[];
  initialToday: string;
}

export default function SchoolCalendar({ initialEvents, initialToday }: SchoolCalendarProps) {
  const [year, setYear] = useState(() => Number(initialToday.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(initialToday.slice(5, 7)) - 1);
  const [events, setEvents] = useState<EventApiResponse[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchMonth = async (nextYear: number, nextMonth: number) => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { from, to } = monthQueryRange(nextYear, nextMonth);
      const result = await listPublishedEvents({ from, to });
      if (requestId.current === currentRequest) {
        setEvents(result);
      }
    } catch {
      if (requestId.current === currentRequest) {
        setErrorMessage("No se pudieron cargar los eventos de este mes.");
      }
    } finally {
      if (requestId.current === currentRequest) {
        setIsLoading(false);
      }
    }
  };

  const days = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventApiResponse[]>();
    for (const event of events) {
      const date = eventCalendarDate(event);
      const list = map.get(date);
      if (list) {
        list.push(event);
      } else {
        map.set(date, [event]);
      }
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  const goToMonth = (offset: number) => {
    const next = new Date(Date.UTC(year, month + offset, 1));
    const nextYear = next.getUTCFullYear();
    const nextMonth = next.getUTCMonth();
    setYear(nextYear);
    setMonth(nextMonth);
    void fetchMonth(nextYear, nextMonth);
  };

  const goToToday = () => {
    const current = todayCalendarDate();
    const currentYear = Number(current.slice(0, 4));
    const currentMonth = Number(current.slice(5, 7)) - 1;
    setYear(currentYear);
    setMonth(currentMonth);
    void fetchMonth(currentYear, currentMonth);
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="icon-tile size-11 shrink-0 bg-secondary-container text-secondary sm:size-12"
            aria-hidden="true"
          >
            <CalendarDays className="size-5 sm:size-6" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-secondary sm:text-[0.68rem] sm:tracking-[0.16em]">
              Fechas y actividades
            </p>
            <h2 className="font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
              Calendario Escolar
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-outline-variant/50 bg-surface-container-lowest p-1 sm:flex-none">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Mes anterior"
              className="grid size-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-primary-container/60 hover:text-primary"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="min-w-0 flex-1 text-center text-sm font-extrabold text-on-surface sm:min-w-[8.5rem] sm:flex-none">
              {monthLabelEs(year, month)}
            </span>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Mes siguiente"
              className="grid size-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-primary-container/60 hover:text-primary"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={goToToday}
            className="min-h-11 shrink-0 rounded-full border border-outline-variant/50 px-4 text-xs font-extrabold text-primary transition-colors hover:bg-primary-container/40"
          >
            Hoy
          </button>
        </div>
      </div>

      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant md:hidden">
        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
        Los puntos marcan días con eventos. Toca uno para ver el detalle.
      </p>

      {errorMessage && (
        <p className="mb-3 rounded-xl bg-error-container px-4 py-2 text-sm font-semibold text-on-error-container">
          {errorMessage}
        </p>
      )}

      <div className="relative rounded-[1.75rem] border border-outline-variant/40 bg-surface-container-lowest p-2.5 shadow-[0_22px_44px_-30px_rgba(31,48,56,0.34)] sm:p-4">
        {isLoading && (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full bg-surface-container-lowest/90 px-3 py-1.5 text-xs font-semibold text-on-surface-variant shadow-sm backdrop-blur sm:right-4 sm:top-4">
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
            Cargando
          </div>
        )}

        <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant sm:text-[11px] sm:tracking-wide"
            >
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {days.map((day, index) => {
            const dayEvents = eventsByDate.get(day.date) ?? [];
            const hasEvents = dayEvents.length > 0;
            const column = index % 7;
            const tooltipPosition =
              column > 4
                ? "right-0"
                : column < 2
                  ? "left-0"
                  : "left-1/2 -translate-x-1/2";

            return (
              <div key={day.date} className="group relative">
                <button
                  type="button"
                  onClick={() => hasEvents && setSelectedDate(day.date)}
                  aria-label={`${formatCalendarDateLong(day.date)}${
                    hasEvents ? `, ${dayEvents.length} evento(s)` : ""
                  }`}
                  className={[
                    "relative flex h-16 w-full min-w-0 flex-col gap-1 rounded-xl border p-1 text-left transition-colors sm:h-20 sm:p-1.5 md:h-24",
                    day.inMonth
                      ? "text-on-surface"
                      : "text-on-surface-variant/50",
                    hasEvents
                      ? "cursor-pointer border-outline-variant/40 bg-surface-container-low/60 hover:border-primary/60 hover:bg-primary-container/10"
                      : "cursor-default border-transparent",
                    day.isToday ? "ring-2 ring-primary ring-offset-1" : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                      day.isToday ? "bg-primary text-on-primary" : "",
                    ].join(" ")}
                  >
                    {day.day}
                  </span>

                  <span className="hidden min-w-0 flex-col gap-0.5 sm:flex">
                    {dayEvents.slice(0, 2).map((event) => {
                      const meta = getEventApiMeta(event.category, event.kind);
                      return (
                        <span
                          key={event.id}
                          className="flex min-w-0 items-center gap-1 text-[10px] font-semibold leading-tight"
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dotClass}`} />
                          <span className="truncate">{event.title}</span>
                        </span>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="pl-2.5 text-[10px] font-bold text-primary">
                        +{dayEvents.length - 2} más
                      </span>
                    )}
                  </span>

                  <span className="flex gap-1 sm:hidden">
                    {dayEvents.slice(0, 3).map((event) => {
                      const meta = getEventApiMeta(event.category, event.kind);
                      return (
                        <span
                          key={event.id}
                          className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`}
                        />
                      );
                    })}
                  </span>
                </button>

                {hasEvents && (
                  <div
                    className={`pointer-events-none absolute top-full z-30 mt-2 hidden w-72 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-[0_20px_50px_-15px_rgba(48,51,48,0.4)] md:group-focus-within:block md:group-hover:block ${tooltipPosition}`}
                  >
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-primary">
                      {formatCalendarDateLong(day.date)}
                    </p>
                    <div className="space-y-2">
                      {dayEvents.slice(0, 3).map((event) => {
                        const meta = getEventApiMeta(event.category, event.kind);
                        return (
                          <div key={event.id} className="flex items-start gap-2">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dotClass}`}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-on-surface">
                                {event.title}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">
                                {formatEventSchedule(event)} · {meta.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <p className="text-[11px] font-bold text-primary">
                          +{dayEvents.length - 3} evento(s) más
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && selectedEvents.length > 0 && (
        <EventModal
          date={selectedDate}
          events={selectedEvents}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </section>
  );
}
