import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos de uso — RODA",
  description: "Términos de uso del sitio de RODA y de la lista de espera.",
  alternates: { canonical: "/terminos" },
  // Sin indexar hasta completar domicilio, jurisdicción, dominio y fecha.
  robots: { index: false, follow: true },
};

export default function Terminos() {
  return (
    <LegalPage title="Términos de uso">
      <h2>Qué es este sitio</h2>
      <p>
        {LEGAL.dominio} es el sitio de RODA, una app en desarrollo para encontrar grupos de ciclistas en Buenos Aires.
        Hoy el sitio sirve para anotarse en la lista de espera y para que grupos y locales se sumen como fundadores. La
        app todavía no está disponible.
      </p>

      <h2>Anotarte no te compromete a nada</h2>
      <p>
        Sumarte a la lista es gratis y no te obliga a nada. Podés pedir que te saquemos cuando quieras escribiendo a{" "}
        <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>.
      </p>

      <h2>Lo que mostramos es orientativo</h2>
      <p>
        Las salidas, grupos y lugares que aparecen en el sitio son ejemplos para mostrar cómo va a funcionar la app. Las
        fechas de lanzamiento son estimadas y pueden cambiar. Lo que se describe sobre la app puede ajustarse a medida
        que la desarrollamos.
      </p>

      <h2>Datos que nos das</h2>
      <p>
        Tenés que darnos datos reales y tuyos (o del grupo o local que representás). El uso de esos datos está
        explicado en la <Link href="/privacidad">política de privacidad</Link>.
      </p>

      <h2>Uso del sitio</h2>
      <p>
        No uses el sitio para cargar datos de otras personas sin su permiso, enviar spam ni intentar dañar su
        funcionamiento.
      </p>

      <h2>Propiedad</h2>
      <p>
        El nombre RODA, el logo, los textos y el diseño del sitio pertenecen a su titular. No se pueden usar sin
        autorización.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Ofrecemos el sitio tal como está. Hacemos lo posible para que funcione bien, pero no garantizamos que esté
        siempre disponible ni libre de errores.
      </p>

      <h2>Cambios</h2>
      <p>Podemos actualizar estos términos. La versión vigente es siempre la publicada en esta página.</p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Ante cualquier conflicto intervienen los
        tribunales ordinarios de {LEGAL.jurisdiccion}, sin perjuicio de los derechos que te da la ley de defensa del
        consumidor.
      </p>

      <h2>Contacto</h2>
      <p>
        <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>
      </p>
    </LegalPage>
  );
}
