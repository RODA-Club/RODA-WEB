import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "RODA — Encontrá tu grupo. Salí a rodar.",
  description:
    "RODA te conecta con grupos de ciclistas de tu nivel, tu ritmo y tu zona. Antes de ir ya sabés a qué velocidad van, cuántos son y dónde se juntan. Nadie queda atrás.",
};

export const viewport: Viewport = {
  themeColor: "#141408",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
