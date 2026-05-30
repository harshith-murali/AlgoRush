import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function onboardUserToDatabase() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false as const,
        error: "No authenticated user found",
      };
    }

    const { id, emailAddresses, imageUrl, firstName, lastName, username } = user;
    const email = emailAddresses[0]?.emailAddress;

    if (!email) {
      return {
        success: false as const,
        error: "User has no email address associated",
      };
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email,
      },
      create: {
        clerkId: id,
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email,
      },
    });

    return {
      success: true as const,
      status: 200,
      user: dbUser,
      role: dbUser.role,
    };
  } catch (err) {
    console.error("Error onboarding user:", err);
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

export async function getCurrentUserRoleFromDatabase() {
  try {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    return dbUser?.role ?? null;
  } catch (err) {
    console.error("Error retrieving current user role:", err);
    return null;
  }
}
