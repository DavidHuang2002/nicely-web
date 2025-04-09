import { NextResponse } from "next/server";
import { runEmailReminderJob } from "@/lib/email/reminder";

// add vercel cron job to run this route
// for more info:
// https://vercel.com/docs/cron-jobs/manage-cron-jobs

// Cron job runs every 30 minutes
export const maxDuration = 300; // 5-minute timeout
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify the request is coming from a legitimate cron service
    const authHeader = request.headers.get('authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting email reminder cron job...');
    await runEmailReminderJob();
    console.log('Email reminder cron job completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Email reminder job completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in email reminder cron job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run email reminder job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 