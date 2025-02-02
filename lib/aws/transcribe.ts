import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import { getPublicUrl } from "./s3";

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function startTranscriptionJob(s3Key: string, userId: string) {
  const jobName = `transcription-${userId}-${Date.now()}`;
  const mediaUrl = getPublicUrl(s3Key);

  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    Media: { MediaFileUri: mediaUrl },
    MediaFormat: (s3Key.split(".").pop()?.toLowerCase() || "mp3") as "mp3" | "mp4" | "wav" | "flac",
    LanguageCode: "en-US",
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: 2, // Assuming therapy sessions have 2 speakers
      ShowAlternatives: false,
    },
    OutputBucketName: process.env.AWS_S3_BUCKET_NAME,
  });

  await transcribeClient.send(command);
  return jobName;
}

export async function getTranscriptionStatus(jobName: string) {
  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  });

  const response = await transcribeClient.send(command);
  return response.TranscriptionJob;
}
