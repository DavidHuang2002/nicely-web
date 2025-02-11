"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Lightbulb, Mic, Save, X } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

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
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const handleStartRecording = async () => {
    try {
      // Initialize recording logic here
      setIsRecording(true);
      toast.info("Recording started");
    } catch (error) {
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      // Handle transcription here
      // For now, just mock the transcription
      setTranscription("Sample transcription text");
      toast.success("Recording transcribed");
    } catch (error) {
      toast.error("Failed to transcribe recording");
    }
  };

  const handleSaveJournal = async () => {
    try {
      // Save journal entry logic here
      toast.success("Journal entry saved");
    } catch (error) {
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
              <Button
                size="lg"
                className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
              >
                <Mic className="mr-2 h-5 w-5" />
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
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
