import { currentUser } from "@clerk/nextjs/server";
import { generatePresignedUrl } from "@/lib/aws/s3";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/aac",
  "audio/x-wav"
];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { fileName, fileType, fileSize } = await req.json();

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const { url, key } = await generatePresignedUrl(fileName, fileType);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
