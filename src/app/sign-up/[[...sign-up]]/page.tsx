import React from "react";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: "w-full flex justify-center",
            card: "w-full border border-zinc-900 !bg-zinc-950 p-6 sm:p-8 shadow-2xl rounded-2xl",
            headerTitle: "!text-zinc-100 !font-bold tracking-tight font-sans",
            headerSubtitle: "!text-zinc-400 font-sans mt-1",
            socialButtonsIconButton: "!bg-zinc-900 border border-zinc-800 !text-zinc-200 hover:!bg-zinc-800 hover:border-zinc-700 transition-colors",
            socialButtonsBlockButton: "!bg-zinc-900 border border-zinc-800 !text-zinc-200 hover:!bg-zinc-800 hover:border-zinc-700 transition-colors",
            formButtonPrimary: "!bg-amber-500 !text-zinc-950 hover:!bg-amber-400 font-medium py-2 rounded-lg transition-colors border-0 text-sm shadow-lg shadow-amber-500/10",
            formFieldLabel: "!text-zinc-300",
            formFieldInput: "!bg-zinc-900 border border-zinc-850 !text-zinc-100 rounded-lg py-2 px-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm placeholder:!text-zinc-600 transition-all",
            footerActionLink: "!text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
            footerActionText: "!text-zinc-400 font-medium text-xs",
            dividerLine: "!bg-zinc-900",
            dividerText: "!text-zinc-500 text-[10px] uppercase tracking-wider font-semibold",
            formFieldInputShowPasswordButton: "!text-zinc-500 hover:!text-zinc-300",
            footer: "!bg-zinc-950 border-t border-zinc-900/50 mt-4 pt-4",
            cardHeader: "pb-4",
            formResendCodeLink: "!text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
            identityPreviewText: "!text-zinc-350",
            identityPreviewEditButtonIcon: "!text-zinc-400 hover:!text-zinc-200",
            footerText: "!text-zinc-500",
            footerLink: "!text-zinc-500 hover:!text-zinc-400 transition-colors",
            header: "space-y-1",
          },
          variables: {
            colorPrimary: "#f59e0b", // amber-500
            colorBackground: "#09090b", // zinc-955 / absolute dark
            colorText: "#f4f4f5", // zinc-100
            colorTextSecondary: "#a1a1aa", // zinc-400
            colorInputBackground: "#18181b", // zinc-900
            colorInputText: "#f4f4f5", // zinc-100
            colorBorder: "#27272a", // zinc-800
            fontFamily: "var(--font-sans)",
            borderRadius: "0.5rem",
          }
        }}
        signInUrl="/sign-in"
      />
    </AuthShell>
  );
}
