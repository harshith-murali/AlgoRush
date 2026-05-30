"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemeToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Toaster
      position="top-right"
      theme={mounted && resolvedTheme === "light" ? "light" : "dark"}
      closeButton
      richColors
    />
  );
}
