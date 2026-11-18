import Image from "next/image";
import NavLink from "./NavLink";
import { NAV_ITEMS, ACTIVE_NAV_ID } from "@/data/navigation";
import { useState } from "react";

interface SidebarProps {
  schoolName: string;
  logoUrl: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeItemId?: string;
  currentPathname?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  schoolName,
  logoUrl,
  collapsed,
  onToggleCollapse,
  activeItemId = ACTIVE_NAV_ID,
  currentPathname,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    (): Record<string, boolean> => (activeItemId === "schedule" ? { schedule: true } : {})
  );

  const toggleItem = (itemId: string) => {
    setExpandedItems((expanded) => ({ ...expanded, [itemId]: !expanded[itemId] }));
  };

  const isCollapsed = collapsed && !mobileOpen;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={[
          "fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />
      <nav
        aria-label="Navegación del panel"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-container-low border-r border-outline-variant/50 shadow-[0_24px_60px_-32px_rgba(31,48,56,0.35)]",
          "md:sticky md:top-0 md:self-start md:h-screen md:translate-x-0 md:shadow-none md:transition-[width]",
          "transition-transform duration-300 ease-out",
          isCollapsed ? "w-72 md:w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className={["flex flex-col h-full p-6 gap-2", isCollapsed ? "items-center" : ""].join(" ")}>
          <div className={["mb-8 flex items-center gap-4", isCollapsed ? "px-0 justify-center" : "px-2"].join(" ")}>
            <Image
              className="w-12 h-12 object-contain flex-shrink-0 drop-shadow-[0_4px_10px_rgba(31,48,56,0.18)] dark:rounded-xl dark:bg-white"
              src={logoUrl}
              alt={`Logotipo de ${schoolName}`}
              width={96}
              height={96}
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-display text-[1.125rem] font-extrabold text-on-surface leading-tight text-balance">
                  {schoolName}
                </h1>
                <p className="text-[0.8125rem] text-on-surface-variant font-semibold">
                  Portal administrativo
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Cerrar menú"
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary md:hidden"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1 w-full">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={item.id === activeItemId}
                collapsed={isCollapsed}
                currentPathname={currentPathname}
                expanded={Boolean(expandedItems[item.id])}
                onNavigate={() => {
                  if (item.children) {
                    setExpandedItems((expanded) => ({ ...expanded, [item.id]: true }));
                  }
                  onCloseMobile?.();
                }}
                onToggleExpanded={item.children ? () => toggleItem(item.id) : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            className={[
              "mt-auto hidden md:flex py-3 bg-primary text-on-primary rounded-full font-sans font-bold text-[0.875rem] transition-colors hover:bg-primary-dim items-center justify-center gap-2",
              "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary/70",
              isCollapsed ? "w-12 h-12 px-0 self-center" : "w-full",
            ].join(" ")}
          >
            <span className="material-symbols-outlined">{isCollapsed ? "chevron_right" : "chevron_left"}</span>
            {!isCollapsed && "Contraer menú"}
          </button>
        </div>
      </nav>
    </>
  );
}
