import { getSessionSummaryById } from "@/lib/database/supabase";
import { SessionSummaryView } from "@/components/notes/session-summary-view"
import { notFound } from "next/navigation";
import { SessionSummary } from "@/models/session-summary";

export default async function SessionNotePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  // we can do this because we are in a server component
  const sessionId = (await params).sessionId;
  let sessionSummary: SessionSummary | null = null;
  
  try {
    sessionSummary = await getSessionSummaryById(sessionId);
  } catch (error) {
    console.error(error);
  }

  if (!sessionSummary) {
    notFound();
  }

  return <SessionSummaryView summary={sessionSummary} />;
}
