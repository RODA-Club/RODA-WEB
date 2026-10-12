"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RideCard.module.css";

type Slide = {
  when: string;
  title: string;
  badge: string;
  fit: "ok" | "warn";
  pace: string;
  km: string;
  spots: string;
  meet: string;
  extra: string;
};

const SLIDES: Slide[] = [
  { when: "Sáb · 7:30 · Vial Costero", title: "Ruta de sábado", badge: "Tu nivel", fit: "ok", pace: "25–30", km: "60", spots: "9/14", meet: "Vial Costero, Vicente López", extra: "Abierta a nuevos" },
  { when: "Dom · 8:00 · Olivos", title: "Tranqui de domingo", badge: "Tu nivel", fit: "ok", pace: "-25", km: "35", spots: "6/12", meet: "Puerto de Olivos", extra: "Ideal si recién arrancás" },
  { when: "Sáb · 9:00 · San Fernando", title: "Salida de mujeres", badge: "Tu nivel", fit: "ok", pace: "25–30", km: "45", spots: "7/12", meet: "Costanera de San Fernando", extra: "Abierta a nuevas" },
  { when: "Mar · 18:30 · Tigre", title: "Ritmo de semana", badge: "1 nivel arriba", fit: "warn", pace: "+30", km: "45", spots: "11/15", meet: "Estación Tigre", extra: "Abierta a nuevos" },
];

const ROTATE_MS = 4500;
const FADE_MS = 280;

export function RideCard() {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const slideRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const fadeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function goTo(i: number) {
    if (i === slideRef.current) return;
    slideRef.current = i;
    setFading(true);
    clearTimeout(fadeT.current);
    fadeT.current = setTimeout(() => {
      setSlide(i);
      setFading(false);
    }, FADE_MS);
  }

  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    if (!reduce) {
      timer.current = setInterval(() => goTo((slideRef.current + 1) % SLIDES.length), ROTATE_MS);
    }
    return () => {
      clearInterval(timer.current);
      clearTimeout(fadeT.current);
    };
  }, []);

  const s = SLIDES[slide];

  return (
    <div className={styles.wrap}>
      <div
        role="img"
        aria-label="Ejemplos de salidas en la app"
        className={styles.card}
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className={styles.top}>
          <span className={styles.when}>{s.when}</span>
          <span className={`${styles.badge} ${s.fit === "warn" ? styles.badgeWarn : ""}`}>{s.badge}</span>
        </div>
        <div className={styles.title}>{s.title}</div>
        <div className={styles.stats}>
          <Stat label="Ritmo" value={s.pace} unit="km/h" />
          <Stat label="Distancia" value={s.km} unit="km" />
          <Stat label="Van" value={s.spots} unit="cupo" />
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Encuentro: {s.meet}
          </div>
          <div className={styles.detail}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
              <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
            </svg>
            Parada de café a mitad de ruta
          </div>
          <div className={styles.detail}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            {s.extra}
          </div>
        </div>
        <div className={styles.confirm}>Confirmo que voy</div>
      </div>
      <div className={styles.dots} role="group" aria-label="Elegir ejemplo de salida">
        {SLIDES.map((x, i) => (
          <button
            key={x.title}
            type="button"
            className={styles.dotBtn}
            aria-label={`Ver ejemplo: ${x.title}`}
            aria-pressed={i === slide}
            onClick={() => {
              clearInterval(timer.current);
              goTo(i);
            }}
          >
            <span className={`${styles.dot} ${i === slide ? styles.dotOn : ""}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{unit}</span>
    </div>
  );
}
