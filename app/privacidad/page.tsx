import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad — RODA",
  alternates: { canonical: "/privacidad" },
  // Sin indexar hasta que esté el texto legal definitivo.
  robots: { index: false, follow: true },
};

export default function Privacidad() {
  return <LegalPage title="Política de privacidad" />;
}
