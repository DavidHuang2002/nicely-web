import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import TestEmail from "./testTemplate";
import { sendReminderEmail } from "@/lib/email/reminder"    

export async function GET(request: Request) {
  try {
    // Get the 'to' email from query params, or use a default test email
    const { searchParams } = new URL(request.url);
    const toEmail = searchParams.get('to') || 'david.j.huang1203@gmail.com';
    
    console.log("Sending test email to:", toEmail);

    const result = await sendReminderEmail(toEmail, "David");

    if ('error' in result) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.id,
      details: `Test email sent to ${toEmail}`
    });

  } catch (error) {
    console.error("Error in test email endpoint:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}
