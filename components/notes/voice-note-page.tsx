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
import { Loader2 } from "lucide-react";
import { VoiceRecordingInput } from "@/components/voice-recording-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SessionRecapInputs } from "./session-recap-inputs";

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
  const [currentTab, setCurrentTab] = useState<"recap" | "journal">("recap");
  const [clientTranscription, setClientTranscription] = useState("");
  const [therapistTranscription, setTherapistTranscription] = useState("");
  const [journalTranscription, setJournalTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveJournal = async () => {
    try {
      const isRecapMode = currentTab === "recap";

      if (
        isRecapMode &&
        !clientTranscription.trim() &&
        !therapistTranscription.trim()
      ) {
        toast.error("Please record or enter some text first");
        return;
      }

      if (!isRecapMode && !journalTranscription.trim()) {
        toast.error("Please record or enter some text first");
        return;
      }

      setIsProcessing(true);
      toast.loading("Processing your voice note...", {
        id: "save-journal-toast",
      });

      let combinedText;
      if (isRecapMode) {
        combinedText = [
          clientTranscription && `Client: ${clientTranscription}`,
          therapistTranscription && `Therapist: ${therapistTranscription}`,
        ]
          .filter(Boolean)
          .join("\n\n");
      } else {
        combinedText = `Client: ${journalTranscription}`;
      }

      const res = await fetch("/api/notes/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedText }),
      });

      if (!res.ok) throw new Error("Failed to save journal entry");

      const data = await res.json();

      // Clear the transcriptions
      if (isRecapMode) {
        setClientTranscription("");
        setTherapistTranscription("");
      } else {
        setJournalTranscription("");
      }

      toast.success("Voice note processed successfully!", {
        id: "save-journal-toast",
        description: "Your insights have been organized and saved.",
        action: {
          label: "View Summary",
          onClick: () =>
            (window.location.href = `/notes/${data.sessionSummaryId}`),
        },
        duration: 5000,
      });
    } catch (error) {
      console.error("Error saving journal:", error);
      toast.error("Failed to save voice note", {
        id: "save-journal-toast",
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/home">
          <Button variant="ghost" className="text-muted-foreground -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-2">Capture Session</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs
            defaultValue="recap"
            onValueChange={(value) =>
              setCurrentTab(value as "recap" | "journal")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recap">Recap with Therapist</TabsTrigger>
              <TabsTrigger value="journal">Personal Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="recap" className="mt-6">
              <SessionRecapInputs
                clientTranscription={clientTranscription}
                therapistTranscription={therapistTranscription}
                onClientTranscriptionChange={setClientTranscription}
                onTherapistTranscriptionChange={setTherapistTranscription}
              />
            </TabsContent>

            <TabsContent value="journal" className="mt-6">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Record your thoughts and reflections about your therapy
                  session. This personal journal helps you process insights and
                  track your progress.
                </p>
                <VoiceRecordingInput
                  transcription={journalTranscription}
                  onTranscriptionChange={setJournalTranscription}
                  label="Your Journal Entry"
                  placeholder="What I'm reflecting on after my therapy session..."
                />
              </div>
            </TabsContent>
          </Tabs>

          {((currentTab === "recap" &&
            (clientTranscription || therapistTranscription)) ||
            (currentTab === "journal" && journalTranscription)) && (
            <div className="flex justify-end">
              <Button
                onClick={handleSaveJournal}
                disabled={
                  isProcessing ||
                  (currentTab === "recap"
                    ? !clientTranscription.trim() &&
                      !therapistTranscription.trim()
                    : !journalTranscription.trim())
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Journal Entry
                  </>
                )}
              </Button>
            </div>
          )}
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
