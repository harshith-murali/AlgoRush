"use client";

import { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { getClerkAppearance } from "./clerk-auth-appearance";

export function ClerkSignUpForm() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <SignUp
      key={isDark ? "dark" : "light"}
      appearance={getClerkAppearance(isDark)}
      signInUrl="/sign-in"
    />
  );
}
