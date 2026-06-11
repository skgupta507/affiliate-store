import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || "support@theideadecorator.in";
    await sendEmail({
      to: adminEmail,
      subject: `[Contact Form] ${subject || "New Inquiry"} — from ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #c2410c;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; width: 100px;">From:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject || "General"}</td></tr>
          </table>
          <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-top: 16px;">
            <p style="font-size: 12px; color: #666; margin: 0 0 8px;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">Reply directly to this email to respond to the customer.</p>
        </div>
      `,
    });

    // Send confirmation to customer
    await sendEmail({
      to: email,
      subject: "We received your message — TheIdeaDecorator",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #c2410c, #ea580c); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">TheIdeaDecorator</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555; line-height: 1.6;">Thank you for reaching out! We've received your message and a support ticket has been created. Our team will get back to you within 24 hours.</p>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 12px; color: #666; margin: 0 0 4px;"><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
              <p style="font-size: 12px; color: #666; margin: 0;"><strong>Your message:</strong> ${message.slice(0, 200)}${message.length > 200 ? "..." : ""}</p>
            </div>
            <p style="font-size: 14px; color: #555;">In the meantime, check our <a href="https://theideadecorator.in/faq" style="color: #c2410c;">FAQ page</a> for quick answers.</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">— Team TheIdeaDecorator</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
