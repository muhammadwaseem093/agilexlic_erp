"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/** Tells the user once per page load when live data is unavailable, instead of silently showing blanks. */
export function GatewayStatusToast({ reachable }: { reachable: boolean }) {
  useEffect(() => {
    if (!reachable) {
      toast.warning("Live data is unavailable", {
        id: "gateway-unreachable",
        description: "Figures will appear once the API gateway is reachable.",
      });
    }
  }, [reachable]);

  return null;
}
