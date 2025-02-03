// app/notes/page.tsx
import { getUserSessionSummaries, getUser } from "@/lib/database/supabase";
import { auth } from "@clerk/nextjs/server";
import { NotesPageContent } from "@/components/notes/notes-page-content";
import { redirect } from "next/navigation";

export default async function SessionNotesPage() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null; // or redirect to login
  }

  // get user
  const user = await getUser(clerkUserId);
  if (!user) {
    // direct to home page
    redirect("/");
  }

  const sessionSummaries = await getUserSessionSummaries(user.id!);

  return <NotesPageContent sessionSummaries={sessionSummaries} />;
}
