import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad — RODA",
  description: "Qué datos junta RODA en este sitio, para qué los usa y qué podés hacer con ellos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" fecha={LEGAL.fechaPrivacidad}>
      <p>
        Esta política explica qué datos junta RODA en este sitio, para qué los usa y qué podés hacer con ellos. La
        escribimos corta y clara a propósito.
      </p>

      <h2>Quién es responsable de tus datos</h2>
      <p>
        El responsable de la base de datos es Gonzalo Eujanian, fundador de RODA, con domicilio en {LEGAL.domicilio},
        Argentina. Para cualquier consulta sobre tus datos escribí a{" "}
        <strong>
          <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>
        </strong>
        .
      </p>

      <h2>Qué datos juntamos</h2>
      <p>Solo los que completás en el formulario:</p>
      <ul>
        <li>
          <strong>Si te anotás como ciclista:</strong> nombre, mail, WhatsApp (opcional), zona, tipo de bici y ritmo.
        </li>
        <li>
          <strong>Si te anotás como organizador de un grupo:</strong> además, nombre del grupo, cantidad aproximada de
          integrantes, ritmo e Instagram del grupo.
        </li>
        <li>
          <strong>Si te anotás como local:</strong> además, tipo de local, nombre y dirección.
        </li>
      </ul>
      <p>
        También guardamos desde qué link llegaste (por ejemplo, si viniste desde Instagram o desde el código QR de una
        bicicletería) y la fecha en que aceptaste esta política. Para entender cómo se usa el sitio medimos visitas y
        grabamos de forma anónima cómo se recorre la página (clics y desplazamiento), sin cookies, sin identificarte y
        sin guardar lo que escribís en el formulario.
      </p>
      <p>No te pedimos datos sensibles ni los necesitamos.</p>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Avisarte cuando abra RODA y contarte novedades del lanzamiento.</li>
        <li>Si organizás un grupo o tenés un local, contactarte para sumarte como fundador.</li>
        <li>Saber en qué zonas hay más interés y qué canales funcionan, para decidir dónde arrancar.</li>
      </ul>
      <p>
        No vendemos ni alquilamos tus datos, y no los usamos para nada distinto de esto sin pedirte permiso antes.
      </p>

      <h2>Dónde se guardan</h2>
      <p>
        Los datos se guardan en proveedores de servicios en la nube que usamos para que el sitio funcione (alojamiento
        del sitio, base de datos y correo). Algunos de esos servidores pueden estar fuera de Argentina. Al aceptar esta
        política prestás tu consentimiento para esa transferencia. Elegimos proveedores con medidas de seguridad
        reconocidas y limitamos el acceso a los datos a quien los necesita para operar RODA.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Mientras RODA esté en etapa de lanzamiento y piloto, o hasta que nos pidas que los borremos. Si RODA no avanza,
        los eliminamos.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Podés pedir en cualquier momento ver qué datos tenemos tuyos, corregirlos, actualizarlos o borrarlos, y dejar
        de recibir mensajes. Escribí a <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a> y te
        respondemos dentro de los plazos que fija la ley (10 días corridos para el acceso y 5 días hábiles para la
        rectificación o supresión).
      </p>
      <p>
        El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
        gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
        lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.
      </p>
      <p>
        La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene
        la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos
        por incumplimiento de las normas vigentes en materia de protección de datos personales.
      </p>

      <h2>Edad</h2>
      <p>La lista de espera es para mayores de 18 años.</p>

      <h2>Cambios</h2>
      <p>
        Si cambiamos esta política, actualizamos la fecha de arriba. Si el cambio afecta cómo usamos tus datos, te
        avisamos por mail antes.
      </p>
    </LegalPage>
  );
}
