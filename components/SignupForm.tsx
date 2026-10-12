"use client";

import { useEffect, useState } from "react";
import styles from "./SignupForm.module.css";
import { PICK_TIPO_EVENT, type Tipo } from "./tipo";

const TABS: { id: Tipo; label: string }[] = [
  { id: "ciclista", label: "Ciclista" },
  { id: "lider", label: "Líder" },
  { id: "local", label: "Local" },
];

const SUBMIT_LABEL: Record<Tipo, string> = {
  ciclista: "Anotarme",
  lider: "Sumar mi grupo",
  local: "Sumar mi local",
};

const ZONA_LABEL: Record<Tipo, string> = {
  ciclista: "¿Por dónde rodás?",
  lider: "¿Dónde sale el grupo?",
  local: "Zona del local",
};

const DONE_TEXT: Record<Tipo, string> = {
  ciclista: "Te vamos a escribir cuando abra el piloto, con los grupos de tu zona y tu ritmo.",
  lider: "Te escribimos en estos días para cargar tu grupo como fundador antes de la apertura.",
  local: "Te escribimos en estos días para contarte cómo funciona ser aliado fundador.",
};

const ZONAS = [
  "Vicente López / Olivos / Florida",
  "San Isidro / Martínez",
  "San Fernando / Tigre / Nordelta",
  "Otro partido de zona norte",
  "CABA norte (Palermo, Belgrano, Núñez, Costanera)",
  "CABA, otra zona",
  "Zona oeste",
  "Zona sur",
  "La Plata",
  "Otra",
];

const RITMOS = ["Chill (menos de 25 km/h)", "Moderado (25–30 km/h)", "Intenso (más de 30 km/h)"];

const BICIS = [
  "Ruta (manubrio curvo, cubiertas finas)",
  "Gravel (ruta y tierra)",
  "MTB / mountain bike",
  "Urbana, híbrida o de paseo",
  "Todavía no tengo",
];

export function SignupForm() {
  const [tipo, setTipo] = useState<Tipo>("ciclista");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    function onPick(e: Event) {
      setTipo((e as CustomEvent<Tipo>).detail);
      setSent(false);
    }
    window.addEventListener(PICK_TIPO_EVENT, onPick);
    return () => window.removeEventListener(PICK_TIPO_EVENT, onPick);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Paso 1: envío falso. El alta real (Supabase) llega en el paso 2.
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className={styles.done}>
        <span className={styles.doneTitle}>Ya estás adentro.</span>
        <p className={styles.doneText}>{DONE_TEXT[tipo]}</p>
        <p className={styles.doneFollow}>
          Mientras tanto, seguinos en <a href="https://instagram.com/rodaclub.ar">@rodaclub.ar</a>.
        </p>
        <button type="button" className={`btn btnGhost ${styles.again}`} onClick={() => setSent(false)}>
          Anotar a otra persona
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div role="tablist" aria-label="Tipo de alta" className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === tipo}
            aria-controls="form-sumate"
            className={`${styles.tab} ${t.id === tipo ? styles.tabOn : ""}`}
            onClick={() => setTipo(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form id="form-sumate" className={styles.form} onSubmit={onSubmit}>
        {tipo === "local" && (
          <div className={styles.group}>
            <Field label="Tipo de local" htmlFor="f-tipo-local">
              <select id="f-tipo-local" name="local_tipo" required className={styles.control} defaultValue="">
                <option value="">Elegí una opción</option>
                <option>Café</option>
                <option>Bicicletería</option>
                <option>Marca</option>
                <option>Otro</option>
              </select>
            </Field>
            <Field label="Nombre del local" htmlFor="f-local">
              <input id="f-local" name="local_nombre" type="text" required className={styles.control} />
            </Field>
            <Field label="Dirección y localidad" htmlFor="f-dir">
              <input
                id="f-dir"
                name="local_direccion"
                type="text"
                placeholder="Ej.: Av. del Libertador 1234, Olivos"
                className={styles.control}
              />
            </Field>
          </div>
        )}

        {tipo === "lider" && (
          <div className={styles.group}>
            <Field label="Nombre del grupo" htmlFor="f-grupo">
              <input id="f-grupo" name="grupo_nombre" type="text" required className={styles.control} />
            </Field>
            <div className={styles.row}>
              <Field label="¿Cuántos salen?" htmlFor="f-cant">
                <select id="f-cant" name="grupo_cantidad" required className={styles.control} defaultValue="">
                  <option value="">Aprox.</option>
                  <option>Menos de 5</option>
                  <option>5 a 10</option>
                  <option>11 a 20</option>
                  <option>21 a 40</option>
                  <option>Más de 40</option>
                </select>
              </Field>
              <Field label="Ritmo del grupo" htmlFor="f-ritmo-g">
                <select id="f-ritmo-g" name="grupo_ritmo" className={styles.control} defaultValue="">
                  <option value="">Elegí</option>
                  {RITMOS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                  <option>Varía</option>
                </select>
              </Field>
            </div>
            <Field label="Instagram del grupo" optional htmlFor="f-ig-g">
              <input id="f-ig-g" name="grupo_instagram" type="text" placeholder="@" className={styles.control} />
            </Field>
          </div>
        )}

        <Field label="Tu nombre" htmlFor="f-nombre">
          <input id="f-nombre" name="nombre" type="text" autoComplete="name" required className={styles.control} />
        </Field>
        <div className={styles.row}>
          <Field label="Mail" htmlFor="f-mail">
            <input id="f-mail" name="email" type="email" autoComplete="email" required className={styles.control} />
          </Field>
          <Field label="WhatsApp" optional htmlFor="f-wa">
            <input
              id="f-wa"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="11 1234 5678"
              className={styles.control}
            />
          </Field>
        </div>

        <Field label={ZONA_LABEL[tipo]} htmlFor="f-zona">
          <select id="f-zona" name="zona" required className={styles.control} defaultValue="">
            <option value="">Elegí tu zona</option>
            {ZONAS.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </Field>

        {tipo !== "local" && (
          <div className={styles.row}>
            <Field label="Tipo de bici" htmlFor="f-bici">
              <select id="f-bici" name="tipo_bici" required className={styles.control} defaultValue="">
                <option value="">Elegí</option>
                {BICIS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            {tipo === "ciclista" && (
              <Field label="Tu ritmo" htmlFor="f-nivel">
                <select id="f-nivel" name="ritmo" required className={styles.control} defaultValue="">
                  <option value="">Elegí</option>
                  {RITMOS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                  <option>No sé todavía</option>
                </select>
              </Field>
            )}
          </div>
        )}

        <label htmlFor="f-ok" className={styles.consent}>
          <input id="f-ok" name="consentimiento" type="checkbox" required className={styles.check} />
          <span>
            Acepto que RODA me contacte por mail o WhatsApp sobre el lanzamiento. Ver{" "}
            <a href="#privacidad">política de privacidad</a>.
          </span>
        </label>

        <button type="submit" className={`btn btnPrimary ${styles.submit}`}>
          {SUBMIT_LABEL[tipo]}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
      </label>
      {children}
    </div>
  );
}
