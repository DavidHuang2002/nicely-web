import { createClerkClient } from "@clerk/nextjs/server";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Retrieves a user's email and name from Clerk
 *
 * @param user User object from database
 * @returns Object containing email and name
 */
export async function getUserEmailAndName(user: any) {
  const clerkUser = await clerkClient.users.getUser(user.clerk_id);

  // Get primary email address
  const primaryEmailAddress = clerkUser.emailAddresses.find(
    (clerkUserEmail: any) =>
      clerkUserEmail.id === clerkUser.primaryEmailAddressId
  );

  const email = primaryEmailAddress?.emailAddress || "";
  const name =
    user.preferred_name || clerkUser.firstName || email.split("@")[0];

  return { email, name };
}