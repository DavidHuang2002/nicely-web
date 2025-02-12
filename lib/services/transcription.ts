import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws/s3";

const openAIClient = new OpenAI();


export async function transcribeFromS3(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
  });
  
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const response = await fetch(presignedUrl);
  const audioBlob = await response.blob();
  const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

  return transcribeAudioFile(audioFile);
}

export async function transcribeAudioFile(file: File): Promise<string> {
  const transcription = await openAIClient.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return transcription.text;
} 