"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Upload, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UploadRecordingDialog } from "@/components/upload-recording-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionNotesList from "@/components/notes/session-notes-list";
import ThemesList from "@/components/notes/themes-list";
import type { SessionSummary } from "@/models/session-summary";
import { EXAMPLE_SESSION_SUMMARY } from "@/models/session-summary";

interface NotesPageContentProps {
  sessionSummaries: SessionSummary[];
}

export function NotesPageContent({ sessionSummaries }: NotesPageContentProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("themes");

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome to Nicely
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Therapy gives you direction, we help you walk it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {currentTab === "themes" && (
                <Button
                  variant="outline"
                  asChild
                  className="sm:w-auto justify-center"
                >
                  <Link href="/untangle">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Nicely
                  </Link>
                </Button>
              )}
              {currentTab === "sessions" && (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="sm:w-auto justify-center"
                  >
                    <Link href="/notes/voice">
                      <Mic className="mr-2 h-4 w-4" />
                      Capture Session
                    </Link>
                  </Button>
                  <Button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="sm:w-auto justify-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Recording
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="themes"
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="themes">Therapy Goals</TabsTrigger>
            <TabsTrigger value="sessions">Session Recaps</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="mt-6">
            <ThemesList />
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <SessionNotesList sessionSummaries={sessionSummaries} />
          </TabsContent>
        </Tabs>
      </motion.div>

      <UploadRecordingDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}
