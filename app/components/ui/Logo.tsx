import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export default function Logo({ className = '', compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="UEC Luisa Cáceres de Arismendi — Inicio"
      className={`group flex items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 dark:bg-white sm:size-11">
        <Image
          src="/images/logo.png"
          alt=""
          width={88}
          height={88}
          className="size-full object-contain drop-shadow-[0_4px_10px_rgba(31,48,56,0.18)]"
        />
      </span>

      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="whitespace-nowrap font-display text-[0.95rem] font-extrabold leading-tight text-primary sm:text-[1.05rem]">
            UEC Luisa Cáceres
          </span>
          <span className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant sm:text-[0.62rem] sm:tracking-[0.22em]">
            Educación Inicial
          </span>
        </span>
      )}
    </Link>
  );
}
