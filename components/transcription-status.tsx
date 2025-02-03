// components/transcription-status.tsx
"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";

// Add this constant at the top of the file
const TRANSCRIPTION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export function TranscriptionStatus() {
  const checkTranscriptionStatus = useCallback(async () => {
    const pendingTranscriptions = JSON.parse(
      localStorage.getItem("pendingTranscriptions") || "[]"
    );

    // Get timestamps for pending transcriptions
    const transcriptionTimestamps = JSON.parse(
      localStorage.getItem("transcriptionTimestamps") || "{}"
    );

    // Filter out timed-out transcriptions
    const currentTime = Date.now();
    const activeTranscriptions = pendingTranscriptions.filter((id: string) => {
      const timestamp = transcriptionTimestamps[id];
      if (!timestamp) {
        // If no timestamp found, consider it timed out
        return false;
      }

      const age = currentTime - timestamp;
      const isValid = age < TRANSCRIPTION_TIMEOUT_MS;

      if (!isValid) {
        // Show timeout notification
        toast.error("Transcription timed out", {
          description:
            "The transcription process took too long and has been cancelled.",
        });
        // Remove the timestamp
        delete transcriptionTimestamps[id];
      }

      return isValid;
    });

    // Update localStorage if any transcriptions were removed
    if (activeTranscriptions.length !== pendingTranscriptions.length) {
      localStorage.setItem(
        "pendingTranscriptions",
        JSON.stringify(activeTranscriptions)
      );
      localStorage.setItem(
        "transcriptionTimestamps",
        JSON.stringify(transcriptionTimestamps)
      );
    }

    if (activeTranscriptions.length === 0) {
      // Remove the floating indicator if no pending transcriptions
      const indicator = document.getElementById("transcription-indicator");
      if (indicator) {
        indicator.remove();
      }
      return;
    }

    // Create or update floating indicator
    let indicator = document.getElementById("transcription-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "transcription-indicator";
      indicator.className = "fixed bottom-4 right-4 z-50";
      document.body.appendChild(indicator);
    }

    // Update indicator content
    indicator.innerHTML = `
      <div class="bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm text-muted-foreground">
        <div class="animate-spin">
          <svg class="h-4 w-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      Processing ${activeTranscriptions.length} session note${
      activeTranscriptions.length > 1 ? "s" : ""
    } 🎯
      </div>
    `;

    for (const transcriptionId of activeTranscriptions) {
      try {
        const res = await fetch(`/api/transcribe/${transcriptionId}`);

        if (!res.ok) {
          const errorMessage =
            res.status === 404
              ? "Transcription not found"
              : `Server error (${res.status})`;

          toast.error("Failed to check transcription", {
            description: errorMessage,
          });

          // remove from pending list
          const updated = activeTranscriptions.filter(
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
          const updated = activeTranscriptions.filter(
            (id: string) => id !== transcriptionId
          );
          localStorage.setItem(
            "pendingTranscriptions",
            JSON.stringify(updated)
          );

          // log session summary id
          console.log("session summary id: ", data.sessionSummaryId);

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
          const updated = activeTranscriptions.filter(
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
        toast.error("Connection error", {
          description:
            "Failed to check transcription status. Will retry automatically.",
        });
      }
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkTranscriptionStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkTranscriptionStatus, 30000);

    return () => {
      clearInterval(interval);
      // Clean up indicator on unmount
      const indicator = document.getElementById("transcription-indicator");
      if (indicator) {
        indicator.remove();
      }
    };
  }, [checkTranscriptionStatus]);

  return null;
}
