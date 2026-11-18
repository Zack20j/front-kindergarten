'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from './Header';

type AppShellProps = {
  children: ReactNode;
  footer: ReactNode;
};

export default function AppShell({ children, footer }: AppShellProps) {
  const pathname = usePathname();
  const hideShell =
    pathname?.startsWith('/dashboard') || pathname?.startsWith('/login');

  return (
    <>
      {!hideShell && <Header />}
      {!hideShell && <div aria-hidden="true" className="h-[88px] shrink-0" />}
      <div id="contenido" className="flex flex-1 flex-col">
        {children}
      </div>
      {!hideShell && footer}
    </>
  );
}
