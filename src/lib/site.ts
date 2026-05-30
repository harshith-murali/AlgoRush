/** Canonical production host (Vercel). */
export const productionSiteUrl = "https://algo-rush-platform.vercel.app";

export const siteConfig = {
  name: "AlgoRush",
  url: productionSiteUrl,
  title: "AlgoRush — Sharpen DSA. Ship faster.",
  description:
    "Practice curated coding interview problems, run code in-browser, and track progress on AlgoRush — a serious DSA prep platform.",
  tagline: "Sharpen DSA. Ship faster.",
  keywords: [
    "algorithms",
    "data structures",
    "coding interview",
    "leetcode",
    "DSA practice",
    "competitive programming",
    "AlgoRush",
  ],
  creator: "AlgoRush",
};

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return productionSiteUrl;
  }
  return "http://localhost:3000";
}
