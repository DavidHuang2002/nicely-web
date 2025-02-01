"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadRecordingDialog({
  open,
  onOpenChange,
}: UploadRecordingDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Recording</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 transition-colors",
              isDragging ? "border-primary" : "border-muted-foreground/25",
              "hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">{file.name}</span>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your audio file here, or{" "}
                  <label className="text-primary hover:text-primary/80 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: MP3, WAV, M4A
                </p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!file}
            onClick={() => {
              // TODO: Handle file upload
              console.log("Uploading file:", file);
            }}
          >
            Upload Recording
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
