import { dark } from "@clerk/themes";

const sharedElements = {
  rootBox: "w-full max-w-full min-w-0 flex justify-center",
  cardBox: "w-full max-w-full min-w-0",
  card: "w-full max-w-full min-w-0 !bg-transparent border-0 shadow-none p-0 mx-0",
  main: "w-full max-w-full min-w-0 gap-4",
  form: "w-full max-w-full min-w-0",
  formButtonPrimary:
    "!bg-amber-500 hover:!bg-amber-400 !text-zinc-950 font-bold py-2 rounded-lg transition-colors border-0 text-sm shadow-md shadow-amber-500/10 cursor-pointer !w-full max-w-full uppercase tracking-wider font-mono",
  formFieldLabel: "font-mono text-[10px] uppercase font-bold",
  formFieldInput:
    "rounded-lg py-2 px-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all font-sans !w-full max-w-full",
  dividerText: "!text-zinc-500 text-[9px] uppercase tracking-wider font-bold font-mono",
  formFieldInputShowPasswordButton: "transition-colors",
  cardHeader: "pb-4 w-full max-w-full min-w-0",
  formResendCodeLink: "text-xs font-semibold transition-colors",
  identityPreviewEditButtonIcon: "transition-colors",
  header: "space-y-1 w-full",
  formFieldErrorText: "!text-red-600 dark:!text-red-400",
};

const lightElements = {
  ...sharedElements,
  headerTitle:
    "!text-zinc-900 !font-bold tracking-tight font-sans text-lg sm:text-xl",
  headerSubtitle: "!text-zinc-600 font-sans mt-1 text-xs",
  socialButtonsIconButton:
    "!bg-white border border-zinc-200 !text-zinc-800 hover:!bg-zinc-50 hover:border-zinc-300 transition-colors",
  socialButtonsBlockButton:
    "!bg-white border border-zinc-200 !text-zinc-800 hover:!bg-zinc-50 hover:border-zinc-300 transition-colors",
  formFieldLabel: "!text-zinc-600 font-mono text-[10px] uppercase font-bold",
  formFieldInput:
    "!bg-white border border-zinc-200 !text-zinc-900 placeholder:!text-zinc-400 rounded-lg py-2 px-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all font-sans !w-full max-w-full",
  footerActionLink:
    "!inline !whitespace-nowrap !text-amber-600 hover:!text-amber-500 text-xs font-semibold transition-colors",
  footerActionText: "!inline !text-zinc-500 font-medium text-xs",
  dividerLine: "!bg-zinc-200",
  formFieldInputShowPasswordButton:
    "!text-zinc-500 hover:!text-zinc-700",
  footer:
    "!bg-white !shadow-none border-t border-zinc-200 mt-4 pt-4 w-full max-w-full min-w-0",
  footerAction:
    "!flex !flex-row !flex-wrap !items-center !justify-center !gap-x-1.5 !gap-y-1 !text-center !bg-white w-full max-w-full min-w-0 py-3",
  footerPages:
    "!bg-white w-full max-w-full min-w-0 !text-zinc-500",
  footerItem: "!bg-white !text-zinc-500",
  formResendCodeLink: "!text-amber-600 hover:!text-amber-500 text-xs font-semibold transition-colors",
  identityPreviewText: "!text-zinc-600",
  identityPreviewEditButtonIcon: "!text-zinc-500 hover:!text-zinc-700",
  footerText: "!text-zinc-500",
  footerLink: "!text-zinc-500 hover:!text-zinc-700 transition-colors",
  alertText: "!text-zinc-700",
};

const darkElements = {
  ...sharedElements,
  headerTitle:
    "!text-zinc-100 !font-bold tracking-tight font-sans text-lg sm:text-xl",
  headerSubtitle: "!text-zinc-400 font-sans mt-1 text-xs",
  socialButtonsIconButton:
    "!bg-zinc-900 border border-zinc-800 !text-zinc-200 hover:!bg-zinc-800 hover:border-zinc-700 transition-colors",
  socialButtonsBlockButton:
    "!bg-zinc-900 border border-zinc-800 !text-zinc-200 hover:!bg-zinc-800 hover:border-zinc-700 transition-colors",
  formFieldLabel: "!text-zinc-300 font-mono text-[10px] uppercase font-bold",
  formFieldInput:
    "!bg-zinc-900 border border-zinc-800 !text-zinc-100 placeholder:!text-zinc-500 rounded-lg py-2 px-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all font-sans !w-full max-w-full",
  footerActionLink:
    "!inline !whitespace-nowrap !text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
  footerActionText: "!inline !text-zinc-400 font-medium text-xs",
  dividerLine: "!bg-zinc-800",
  formFieldInputShowPasswordButton:
    "!text-zinc-400 hover:!text-zinc-200",
  footer:
    "!bg-transparent !shadow-none border-t border-zinc-800 mt-4 pt-4 w-full max-w-full min-w-0",
  footerAction: "!flex !flex-row !flex-wrap !items-center !justify-center !gap-x-1.5 !gap-y-1 !text-center !bg-transparent w-full max-w-full min-w-0 py-3",
  footerPages: "!bg-transparent w-full max-w-full min-w-0 !text-zinc-400",
  footerItem: "!bg-transparent !text-zinc-400",
  formResendCodeLink: "!text-amber-500 hover:!text-amber-400 text-xs font-semibold transition-colors",
  identityPreviewText: "!text-zinc-300",
  identityPreviewEditButtonIcon: "!text-zinc-500 hover:!text-zinc-200",
  footerText: "!text-zinc-400",
  footerLink: "!text-zinc-400 hover:!text-zinc-300 transition-colors",
  alertText: "!text-zinc-300",
};

const lightVariables = {
  colorPrimary: "#f59e0b",
  colorBackground: "#ffffff",
  colorForeground: "#18181b",
  colorNeutral: "#52525b",
  colorMuted: "#f4f4f5",
  colorMutedForeground: "#71717a",
  colorText: "#18181b",
  colorTextSecondary: "#71717a",
  colorInput: "#ffffff",
  colorInputBackground: "#ffffff",
  colorInputForeground: "#18181b",
  colorInputText: "#18181b",
  colorBorder: "#e4e4e7",
  fontFamily: "var(--font-sans)",
  borderRadius: "0.5rem",
};

const darkVariables = {
  colorPrimary: "#f59e0b",
  colorBackground: "#18181b",
  colorForeground: "#f4f4f5",
  colorNeutral: "#fafafa",
  colorMuted: "#27272a",
  colorMutedForeground: "#a1a1aa",
  colorText: "#f4f4f5",
  colorTextSecondary: "#a1a1aa",
  colorInput: "#18181b",
  colorInputBackground: "#18181b",
  colorInputForeground: "#f4f4f5",
  colorInputText: "#f4f4f5",
  colorBorder: "#27272a",
  fontFamily: "var(--font-sans)",
  borderRadius: "0.5rem",
};

export function getClerkAppearance(isDark: boolean) {
  return {
    baseTheme: isDark ? dark : undefined,
    elements: isDark ? darkElements : lightElements,
    variables: isDark ? darkVariables : lightVariables,
  };
}
