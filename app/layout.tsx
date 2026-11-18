import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import AppShell from "./components/layout/AppShell";
import Footer from "./components/layout/Footer";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UEC Luisa Cáceres de Arismendi | Educación Inicial",
  description:
    "Un jardín de infancia donde los niños aprenden jugando, con amor, creatividad y acompañamiento cercano a cada familia.",
  icons: {
    icon: [
      { url: "/images/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/images/favicon.ico", sizes: "any" },
    ],
    apple: "/images/favicon-96x96.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff9f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1b22" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${baloo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AppShell footer={<Footer />}>{children}</AppShell>
      </body>
    </html>
  );
}
