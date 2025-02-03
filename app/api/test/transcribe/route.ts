import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws/s3";
import { formatTranscriptionText } from "@/lib/aws/transcribe";

const fileURI = "https://s3.us-east-1.amazonaws.com/nicely-audio-uploads-dev/transcription-4eef9195-42e4-4a0f-b41e-5d0719fa655f-1738512916796.json"

export async function GET() {
  try {
    // const outputKey = "transcription-4eef9195-42e4-4a0f-b41e-5d0719fa655f-1738512432296.json";
    
    // const command = new GetObjectCommand({
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key: outputKey,
    // });

    // const response = await s3Client.send(command);
    // const rawData = await response.Body?.transformToString();
    
    // if (!rawData) {
    //   return NextResponse.json({ error: "No data found" }, { status: 404 });
    // }

    // // Parse the JSON to make sure it's valid
    // const transcriptData = JSON.parse(rawData);

    const transcriptData = await formatTranscriptionText(fileURI);
    console.log("Transcript data: ", transcriptData);

    return NextResponse.json({
      success: true,
      data: transcriptData
    });

  } catch (error) {
    console.error("Error fetching transcription file:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch transcription file",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}