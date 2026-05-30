"use server";

import {
  getCurrentUserRoleFromDatabase,
  onboardUserToDatabase,
} from "@/lib/auth/user-sync";

export async function onBoardUser() {
  return onboardUserToDatabase();
}

export async function currentUserRole() {
  return getCurrentUserRoleFromDatabase();
}
