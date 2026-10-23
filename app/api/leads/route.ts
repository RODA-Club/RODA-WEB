import { createClient } from "@supabase/supabase-js";
import { after } from "next/server";
import { leadSchema, toRow } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/mail/send";

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
  let row: Partial<ReturnType<typeof toRow>> & { email: string; tipo: string } = toRow(parsed.data);
  let { error } = await supabase.from("leads").insert(row);

  // Si la base todavía no tiene las columnas de novedades (migración 0002),
  // el alta se guarda igual sin ese dato: el formulario no puede fallar por eso.
  if (error?.code === "PGRST204") {
    console.error("leads: falta la migración 0002 (acepta_novedades); se guarda sin novedades");
    const { acepta_novedades: _a, novedades_at: _n, ...sinNovedades } = row;
    row = sinNovedades;
    ({ error } = await supabase.from("leads").insert(row));
  }

  // Mismo mail y tipo ya anotado: se actualiza en vez de duplicar. La tabla
  // tiene un índice único sobre (lower(email), tipo), que PostgREST no acepta
  // como onConflict, así que el upsert va en dos pasos. El mail ya llega en
  // minúsculas desde la validación.
  const esAltaNueva = !error;
  if (error?.code === "23505") {
    ({ error } = await supabase.from("leads").update(row).eq("email", row.email).eq("tipo", row.tipo));
  }

  if (error) {
    console.error("leads: error de Supabase", error.code, error.message);
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  // Mail de confirmación solo en altas nuevas, después de responder: si falla,
  // el alta ya está guardada y la persona ve igual "Ya estás adentro.".
  if (esAltaNueva) after(() => sendLeadEmails(parsed.data));

  return Response.json({ ok: true });
}
