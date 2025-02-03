// components/transcription-status.tsx
"use client";

// a background process that checks the status of the transcription
// and updates the status in the database

import { useEffect, useCallback } from "react";
import { toast } from "sonner";

export function TranscriptionStatus() {
  const checkTranscriptionStatus = useCallback(async () => {
    const pendingTranscriptions = JSON.parse(
      localStorage.getItem("pendingTranscriptions") || "[]"
    );

    if (pendingTranscriptions.length === 0) return;

    for (const transcriptionId of pendingTranscriptions) {
      try {
        const res = await fetch(`/api/transcribe/${transcriptionId}`);

        if (!res.ok) {
          // Show specific error message based on status code
          const errorMessage =
            res.status === 404
              ? "Transcription not found"
              : `Server error (${res.status})`;

          toast.error("Failed to check transcription", {
            description: errorMessage,
            duration: 4000,
          });

          // remove from pending list
          const updated = pendingTranscriptions.filter(
            (id: string) => id !== transcriptionId
          );
            localStorage.setItem(
              "pendingTranscriptions",
              JSON.stringify(updated)
          );

          continue;
        }

        const data = await res.json();

        if (data.status === "completed") {
          // Remove from pending list
          const updated = pendingTranscriptions.filter(
            (id: string) => id !== transcriptionId
          );
          localStorage.setItem(
            "pendingTranscriptions",
            JSON.stringify(updated)
          );

          // Show completion notification
          toast.success("Transcription completed!", {
            description: "Your recording has been processed successfully.",
            action: {
              label: "View",
              onClick: () =>
                (window.location.href = `/notes/${data.sessionSummaryId}`),
            },
          });
        } else if (data.status === "failed") {
          const updated = pendingTranscriptions.filter(
            (id: string) => id !== transcriptionId
          );
          localStorage.setItem(
            "pendingTranscriptions",
            JSON.stringify(updated)
          );

          toast.error("Transcription failed", {
            description: "There was an error processing your recording.",
          });
        }
      } catch (error) {
        console.error("Error checking transcription status:", error);

        // Show error notification to user
        toast.error("Connection error", {
          description:
            "Failed to check transcription status. Will retry automatically.",
          duration: 4000,
        });

        // Don't remove from pending list on connection errors
        // This allows the component to retry on next interval
      }
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkTranscriptionStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkTranscriptionStatus, 30000);

    return () => clearInterval(interval);
  }, [checkTranscriptionStatus]);

  return null;
}
