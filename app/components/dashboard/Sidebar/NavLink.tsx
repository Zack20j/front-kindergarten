import type { NavItem } from "@/types/post";
import Link from "next/link";

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  expanded?: boolean;
  currentPathname?: string;
  onNavigate?: () => void;
  onToggleExpanded?: () => void;
}

/**
 * Renders a single sidebar navigation entry.
 * Has one job: display an icon + label and reflect whether it is the active route.
 * When the sidebar is collapsed, only the icon remains visible (label stays
 * available to assistive tech via aria-label/title).
 */
export default function NavLink({
  item,
  active,
  collapsed,
  expanded = false,
  currentPathname,
  onNavigate,
  onToggleExpanded,
}: NavLinkProps) {
  const hasChildren = Boolean(item.children?.length);
  const activeChildId = item.children
    ?.filter(
      (child) =>
        currentPathname === child.href ||
        (child.href !== item.href && currentPathname?.startsWith(`${child.href}/`))
    )
    .sort((first, second) => second.href.length - first.href.length)[0]?.id;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active && currentPathname === item.href ? "page" : undefined}
          aria-label={item.label}
          title={collapsed ? item.label : undefined}
          className={[
            "flex min-w-0 flex-1 items-center gap-3 py-3 rounded-full transition-colors duration-200",
            collapsed ? "justify-center px-3" : "px-4",
            active
              ? "bg-primary-container text-on-primary-container font-bold"
              : "text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface",
          ].join(" ")}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontVariationSettings: item.iconFilled ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          {!collapsed && (
            <span className="text-[0.875rem] tracking-tight whitespace-nowrap">
              {item.label}
            </span>
          )}
        </Link>

        {hasChildren && !collapsed && (
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-label={`${expanded ? "Contraer" : "Expandir"} ${item.label}`}
            aria-expanded={expanded}
            aria-controls={`${item.id}-submenu`}
            className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">
              {expanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        )}
      </div>

      {hasChildren && !collapsed && expanded && (
        <div id={`${item.id}-submenu`} className="ml-8 mt-1 space-y-1 border-l border-outline-variant pl-3">
          {item.children?.map((child) => {
            const childActive = child.id === activeChildId;

            return (
              <Link
                key={child.id}
                href={child.href}
                onClick={onNavigate}
                aria-current={childActive ? "page" : undefined}
                className={[
                  "block rounded-full px-4 py-2.5 text-[0.8125rem] transition-colors",
                  childActive
                    ? "bg-primary-container/60 font-bold text-on-primary-container"
                    : "font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
                ].join(" ")}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
