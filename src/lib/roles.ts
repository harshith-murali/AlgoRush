import { currentUser } from "@clerk/nextjs/server";
import { currentUserRole } from "@modules/auth/actions";

export type UserRole = "user" | "admin";

export interface ClerkUserMetadata {
  role?: string;
}

/**
 * Server-side helper to read and check the user's role.
 * First checks the PostgreSQL database, then falls back to Clerk publicMetadata.
 * Safely falls back to "user" if missing.
 */
export async function getClerkUserRole(): Promise<UserRole> {
  try {
    // 1. Check PostgreSQL Database Role
    const dbRole = await currentUserRole();
    if (dbRole === "ADMIN") {
      return "admin";
    }

    // 2. Check Clerk Session Metadata (fallback)
    const user = await currentUser();
    if (!user) return "user";

    const metadata = user.publicMetadata as ClerkUserMetadata;
    const role = metadata.role?.toLowerCase();

    if (role === "admin") {
      return "admin";
    }

    return "user";
  } catch (error) {
    console.error("Error retrieving user role:", error);
    return "user";
  }
}
