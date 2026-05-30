import { Language } from "@/generated/prisma";
import axios from "axios";

export const LANGUAGE_TO_JUDGE0_ID: Record<Language, number> = {
  [Language.CPP]: 54,        // C++ (GCC 9.2.0)
  [Language.PYTHON]: 71,     // Python (3.8.1)
  [Language.JAVA]: 62,       // Java (OpenJDK 13.0.1)
  [Language.JAVASCRIPT]: 63, // JavaScript (Node.js 12.14.0)
  [Language.TYPESCRIPT]: 74, // TypeScript (3.7.4)
  [Language.GO]: 60,         // Go (1.13.5)
  [Language.RUST]: 73,       // Rust (1.40.0)
};