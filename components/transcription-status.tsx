// components/transcription-status.tsx
"use client";

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
            description: "Your recording has been transcribed successfully.",
            action: {
              label: "View",
              onClick: () =>
                (window.location.href = `/notes/${transcriptionId}`),
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
