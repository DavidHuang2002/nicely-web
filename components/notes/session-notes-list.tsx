"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SessionSummary } from "@/models/session-summary";

export default function SessionNotesList({
  sessionSummaries,
}: {
  sessionSummaries: SessionSummary[];
}) {
  return (
    <div className="grid gap-4">
      {sessionSummaries.map((sessionSummary) => (
        <Link href={`/notes/${sessionSummary.id}`} key={sessionSummary.id}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <p className="text-sm text-muted-foreground">
              {sessionSummary.session_date.toLocaleDateString()}
            </p>
            <h3 className="text-lg font-medium mt-1">{sessionSummary.title}</h3>
            <p className="text-muted-foreground mt-2">
              {sessionSummary.one_line_summary}
            </p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
