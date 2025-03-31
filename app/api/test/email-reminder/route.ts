import { NextResponse } from "next/server";
import { runEmailReminderJob } from "@/lib/email/reminder";

export async function GET(request: Request) {
  try {
    // Get window size from query params, default to 15 minutes
    const { searchParams } = new URL(request.url);
    const timeWindowMinutes = parseInt(
      searchParams.get("window") || "15",
      10
    );

    console.log(`Testing email reminder job with ${timeWindowMinutes} minute window`);
    
    // Run the reminder job with the specified window
    const results = await runEmailReminderJob(timeWindowMinutes);
    
    // Return detailed results
    return NextResponse.json({
      success: true,
      results,
      message: `Email reminder test completed. Sent ${results.sent} of ${results.total} emails.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in test email reminder endpoint:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to run test email reminder",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 