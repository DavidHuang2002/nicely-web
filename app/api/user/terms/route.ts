import { currentUser } from "@clerk/nextjs/server";
import {
  addUserIfNotExists,
  getUser,
  updateUser,
} from "@/lib/database/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser(clerkUser.id);
  if (!user) {
    return NextResponse.json({ hasAgreed: false });
  }

  return NextResponse.json({ hasAgreed: user.terms_accepted || false });
}

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  await addUserIfNotExists(clerkUser.id);
  await updateUser(clerkUser.id, { terms_accepted: true });

  return NextResponse.json({ success: true });
}
