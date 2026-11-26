import { createClient } from "@supabase/supabase-js";

// Supabase pausa los proyectos del plan gratis si en 7 días no reciben
// suficiente actividad de base de datos ("unos pocos pedidos por día" según
// https://supabase.com/docs/guides/platform/free-project-pausing).
// Esta ruta la llama un cron de Vercel una vez por día (ver vercel.json) y
// hace solo lecturas: no crea, modifica ni borra datos.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel manda "Authorization: Bearer <CRON_SECRET>" cuando la variable existe.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("keepalive: faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return Response.json({ ok: false, error: "config" }, { status: 500 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Dos lecturas livianas sobre `leads` (cuenta total y fecha del último alta),
  // así cada día quedan varias consultas reales a la base.
  const total = await supabase.from("leads").select("id", { count: "exact", head: true });
  const ultimo = await supabase
    .from("leads")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  const error = total.error ?? ultimo.error;
  if (error) {
    console.error("keepalive: error consultando Supabase:", error.message);
    return Response.json({ ok: false, error: "supabase" }, { status: 502 });
  }

  console.log(`keepalive ok: ${total.count ?? 0} leads`);
  return Response.json({ ok: true });
}
