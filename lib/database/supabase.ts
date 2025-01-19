import { createClient } from "@supabase/supabase-js";
import { User, UserSchema } from "@/models/user";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function addUserIfNotExists(clerkId: string): Promise<void> {
  try {
    // Check if user exists
    const existingUser = await getUser(clerkId);

    if (!existingUser) {
      // Create new user with basic info
      const newUser = UserSchema.parse({
        clerk_id: clerkId,
        onboarding_completed: false,
      });

      await supabase.from("users").insert([newUser]);
    } else {
      console.log("User already exists. user ID:", existingUser.id);
    }
  } catch (error) {
    console.error("Error in addUserIfNotExists:", error);
    throw error;
  }
}


export async function getUser(clerkId: string): Promise<User | null> {
  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", clerkId)
    .single() as { data: User | null };
  return user;
}

export async function updateUser(clerkId: string, data: Partial<User>): Promise<void> {
  const { error } = await supabase.from("users").update(data).eq("clerk_id", clerkId);
  if (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}
