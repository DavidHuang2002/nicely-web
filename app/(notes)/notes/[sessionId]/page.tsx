import { getSessionSummaryById } from "@/lib/database/supabase";
import { SessionSummaryView } from "@/components/notes/session-summary-view"
import { notFound } from "next/navigation";
import { SessionSummary } from "@/models/session-summary";
import { EXAMPLE_SESSION_ID, EXAMPLE_SESSION_SUMMARY } from "@/models/session-summary";

export default async function SessionNotePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  // we can do this because we are in a server component
  const sessionId = (await params).sessionId;
  let sessionSummary: SessionSummary | null = null;
  
  // if sessionId is the example session id, show example
  if (sessionId === EXAMPLE_SESSION_ID) {
    sessionSummary = EXAMPLE_SESSION_SUMMARY;
  } else {
    try {
      sessionSummary = await getSessionSummaryById(sessionId);
    } catch (error) {
      console.error(error);
    }
  }

  if (!sessionSummary) {
    notFound();
  }

  return <SessionSummaryView summary={sessionSummary} />;
}
