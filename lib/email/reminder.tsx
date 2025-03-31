import { Goal } from "@/models/goals";
import { sendEmail } from "./resend";
import { JournalReminderTemplate } from "./templates/test";
import { GenericEmailTemplate } from "./templates/genericReminder";

export async function sendReminderEmail(email: string, firstName: string) {
  const template = <GenericEmailTemplate firstName={firstName} />;
  return sendEmail({
    to: email,
    subject: `Self-Care Reminder`,
    react: template,
  });
}

export async function runEmailReminderJob() {
  const users = [
    {
      email: "test@test.com",
      firstName: "Test",
    },
  ];

  for (const user of users) {
    await sendReminderEmail(user.email, user.firstName);
  }
}
