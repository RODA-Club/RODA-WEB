import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const TITLE = "RODA — Encontrá tu grupo. Salí a rodar.";

// og.png es un placeholder hasta que Gonzalo apruebe la imagen final.
const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "RODA. Encontrá tu grupo. Salí a rodar." };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "RODA",
    url: "/",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#141408",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
