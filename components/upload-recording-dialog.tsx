"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { estimateProcessingTime } from "@/lib/utils";

interface UploadRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/aac",
];

export function UploadRecordingDialog({
  open,
  onOpenChange,
}: UploadRecordingDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    if (selectedFile) {
      console.log("File type:", selectedFile.type); // Debug log

      if (ALLOWED_AUDIO_TYPES.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error(
          `Unsupported file type: ${selectedFile.type}. Please use MP3, M4A, or WAV files.`
        );
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      // Get audio duration
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);

      // Wait for metadata to load to get duration
      await new Promise((resolve, reject) => {
        audio.addEventListener("loadedmetadata", resolve);
        audio.addEventListener("error", reject);
        audio.src = objectUrl;
      });

      const durationInSeconds = audio.duration;
      URL.revokeObjectURL(objectUrl);

      const estimatedMinutes = estimateProcessingTime(durationInSeconds);

      // Get presigned URL
      const presignedRes = await fetch("/api/uploads/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      console.log("presignedRes", presignedRes);

      if (!presignedRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { url, key } = await presignedRes.json();

      // Upload to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      // Start processing the uploaded file
      const processRes = await fetch("/api/uploads/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Key: key }),
      });

      if (!processRes.ok) {
        throw new Error("Failed to start processing");
      }

      const { transcriptionId } = await processRes.json();

      // Store transcriptionId in localStorage for tracking
      const pendingTranscriptions = JSON.parse(
        localStorage.getItem("pendingTranscriptions") || "[]"
      );
      pendingTranscriptions.push(transcriptionId);
      localStorage.setItem(
        "pendingTranscriptions",
        JSON.stringify(pendingTranscriptions)
      );

      // Add timestamp storage
      const transcriptionTimestamps = JSON.parse(
        localStorage.getItem("transcriptionTimestamps") || "{}"
      );
      transcriptionTimestamps[transcriptionId] = Date.now();
      localStorage.setItem(
        "transcriptionTimestamps",
        JSON.stringify(transcriptionTimestamps)
      );

      toast.success("Recording uploaded and processing started", {
        description: `We'll notify you when transcription is complete (estimated ${estimatedMinutes} minutes)`,
        duration: 5000,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload recording");
    } finally {
      setIsUploading(false);
    }
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
                      accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/wav,audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: MP3, WAV, M4A
                  {/iOS|iPhone|iPad/.test(navigator.userAgent) && (
                    <span className="block mt-1">
                      On iOS devices, you may need to use the Files app to
                      select audio files. Tap &quot;Browse&quot; and select from
                      Files.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!file || isUploading}
            onClick={uploadFile}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Recording"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
