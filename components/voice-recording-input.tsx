import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRecorder } from "@/hooks/use-recorder";
import { RecordingButton } from "@/components/voice-note-recording-button";
import { transcribeAudioBlob } from "@/components/utils/transcribe";

const MAX_RECORDING_DURATION = 60; // 30 minutes max for therapy sessions

interface VoiceRecordingInputProps {
  transcription: string;
  onTranscriptionChange: (text: string) => void;
  placeholder?: string;
  label?: string;
}

export function VoiceRecordingInput({
  transcription,
  onTranscriptionChange,
  placeholder,
  label
}: VoiceRecordingInputProps) {
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
        toast.info("Recording started", {duration: 5000});
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
          onTranscriptionChange(transcribedText);
        }
      }

      toast.success("Recording transcribed", {
        id: "transcription-toast",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to transcribe recording");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <Card className="p-6">
      {label && (
        <h3 className="text-lg font-medium mb-4">{label}</h3>
      )}
      <div className="flex justify-center mb-6">
        <RecordingButton   
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          onStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
        />
      </div>
      <Textarea
        value={transcription}
        onChange={(e) => onTranscriptionChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
    </Card>
  );
} 