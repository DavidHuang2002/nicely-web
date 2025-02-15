"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Lightbulb, Mic, Save, X } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useRecorder } from "@/hooks/use-recorder";
import { WaveformVisualizer } from "../waveform-visualizer";
import { transcribeAudioBlob } from "@/components/utils/transcribe";
import { RecordingButton } from "@/components/voice-note-recording-button";

const MAX_RECORDING_DURATION = 30; // 30 minutes max for therapy sessions
const SESSION_PROMPTS = {
  "Key Topics": [
    "What were the main issues we discussed?",
    "What specific situations came up?",
    "Were there any breakthrough moments?",
  ],
  "Feelings & Reactions": [
    "How did you feel during the session?",
    "What reactions surprised you?",
    "What felt challenging to discuss?",
  ],
  Takeaways: [
    "What new insights did you gain?",
    "What coping strategies were discussed?",
    "What would you like to explore further?",
  ],
  "Action Items": [
    "What homework or practices were suggested?",
    "What small steps can you take this week?",
    "What would you like to bring up next time?",
  ],
};

export function VoiceNotePage() {
  const [transcription, setTranscription] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const {
    isRecording,
    isPaused,
    stream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecorder(MAX_RECORDING_DURATION);

  const handleStartRecording = async () => {
    try {
      const started = await startRecording();
      if (started) {
        toast.info("Recording started");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsTranscribing(true);
      toast.loading("Transcribing your recording...", {
        id: "transcription-toast",
      });

      const blob = await stopRecording();
      if (blob) {
        const transcribedText = await transcribeAudioBlob(blob, transcription);
        if (transcribedText) {
          setTranscription(transcribedText);
        }
      }

      toast.success("Recording transcribed", {
        id: "transcription-toast",
      });
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to transcribe recording");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePauseRecording = async () => {
    try {
      setIsTranscribing(true);
      toast.loading("Transcribing your recording...", {
        id: "transcription-toast",
      });

      const blob = await pauseRecording();
      if (blob) {
        const transcribedText = await transcribeAudioBlob(blob, transcription);
        if (transcribedText) {
          setTranscription(transcribedText);
        }
      }

      toast.success("Recording transcribed", {
        id: "transcription-toast",
      });
    } catch (error) {
      console.error("Error pausing recording:", error);
      toast.error("Failed to transcribe recording");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSaveJournal = async () => {
    try {
      if (!transcription.trim()) {
        toast.error("Please record or enter some text first");
        return;
      }

      // Show loading toast that will persist
      toast.loading("Processing your voice journal...", {
        id: "voice-journal-processing",
        duration: Infinity, // Make it persist
      });

      const res = await fetch("/api/notes/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcription }),
      });

      if (!res.ok) {
        throw new Error("Failed to save journal entry");
      }

      const data = await res.json();

      // Dismiss the loading toast and show success
      toast.dismiss("voice-journal-processing");
      toast.success("Journal entry saved", {
        description: "Your voice note has been processed successfully.",
        action: {
          label: "View",
          onClick: () =>
            (window.location.href = `/notes/${data.sessionSummaryId}`),
        },
      });
    } catch (error) {
      // Dismiss the loading toast and show error
      toast.dismiss("voice-journal-processing");
      console.error("Error saving journal:", error);
      toast.error("Failed to save journal entry");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/notes">
          <Button variant="ghost" className="text-muted-foreground -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-2">Voice Journal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            {/* Recording Controls */}
            <div className="flex justify-center mb-6">
              <RecordingButton
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                onStartRecording={handleStartRecording}
              >
                <div className="flex-1">
                  <WaveformVisualizer
                    isRecording={isRecording}
                    stream={stream}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleStopRecording}
                  variant="ghost"
                  className="rounded-full p-2 h-fit hover:bg-primary/90"
                  disabled={isTranscribing}
                >
                  <Save className="h-5 w-5 text-primary-foreground" />
                </Button>
              </RecordingButton>
            </div>

            {/* Transcription Area */}
            <div className="space-y-4">
              <Textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Your journal entry will appear here..."
                className="min-h-[200px]"
              />
              {transcription && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveJournal}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Journal Entry
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Inspiration Panel - Modified Version */}
        <Card className="p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Need a Prompt?
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(SESSION_PROMPTS).map(([category, prompts]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h4>
                <div className="space-y-1">
                  {prompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left text-sm h-auto py-1.5 px-2 hover:bg-accent/50"
                      onClick={() => {
                        setSelectedPrompt(prompt);
                        // Optional: Scroll the textarea into view
                        document
                          .querySelector("textarea")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
