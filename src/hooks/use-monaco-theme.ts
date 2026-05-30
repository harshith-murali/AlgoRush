"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Returns the correct Monaco editor theme string based on the active
 * color scheme: "vs-dark" in dark mode, "vs-light" in light mode.
 * Uses `resolvedTheme` so "system" is handled correctly.
 * Delays until mounted to avoid SSR hydration mismatches.
 */
export function useMonacoTheme(): string {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "vs-dark"; // safe SSR default
  return resolvedTheme === "light" ? "vs-light" : "vs-dark";
}
