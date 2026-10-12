import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones — RODA",
  alternates: { canonical: "/terminos" },
  // Sin indexar hasta que esté el texto legal definitivo.
  robots: { index: false, follow: true },
};

export default function Terminos() {
  return <LegalPage title="Términos y condiciones" />;
}
