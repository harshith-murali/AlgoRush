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

    // 2. Retrieve Clerk User
    const user = await currentUser();
    if (!user) return "user";

    const metadata = user.publicMetadata as ClerkUserMetadata;
    const role = metadata.role?.toLowerCase();

    // 3. Auto-sync database ADMIN status to Clerk publicMetadata to prevent middleware locks
    if (dbRole === "ADMIN") {
      if (role !== "admin") {
        try {
          const { clerkClient } = await import("@clerk/nextjs/server");
          const client = await clerkClient();
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              role: "admin",
            },
          });
          console.log(`[AUTH_SYNC] Automatically synced Clerk publicMetadata role=admin for clerkId: ${user.id}`);
        } catch (syncErr) {
          console.error("[AUTH_SYNC_ERROR] Failed to auto-sync database role to Clerk:", syncErr);
        }
      }
      return "admin";
    }

    if (role === "admin") {
      return "admin";
    }

    return "user";
  } catch (error) {
    console.error("Error retrieving user role:", error);
    return "user";
  }
}
