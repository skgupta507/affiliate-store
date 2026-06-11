import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

function generateWelcomeHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #c2410c, #ea580c); border-radius: 12px 12px 0 0; padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TheIdeaDecorator! 🎉</h1>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 20px;">
        Thank you for joining TheIdeaDecorator! We're thrilled to have you as part of our community.
      </p>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 20px;">Here's what you can do:</p>
      <ul style="font-size: 14px; color: #555; line-height: 2; padding-left: 20px; margin: 0 0 25px;">
        <li>🛒 Shop curated home decor products</li>
        <li>❤️ Save items to your wishlist</li>
        <li>🏷️ Get exclusive deals and offers</li>
        <li>⭐ Earn loyalty points on every purchase</li>
        <li>🚚 Enjoy free shipping on orders above ₹499</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://theideadecorator.in/products" style="display: inline-block; background: #c2410c; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Start Shopping</a>
      </div>
      <p style="font-size: 14px; color: #555; margin: 0 0 5px;">Use code <strong style="color: #c2410c;">WELCOME10</strong> for 10% off your first order!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 12px; color: #999; margin: 0;">Happy decorating! — Team TheIdeaDecorator</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const result = await sendEmail({
      to: email,
      subject: "Welcome to TheIdeaDecorator! 🎉",
      html: generateWelcomeHtml(name || "there"),
    });

    return NextResponse.json({ success: true, message: result.error || "Welcome email sent" });
  } catch (err: unknown) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
