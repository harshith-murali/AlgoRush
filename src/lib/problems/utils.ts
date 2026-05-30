export function computeAcceptanceRate(
  totalSubmissions: number,
  totalAccepted: number
): number | null {
  if (totalSubmissions <= 0) return null;
  return Math.round((totalAccepted / totalSubmissions) * 1000) / 10;
}

export function parseProblemId(raw: string | string[] | undefined): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export const LANGUAGE_LABELS: Record<string, string> = {
  CPP: "C++",
  PYTHON: "Python",
  JAVA: "Java",
  JAVASCRIPT: "JavaScript",
};

export const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  MEDIUM: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
  HARD: "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/10",
};
