import React from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { ClerkSignUpForm } from "@/components/auth/clerk-sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthCardShell>
        <ClerkSignUpForm />
      </AuthCardShell>
    </AuthShell>
  );
}
