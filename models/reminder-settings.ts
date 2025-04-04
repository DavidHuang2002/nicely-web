import { z } from "zod";

// Base schema with common fields (now user_id is the primary identifier)
const ReminderSettingsBaseSchema = z.object({
  user_id: z
    .string()
    .uuid()
    .describe("UUID of the user who owns these reminder settings (primary key)"),
  enabled: z
    .boolean()
    .default(false)
    .describe("Whether daily reminders are enabled"),
  time: z
    .string()
    // ensure time is in format HH:MM or HH:MM:SS.
    .regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(?::[0-5][0-9])?$/, "Time must be in format HH:MM or HH:MM:SS")

    // transform HH:MM:SS to HH:MM
    .transform((val) => {
      // Extract hours and minutes and ensure proper format
      const timeMatch = val.match(/^(\d{1,2}):(\d{1,2})/);
      if (timeMatch) {
        const [_, hours, minutes] = timeMatch;
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      return val;
    })
    .describe("Time of day for the reminder in 24-hour format (HH:MM)"),
  timezone: z
    .string()
    .describe("IANA timezone identifier (e.g., America/New_York)"),
});

// Schema for creating/updating reminder settings
export const CreateReminderSettingsSchema = ReminderSettingsBaseSchema;

// Full schema including database-generated fields
export const ReminderSettingsSchema = ReminderSettingsBaseSchema.extend({
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Type inference
export type CreateReminderSettings = z.infer<typeof CreateReminderSettingsSchema>;
export type ReminderSettings = z.infer<typeof ReminderSettingsSchema>; 