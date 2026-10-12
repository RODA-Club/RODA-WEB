import type { PostHog } from "posthog-js";

// PostHog sin cookies ni localStorage (persistence: "memory"), así no hace
// falta banner. Se carga diferido para no pesar en la primera carga. Si no hay
// key configurada, los eventos se descartan.

let client: Promise<PostHog | null> | null = null;

export function initAnalytics(superProps: Record<string, string | null>) {
  if (client) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    client = Promise.resolve(null);
    return;
  }
  client = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        persistence: "memory",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        person_profiles: "identified_only",
      });
      // Todos los eventos llevan el canal de entrada, para cortar por ref/UTM.
      posthog.register(superProps);
      return posthog;
    })
    .catch(() => null);
}

export function track(event: string, props?: Record<string, unknown>) {
  client?.then((ph) => ph?.capture(event, props));
}
