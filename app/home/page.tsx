import { TermsPopup } from "@/components/terms-popup";
import { NotesPageContent } from "@/components/notes/notes-page-content";
import { auth } from "@clerk/nextjs/server";
import { getUser, getUserSessionSummaries } from "@/lib/database/supabase";
import { redirect } from "next/navigation";
import { EXAMPLE_SESSION_SUMMARY } from "@/models/session-summary";

export default async function Page() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null; // or redirect to login
  }

  const user = await getUser(clerkUserId);

  if (!user) {
    redirect("/");
  }

  // Fetch session summaries directly in the server component
  const sessionSummaries = await getUserSessionSummaries(user.id!);

  // If no summaries, use example summary
  const summariesToDisplay =
    sessionSummaries.length > 0 ? sessionSummaries : [EXAMPLE_SESSION_SUMMARY];

  return (
    <>
      <NotesPageContent sessionSummaries={summariesToDisplay} />
      <TermsPopup />
    </>
  );
}
