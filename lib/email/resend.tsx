import { Resend } from 'resend';
import { JournalReminderTemplate } from './templates/test';

// Error types for better error handling
export type EmailError = {
  code: string;
  message: string;
  originalError?: unknown;
};

// Configuration type for email sending
export type EmailConfig = {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  text?: string;
  from?: string;
  replyTo?: string;
};

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(resendApiKey);

// Default sender email
const DEFAULT_FROM_EMAIL = 'Nicely <auto.messages@nicely.tech>'

/**
 * Sends an email using Resend
 * @param config Email configuration
 * @returns Promise with the email ID if successful, or an error if failed
 */
export async function sendEmail(config: EmailConfig): Promise<{ id: string } | { error: EmailError }> {
  try {
    console.log("Config:", config);

    const { data, error } = await resend.emails.send({
      from: config.from || DEFAULT_FROM_EMAIL,
      to: config.to,
      subject: config.subject,
      react: config.react,
    });

    if (error) {
      console.error('Error sending email:', error);
      console.log("Data:", data);
      return {
        error: {
          code: 'RESEND_API_ERROR',
          message: 'Failed to send email',
          originalError: error,
        },
      };
    }

    return { id: data?.id || '' };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return {
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred while sending email',
        originalError: error,
      },
    };
  }
} 