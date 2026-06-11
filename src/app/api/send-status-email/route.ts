import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const STATUS_MESSAGES: Record<string, { subject: string; emoji: string; message: string }> = {
  confirmed: { subject: "Order Confirmed", emoji: "✅", message: "Your order has been confirmed and is being prepared." },
  processing: { subject: "Order Processing", emoji: "📦", message: "Your order is being processed and will be shipped soon." },
  shipped: { subject: "Order Shipped", emoji: "🚚", message: "Great news! Your order has been shipped and is on its way to you." },
  delivered: { subject: "Order Delivered", emoji: "🎉", message: "Your order has been delivered! We hope you love your purchase." },
  cancelled: { subject: "Order Cancelled", emoji: "❌", message: "Your order has been cancelled. If you didn't request this, please contact us." },
};

function generateStatusHtml(customerName: string, orderId: string, status: string, trackingNumber?: string): string {
  const statusInfo = STATUS_MESSAGES[status] || { subject: "Order Update", emoji: "📋", message: "Your order status has been updated." };
  
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #c2410c, #ea580c); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TheIdeaDecorator</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Order Status Update</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Hi <strong>${customerName}</strong>,</p>
      <div style="text-align: center; padding: 25px; background: #f9fafb; border-radius: 12px; margin-bottom: 25px;">
        <p style="font-size: 48px; margin: 0 0 10px;">${statusInfo.emoji}</p>
        <p style="font-size: 18px; font-weight: 700; color: #333; margin: 0 0 5px;">${statusInfo.subject}</p>
        <p style="font-size: 12px; color: #666; margin: 0;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
      </div>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 20px;">${statusInfo.message}</p>
      ${trackingNumber ? `
      <div style="padding: 15px; background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 12px; color: #065f46; margin: 0 0 5px; font-weight: 600;">Tracking Number</p>
        <p style="font-size: 16px; color: #065f46; margin: 0; font-family: monospace;">${trackingNumber}</p>
      </div>` : ""}
      <div style="text-align: center; margin: 25px 0;">
        <a href="https://theideadecorator.in/orders" style="display: inline-block; background: #c2410c; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View Order Details</a>
      </div>
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 12px; color: #999; margin: 0;">Need help? Reply to this email or visit our support page.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, customerName, orderId, status, trackingNumber } = await request.json();
    if (!email || !orderId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const statusInfo = STATUS_MESSAGES[status] || { subject: "Order Update", emoji: "📋", message: "" };

    const result = await sendEmail({
      to: email,
      subject: `${statusInfo.emoji} ${statusInfo.subject} — Order #${orderId.slice(0, 8).toUpperCase()}`,
      html: generateStatusHtml(customerName || "Customer", orderId, status, trackingNumber),
    });

    return NextResponse.json({ success: true, message: result.error || "Status email sent" });
  } catch (err: unknown) {
    console.error("Status email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
