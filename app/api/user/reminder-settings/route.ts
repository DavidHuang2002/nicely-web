import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getReminderSettings, upsertReminderSettings } from "@/lib/database/supabase";
import { CreateReminderSettingsSchema } from "@/models/reminder-settings";
import { getUserOrThrow } from "@/lib/database/supabase";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);
    const settings = await getReminderSettings(user.id!);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching reminder settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminder settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const user = await getUserOrThrow(clerkUser.id);
    const body = await request.json();
    
    console.log("timezone", body.time);

    const settings = CreateReminderSettingsSchema.parse({
      ...body,
      user_id: user.id,
    });

    const updatedSettings = await upsertReminderSettings(settings);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error saving reminder settings:", error);
    return NextResponse.json(
      { error: "Failed to save reminder settings" },
      { status: 500 }
    );
  }
} 