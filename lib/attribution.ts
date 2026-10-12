// UTM, ref y referrer de la entrada. Se guardan en sessionStorage para no
// perderlos si la persona navega dentro del sitio; si el storage está
// bloqueado, quedan en memoria.

export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  ref: string | null;
  referrer: string | null;
};

const KEY = "roda_attr";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"] as const;

let memory: Attribution | null = null;

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {}
  return memory;
}

function write(a: Attribution) {
  memory = a;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}

export function captureAttribution(): Attribution {
  const stored = read();
  const params = new URLSearchParams(window.location.search);
  const hasParams = PARAMS.some((p) => params.get(p));

  // Si ya había datos en la sesión y la URL no trae nada nuevo, se conservan.
  if (stored && !hasParams) return stored;

  let referrer: string | null = null;
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) {
      referrer = document.referrer;
    }
  } catch {}

  const a: Attribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    ref: params.get("ref"),
    referrer: referrer ?? stored?.referrer ?? null,
  };
  write(a);
  return a;
}

export function getAttribution(): Attribution {
  return read() ?? captureAttribution();
}
