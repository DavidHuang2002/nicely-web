import { Goal } from "@/models/goals";
import { sendEmail } from "./resend";
import { GenericEmailTemplate } from "./templates/genericReminder";
import { ReminderSettings } from "@/models/reminder-settings";
import {
  getActiveReminderSettingsByTime,
  getUsersById,
} from "@/lib/database/supabase";
import { getUserEmailAndName } from "@/lib/database/clerk";

/**
 * Sends a reminder email to a user
 */
export async function sendReminderEmail(email: string, firstName: string) {
  const template = <GenericEmailTemplate firstName={firstName} />;
  return sendEmail({
    to: email,
    subject: `Self-Care Reminder`,
    react: template,
  });
}


/**
 * Runs the email reminder job, sending emails to users whose reminder time
 * falls within the current time +/- the specified timeWindow
 *
 * @param timeWindowMinutes Number of minutes before/after the current time to include (default: 15)
 * @returns Object containing job results
 */
export async function runEmailReminderJob(timeWindowMinutes = 15) {
  try {
    console.log(
      `Running email reminder job with ${timeWindowMinutes} minute window`
    );

    // Get current time
    const now = new Date();

    // Step 1: Find all reminder settings that match the current time
    const matchingSettings = await getActiveReminderSettingsByTime(
      now,
      timeWindowMinutes
    );
    console.log(`Found ${matchingSettings.length} matching reminder settings`);

    if (matchingSettings.length === 0) {
      return { total: 0, sent: 0, failed: 0, errors: [] };
    }

    // Step 2: Get user information for these settings
    const userIds = matchingSettings.map((setting) => setting.user_id);
    const users = await getUsersById(userIds);
    console.log(`Found ${users.length} users to send reminders to`);

    // Track results
    const results = {
      total: users.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Step 3: Send emails to each user
    for (const user of users) {
      try {
        // Get user email and name
        const { email, name } = await getUserEmailAndName(user);

        if (!email) {
          throw new Error("No email address found for user");
        }

        const result = await sendReminderEmail(email, name);

        if ("error" in result) {
          throw new Error(result.error.message);
        }

        results.sent++;
        console.log(`Sent reminder email to ${email}`);
      } catch (error) {
        results.failed++;
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.errors.push(
          `Error sending to user ${user.id}: ${errorMessage}`
        );
        console.error(`Failed to send reminder to user ${user.id}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error("Error running email reminder job:", error);
    throw error;
  }
}
