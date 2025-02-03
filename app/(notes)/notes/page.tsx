// app/notes/page.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UploadRecordingDialog } from "@/components/upload-recording-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionNotesList from "@/components/notes/session-notes-list";
import  ThemesList from "@/components/notes/themes-list";

export default function SessionNotesPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Session Notes</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/notes/voice">
                <Mic className="mr-2 h-4 w-4" />
                Voice Journal
              </Link>
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Recording
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="mt-6">
            <SessionNotesList />
          </TabsContent>

          <TabsContent value="themes" className="mt-6">
            <ThemesList />
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
