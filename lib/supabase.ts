import { createClient } from "@supabase/supabase-js";
import { User, UserSchema } from "@/models/user";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function addUserIfNotExists(clerkId: string): Promise<void> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("clerk_id", clerkId)
      .single() as { data: User | null };

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
