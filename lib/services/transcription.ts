import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws/s3";
import fs from "fs";
const openAIClient = new OpenAI();


export async function transcribeFromS3(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
  });
  
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const response = await fetch(presignedUrl);
  
  const transcription = await openAIClient.audio.transcriptions.create({
    file: response,
    model: "whisper-1",
  });

  return transcription.text;
}

export async function transcribeAudioFile(file: File): Promise<string> {
  const transcription = await openAIClient.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return transcription.text;
} 