// app/notes/page.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Mic, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UploadRecordingDialog } from "@/components/upload-recording-dialog";

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

        {/* Recent Sessions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          <div className="grid gap-4">
            {/* We'll populate this with actual session data later */}
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground">March 15, 2024</p>
              <h3 className="text-lg font-medium mt-1">Weekly Check-in</h3>
              <p className="text-muted-foreground mt-2">
                Discussed anxiety management techniques and set goals for the
                week...
              </p>
            </div>
          </div>
        </div>

        {/* Timeline/Calendar View Toggle could be added here */}
      </motion.div>

      <UploadRecordingDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}
