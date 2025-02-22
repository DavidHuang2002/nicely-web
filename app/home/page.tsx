import { TermsPopup } from "@/components/terms-popup";
import { NotesPageContent } from "@/components/notes/notes-page-content";
import { auth } from "@clerk/nextjs/server";
import { getUser, getUserSessionSummaries, addUserIfNotExists } from "@/lib/database/supabase";
import { redirect } from "next/navigation";
import { EXAMPLE_SESSION_SUMMARY } from "@/models/session-summary";

export default async function Page() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null; // or redirect to login
  }

  let user = await getUser(clerkUserId);
  let userId = user?.id;

  if (!user) {
    // create user
    userId = await addUserIfNotExists(clerkUserId);
  }

  // Fetch session summaries directly in the server component
  const sessionSummaries = await getUserSessionSummaries(userId!);

  // If no summaries, use example summary
  const summariesToDisplay =
    sessionSummaries.length > 0
      ? sessionSummaries.concat(EXAMPLE_SESSION_SUMMARY)
      : [EXAMPLE_SESSION_SUMMARY];

  return (
    <>
      <NotesPageContent sessionSummaries={summariesToDisplay} />
      <TermsPopup />
    </>
  );
}
