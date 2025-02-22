import { VoiceRecordingInput } from "../voice-recording-input";

interface SessionRecapInputsProps {
  clientTranscription: string;
  therapistTranscription: string;
  onClientTranscriptionChange: (text: string) => void;
  onTherapistTranscriptionChange: (text: string) => void;
}

export function SessionRecapInputs({
  clientTranscription,
  therapistTranscription,
  onClientTranscriptionChange,
  onTherapistTranscriptionChange,
}: SessionRecapInputsProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Use the last 5-10 minutes of your therapy session to record key insights
        together with your therapist. This collaborative reflection helps ensure
        you capture the most important takeaways.
      </p>

      <div className="space-y-4">
        <VoiceRecordingInput
          transcription={therapistTranscription}
          onTranscriptionChange={onTherapistTranscriptionChange}
          label="Therapist's Comments"
          placeholder="Key points from your therapist..."
        />

        <VoiceRecordingInput
          transcription={clientTranscription}
          onTranscriptionChange={onClientTranscriptionChange}
          label="Your Reflections"
          placeholder="What stood out to me from the session was..."
        />
      </div>
    </div>
  );
}
