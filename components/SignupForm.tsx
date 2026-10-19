"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { BICIS, CANTIDADES, LOCAL_TIPOS, RITMOS_CICLISTA, RITMOS_GRUPO, ZONA_GRUPOS } from "@/lib/opciones";
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

type Status = "idle" | "sending" | "error";

const ERROR_TEXT = {
  invalid: "Revisá los datos: falta algún campo o el mail no es válido.",
  too_fast: "Fue muy rápido. Esperá un segundo y volvé a tocar el botón.",
  server: "No pudimos guardar tus datos. Probá de nuevo en un momento o escribinos a roda.club.app@gmail.com.",
};

export function SignupForm() {
  const [tipo, setTipo] = useState<Tipo>("ciclista");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<keyof typeof ERROR_TEXT | null>(null);
  const started = useRef(new Set<Tipo>());

  function changeTipo(next: Tipo) {
    setTipo(next);
    setSent(false);
    setError(null);
    track("tab_change", { tipo: next });
  }

  useEffect(() => {
    function onPick(e: Event) {
      changeTipo((e as CustomEvent<Tipo>).detail);
    }
    window.addEventListener(PICK_TIPO_EVENT, onPick);
    return () => window.removeEventListener(PICK_TIPO_EVENT, onPick);
  }, []);

  function onFocus() {
    if (started.current.has(tipo)) return;
    started.current.add(tipo);
    track("form_start", { tipo });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const fd = new FormData(e.currentTarget);
    const fields = Object.fromEntries(fd.entries()) as Record<string, string>;
    const attribution = getAttribution();
    const payload = {
      ...fields,
      ...attribution,
      tipo,
      consentimiento: fd.get("consentimiento") === "on",
      elapsed_ms: Math.round(performance.now()),
    };

    setStatus("sending");
    setError(null);
    let reason: keyof typeof ERROR_TEXT = "server";
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        track("form_submit", {
          tipo,
          zona: fields.zona,
          utm_source: attribution.utm_source,
          ref: attribution.ref,
        });
        setStatus("idle");
        setSent(true);
        return;
      }
      if (data.error === "invalid" || data.error === "too_fast") reason = data.error;
    } catch {}

    track("form_error", { tipo, reason });
    setStatus("idle");
    setError(reason);
  }

  if (sent) {
    return (
      <div role="status" className={styles.done}>
        <span className={styles.doneTitle}>Ya estás adentro.</span>
        <p className={styles.doneText}>{DONE_TEXT[tipo]}</p>
        <p className={styles.doneFollow}>
          Mientras tanto, seguinos en <a href="https://instagram.com/rodaclub.ar">@rodaclub.ar</a>.
        </p>
        <button
          type="button"
          className={`btn btnGhost ${styles.again}`}
          onClick={() => {
            setSent(false);
            started.current.clear();
          }}
        >
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
            onClick={() => t.id !== tipo && changeTipo(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form id="form-sumate" className={styles.form} onSubmit={onSubmit} onFocus={onFocus}>
        {/* Honeypot: oculto para personas, los bots lo completan. */}
        <div className={styles.hp} aria-hidden="true">
          <label htmlFor="f-website">No completar</label>
          <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {tipo === "local" && (
          <div className={styles.group}>
            <Field label="Tipo de local" htmlFor="f-tipo-local">
              <select id="f-tipo-local" name="local_tipo" required className={styles.control} defaultValue="">
                <option value="">Elegí una opción</option>
                {LOCAL_TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
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
                  {CANTIDADES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Ritmo del grupo" htmlFor="f-ritmo-g">
                <select id="f-ritmo-g" name="grupo_ritmo" className={styles.control} defaultValue="">
                  <option value="">Elegí</option>
                  {RITMOS_GRUPO.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
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
            {ZONA_GRUPOS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.zonas.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </optgroup>
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
                  {RITMOS_CICLISTA.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        )}

        <label htmlFor="f-ok" className={styles.consent}>
          <input id="f-ok" name="consentimiento" type="checkbox" required className={styles.check} />
          <span>
            Acepto que RODA guarde estos datos y me contacte por mail o WhatsApp sobre el lanzamiento. Entiendo
            que se alojan en servicios que pueden estar fuera de Argentina.{" "}
            <Link href="/privacidad">Política de privacidad</Link>
          </span>
        </label>

        {error && (
          <p role="alert" className={styles.error}>
            {ERROR_TEXT[error]}
          </p>
        )}

        <button type="submit" className={`btn btnPrimary ${styles.submit}`} disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : SUBMIT_LABEL[tipo]}
        </button>

        <p className={styles.legend}>
          Podés pedir ver, corregir o borrar tus datos cuando quieras escribiendo a{" "}
          <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>. Más info en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>
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
