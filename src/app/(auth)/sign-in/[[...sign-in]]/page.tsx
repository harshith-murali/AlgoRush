import React from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { ClerkSignInForm } from "@/components/auth/clerk-sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthCardShell>
        <ClerkSignInForm />
      </AuthCardShell>
    </AuthShell>
  );
}
