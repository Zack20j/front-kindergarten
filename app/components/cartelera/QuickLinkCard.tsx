import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickLinkCardProps {
  icon: LucideIcon;
  title: string;
  href: string;
  iconColor: string;
  bgColor: string;
}

export default function QuickLinkCard({
  icon: Icon,
  title,
  href,
  iconColor,
  bgColor,
}: QuickLinkCardProps) {
  const isExternal = /^https?:\/\//.test(href);
  const isProtocolLink = /^(https?:\/\/|mailto:|tel:)/.test(href);

  const content = (
    <>
      <span
        className={`icon-tile size-11 shrink-0 sm:size-14 ${bgColor} ${iconColor}`}
        aria-hidden="true"
      >
        <Icon className="size-5 sm:size-7" strokeWidth={2.1} />
      </span>
      <span className="min-w-0 flex-1 font-display text-sm font-extrabold leading-snug text-on-surface sm:flex-none sm:text-center">
        {title}
      </span>
      {isExternal ? (
        <ArrowUpRight
          className="ml-auto size-4 shrink-0 text-on-surface-variant/60 sm:absolute sm:right-4 sm:top-4 sm:ml-0 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
          aria-hidden="true"
        />
      ) : (
        <ArrowRight
          className="ml-auto size-4 shrink-0 text-on-surface-variant/60 transition-transform group-hover:translate-x-0.5 sm:absolute sm:right-4 sm:top-4 sm:ml-0 sm:opacity-0 sm:transition-all sm:group-hover:opacity-100"
          aria-hidden="true"
        />
      )}
    </>
  );

  const className =
    'card-clay group relative flex h-full flex-row items-center justify-start gap-3 p-4 text-left sm:flex-col sm:justify-center sm:p-6 sm:text-center';

  if (!isProtocolLink) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
    >
      {content}
    </a>
  );
}
