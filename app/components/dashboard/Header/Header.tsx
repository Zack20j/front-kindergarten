import { useState } from "react";
import HelpPanel from "./HelpPanel";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

interface HeaderProps {
  schoolName: string;
  section: string;
  currentPage: string;
  avatarUrl: string;
  userName: string;
  onLogout: () => void;
  onOpenMenu: () => void;
}

export default function Header({
  schoolName,
  section,
  currentPage,
  avatarUrl,
  userName,
  onLogout,
  onOpenMenu,
}: HeaderProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-outline-variant/40 bg-background/85 backdrop-blur-xl print:hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid size-10 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="truncate font-display text-base font-extrabold text-primary">
            {schoolName}
          </span>
        </div>

        <div className="hidden min-w-0 md:block">
          <nav className="flex items-center text-[0.875rem] text-on-surface-variant" aria-label="Breadcrumb">
            <a className="transition-colors hover:text-primary" href="#">
              {section}
            </a>
            <span className="mx-2 text-outline" aria-hidden="true">
              /
            </span>
            <span className="truncate font-semibold text-primary">{currentPage}</span>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Ayuda"
              aria-haspopup="menu"
              aria-expanded={isHelpOpen}
              onClick={() => setIsHelpOpen((open) => !open)}
              className={[
                "grid size-10 place-items-center rounded-full transition-colors",
                isHelpOpen
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
              ].join(" ")}
            >
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            {isHelpOpen && <HelpPanel onClose={() => setIsHelpOpen(false)} />}
          </div>

          <ThemeToggle className="size-10" />

          <span className="hidden max-w-40 truncate text-sm font-semibold text-on-surface lg:block">
            {userName}
          </span>

          <div className="ml-1 size-10 shrink-0 overflow-hidden rounded-full border-2 border-surface-container-lowest bg-surface-container-high shadow-sm">
            <img className="size-full object-cover" src={avatarUrl} alt={`Foto de perfil de ${userName}`} />
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="grid size-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
