import { createClient } from "@supabase/supabase-js";
import { leadSchema, toRow } from "@/lib/leads";

// Mínimo de tiempo entre que carga la página y llega el envío (anti-bots).
const MIN_ELAPSED_MS = 2000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: un humano nunca lo ve. Respondemos ok para no darle pistas al bot.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const elapsed = Number(body.elapsed_ms);
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return Response.json({ ok: false, error: "too_fast" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400 },
    );
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("leads: faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const row = toRow(parsed.data);
  let { error } = await supabase.from("leads").upsert(row, { onConflict: "email,tipo" });

  // Si todavía no se corrió 0002_consentimiento.sql, guardar igual el lead sin
  // esas columnas antes que perderlo.
  if (error?.code === "PGRST204") {
    console.error("leads: faltan columnas de consentimiento, correr 0002_consentimiento.sql");
    const { consentimiento_at: _at, consentimiento_version: _v, ...legacy } = row;
    ({ error } = await supabase.from("leads").upsert(legacy, { onConflict: "email,tipo" }));
  }

  if (error) {
    console.error("leads: error de Supabase", error.code, error.message);
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
