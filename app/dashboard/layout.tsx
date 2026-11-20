import type { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";

export default function DashboardSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/material-symbols-outlined.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
