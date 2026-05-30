import { Language } from "@/generated/prisma";
import { SOLUTION_TEMPLATES } from "@/lib/problem-language-templates";

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

export function wrapUserCode(
  userCode: string,
  language: Language,
  dbSolutionCode?: string | null
): string {
  const solutionCode = dbSolutionCode || SOLUTION_TEMPLATES[language] || "";
  if (!solutionCode) return userCode;

  if (language === Language.CPP) {
    const mainIndex = solutionCode.indexOf("int main(");
    if (mainIndex !== -1) {
      const driverCode = solutionCode.substring(mainIndex);
      const headers = [
        "#include <iostream>",
        "#include <vector>",
        "#include <string>",
        "#include <sstream>",
        "#include <unordered_map>",
        "#include <map>",
        "#include <set>",
        "#include <algorithm>",
        "#include <queue>",
        "#include <stack>",
        "using namespace std;",
      ].join("\n");
      return `${headers}\n\n${userCode}\n\n${driverCode}`;
    }
  }

  if (language === Language.JAVA) {
    const mainClassIndex = solutionCode.indexOf("public class Main");
    if (mainClassIndex !== -1) {
      const driverCode = solutionCode.substring(mainClassIndex);
      const imports = "import java.util.*;\nimport java.io.*;";
      const sanitizedUserCode = userCode.replace(/\bpublic\s+class\s+Solution\b/g, "class Solution");
      return `${imports}\n\n${sanitizedUserCode}\n\n${driverCode}`;
    }
  }

  if (language === Language.PYTHON) {
    const sysIndex = solutionCode.indexOf("sys.stdin");
    if (sysIndex !== -1) {
      const lineStart = solutionCode.lastIndexOf("\n", sysIndex);
      const driverCode = lineStart !== -1 ? solutionCode.substring(lineStart) : solutionCode.substring(sysIndex);
      const imports = "import sys\nimport json\nfrom typing import *\n";
      return `${imports}\n\n${userCode}\n\n${driverCode}`;
    }
  }

  if (language === Language.JAVASCRIPT) {
    const fsIndex = solutionCode.indexOf("fs.readFileSync");
    if (fsIndex !== -1) {
      const lineStart = solutionCode.lastIndexOf("\n", fsIndex);
      const driverCode = lineStart !== -1 ? solutionCode.substring(lineStart) : solutionCode.substring(fsIndex);
      const imports = "const fs = require('fs');\n";
      return `${imports}\n\n${userCode}\n\n${driverCode}`;
    }
  }

  return userCode;
}
