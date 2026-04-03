import type { NavItem } from "./landingData";
import { ChevronRight, Smile } from "lucide-react";

type NavbarProps = {
  items: NavItem[];
  ctaHref: string;
  ctaLabel: string;
};

export default function Navbar({ items, ctaHref, ctaLabel }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-sky-100 text-sky-700 shadow-sm shadow-sky-200">
            <Smile className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">U.E.C. Luisa Cáceres</p>
            <p className="text-xs text-slate-500">Preescolar alegre</p>
          </div>
        </a>

        <nav aria-label="Página principal" className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-amber-300/40 transition hover:bg-amber-300"
        >
          {ctaLabel}
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
