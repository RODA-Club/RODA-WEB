"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const a = captureAttribution();
    initAnalytics(a);
    track("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
