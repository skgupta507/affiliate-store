import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "TheIdeaDecorator <onboarding@resend.dev>";

/**
 * Send an email using Resend.
 * 
 * Setup:
 * 1. Sign up at https://resend.com (free: 3,000 emails/month)
 * 2. Get your API key from the dashboard
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxxx
 * 4. (Optional) Verify your domain for custom from address
 *    Otherwise use: onboarding@resend.dev (for testing)
 * 
 * Set EMAIL_FROM in .env.local for custom sender:
 *   EMAIL_FROM=TheIdeaDecorator <hello@theideadecorator.in>
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();

  if (!resend) {
    console.log(`[EMAIL SKIPPED] No RESEND_API_KEY configured. Would send to: ${to}, Subject: ${subject}`);
    return { success: true }; // Don't block the flow
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}, ID: ${data?.id}`);
    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
