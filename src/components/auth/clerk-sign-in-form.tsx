"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { getClerkAppearance } from "./clerk-auth-appearance";

export function ClerkSignInForm() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <SignIn
      key={isDark ? "dark" : "light"}
      appearance={getClerkAppearance(isDark)}
      signUpUrl="/sign-up"
    />
  );
}
