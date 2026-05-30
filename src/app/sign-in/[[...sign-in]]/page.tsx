import React from "react";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthCardShell>
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "w-full flex justify-center",
              card: "w-full !bg-transparent border-0 shadow-none p-0",
              headerTitle: "!text-zinc-900 dark:!text-zinc-100 !font-bold tracking-tight font-sans text-lg sm:text-xl",
              headerSubtitle: "!text-zinc-550 dark:!text-zinc-400 font-sans mt-1 text-xs",
              socialButtonsIconButton: "!bg-zinc-50 dark:!bg-zinc-900 border border-zinc-200 dark:border-zinc-800 !text-zinc-800 dark:!text-zinc-250 hover:!bg-zinc-100 dark:hover:!bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors",
              socialButtonsBlockButton: "!bg-zinc-50 dark:!bg-zinc-900 border border-zinc-200 dark:border-zinc-800 !text-zinc-800 dark:!text-zinc-250 hover:!bg-zinc-100 dark:hover:!bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors",
              formButtonPrimary: "!bg-amber-500 hover:!bg-amber-450 !text-zinc-950 font-bold py-2 rounded-lg transition-colors border-0 text-sm shadow-md shadow-amber-500/10 cursor-pointer w-full uppercase tracking-wider font-mono",
              formFieldLabel: "!text-zinc-650 dark:!text-zinc-355 font-mono text-[10px] uppercase font-bold",
              formFieldInput: "!bg-zinc-50 dark:!bg-zinc-900 border border-zinc-250 dark:border-zinc-850 !text-zinc-800 dark:!text-zinc-100 rounded-lg py-2 px-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm placeholder:!text-zinc-600 transition-all font-sans",
              footerActionLink: "!text-amber-600 dark:!text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
              footerActionText: "!text-zinc-500 dark:!text-zinc-400 font-medium text-xs",
              dividerLine: "!bg-zinc-200 dark:!bg-zinc-900",
              dividerText: "!text-zinc-500 text-[9px] uppercase tracking-wider font-bold font-mono",
              formFieldInputShowPasswordButton: "!text-zinc-550 dark:!text-zinc-500 hover:!text-zinc-300",
              footer: "!bg-transparent border-t border-zinc-200 dark:border-zinc-900/50 mt-4 pt-4 w-full",
              cardHeader: "pb-4 w-full",
              formResendCodeLink: "!text-amber-600 dark:!text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
              identityPreviewText: "!text-zinc-600 dark:!text-zinc-350",
              identityPreviewEditButtonIcon: "!text-zinc-500 hover:!text-zinc-200",
              footerText: "!text-zinc-500",
              footerLink: "!text-zinc-500 hover:!text-zinc-400 transition-colors",
              header: "space-y-1 w-full",
            },
            variables: {
              colorPrimary: "#f59e0b", // amber-500
              colorBackground: "transparent",
              colorText: "#f4f4f5", // zinc-100
              colorTextSecondary: "#a1a1aa", // zinc-400
              colorInputBackground: "#18181b", // zinc-900
              colorInputText: "#f4f4f5", // zinc-100
              colorBorder: "#27272a", // zinc-800
              fontFamily: "var(--font-sans)",
              borderRadius: "0.5rem",
            }
          }}
          signUpUrl="/sign-up"
        />
      </AuthCardShell>
    </AuthShell>
  );
}
