import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import { getPublicUrl } from "./s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3";

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

interface Speaker {
  speakerLabel: string;
  startTime: number;
  endTime: number;
}

interface TranscriptSegment {
  startTime: number;
  endTime: number;
  content: string;
}

async function getTranscriptionFile(outputKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: outputKey,
  });

  const response = await s3Client.send(command);
  const str = await response.Body?.transformToString();
  return str || '';
}

const extractKeyFromUri = (uri: string): string => {
  // example: https://s3.us-east-1.amazonaws.com/nicely-audio-uploads-dev/transcription-4eef9195-42e4-4a0f-b41e-5d0719fa655f-1738512916796.json
  // return transcription-4eef9195-42e4-4a0f-b41e-5d0719fa655f-1738512916796.json
  
  const parts = uri.split('/');
  return parts[parts.length - 1];
}

export async function formatTranscriptionText(transcriptFileUri: string): Promise<string> {
  // Extract the key from the S3 URI
  const outputKey = extractKeyFromUri(transcriptFileUri);
  
  // Get the transcription file
  const rawData = await getTranscriptionFile(outputKey);
  const transcriptData = JSON.parse(rawData);
  
  // Extract speakers and segments
  const speakers = transcriptData.results.speaker_labels.segments.map((segment: any) => ({
    speakerLabel: segment.speaker_label,
    startTime: parseFloat(segment.start_time),
    endTime: parseFloat(segment.end_time)
  }));

  const items = transcriptData.results.items.map((item: any) => ({
    startTime: parseFloat(item.start_time),
    endTime: parseFloat(item.end_time),
    content: item.alternatives[0].content
  }));

  // Combine speakers with their text
  let currentSpeaker = '';
  let currentText = '';
  let formattedTranscript = '';

  items.forEach((item: TranscriptSegment) => {
    const speaker = speakers.find(
      (s: Speaker) => item.startTime >= s.startTime && item.startTime <= s.endTime
    );
    
    if (speaker && speaker.speakerLabel !== currentSpeaker) {
      if (currentText) {
        formattedTranscript += currentText + '\n';
      }
      currentSpeaker = speaker.speakerLabel;
      currentText = `${currentSpeaker}: ${item.content}`;
    } else {
      currentText += ' ' + item.content;
    }
  });

  // Add the last segment
  if (currentText) {
    formattedTranscript += currentText;
  }

  return formattedTranscript;
}
