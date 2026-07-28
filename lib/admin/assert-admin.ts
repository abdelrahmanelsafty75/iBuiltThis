import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Verifies the current request comes from an authenticated admin user.
 *
 * Throws:
 *  - "Unauthorized" if the user is not signed in
 *  - "Forbidden"    if the user is signed in but not an admin
 *
 * Callers decide how to handle each case:
 *  - Server Component pages: catch and redirect()
 *  - Server Actions: catch and return { success: false, message }
 */
export async function assertAdmin(): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const isAdmin = (user.publicMetadata?.isAdmin as boolean) ?? false;

  if (!isAdmin) {
    throw new Error("Forbidden");
  }
}
