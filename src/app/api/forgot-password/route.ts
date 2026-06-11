import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Simple in-memory OTP store (in production, use Redis or database)
const otpStore: Map<string, { otp: string; expires: number }> = new Map();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOTPHtml(name: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #c2410c, #ea580c); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TheIdeaDecorator</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Password Reset</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px;">
        We received a request to reset your password. Use the OTP below:
      </p>
      <div style="text-align: center; padding: 25px; background: #f9fafb; border-radius: 12px; margin-bottom: 25px;">
        <p style="font-size: 36px; font-weight: 700; color: #c2410c; margin: 0; letter-spacing: 8px; font-family: monospace;">${otp}</p>
        <p style="font-size: 12px; color: #666; margin: 10px 0 0;">Valid for 10 minutes</p>
      </div>
      <p style="font-size: 14px; color: #555; margin: 0 0 20px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 12px; color: #999; margin: 0;">For security, never share this OTP with anyone.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, action, otp: providedOtp } = await request.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Verify OTP action
    if (action === "verify") {
      const stored = otpStore.get(email.toLowerCase());
      if (!stored) return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
      if (Date.now() > stored.expires) {
        otpStore.delete(email.toLowerCase());
        return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
      }
      if (stored.otp !== providedOtp) return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
      otpStore.delete(email.toLowerCase());
      return NextResponse.json({ success: true, message: "OTP verified" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    otpStore.set(email.toLowerCase(), { otp, expires: Date.now() + 10 * 60 * 1000 });

    const result = await sendEmail({
      to: email,
      subject: "Password Reset OTP — TheIdeaDecorator",
      html: generateOTPHtml("User", otp),
    });

    if (!process.env.RESEND_API_KEY) {
      // Dev mode: return OTP in response for testing
      return NextResponse.json({ success: true, message: "OTP generated (dev mode)", devOtp: otp });
    }

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (err: unknown) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
