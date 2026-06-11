import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

interface OrderEmailRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderDate: string;
}

function generateInvoiceHtml(data: OrderEmailRequest): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">${item.title}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const orderDate = new Date(data.orderDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #c2410c, #ea580c); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TheIdeaDecorator</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Order Confirmation & Invoice</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
      <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Hi <strong>${data.customerName}</strong>,</p>
      <p style="font-size: 14px; color: #555; margin: 0 0 25px; line-height: 1.6;">
        Thank you for shopping with us! Your order has been placed successfully.
      </p>
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="font-size: 12px; color: #666; padding: 4px 0;">Order ID</td><td style="font-size: 12px; color: #333; padding: 4px 0; text-align: right; font-weight: 600;">#${data.orderId.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="font-size: 12px; color: #666; padding: 4px 0;">Date</td><td style="font-size: 12px; color: #333; padding: 4px 0; text-align: right;">${orderDate}</td></tr>
          <tr><td style="font-size: 12px; color: #666; padding: 4px 0;">Payment</td><td style="font-size: 12px; color: #333; padding: 4px 0; text-align: right; text-transform: uppercase;">${data.paymentMethod}</td></tr>
        </table>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead><tr style="background: #f9fafb;">
          <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #666;">Item</th>
          <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #666;">Qty</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #666;">Price</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #666;">Total</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="border-top: 2px solid #c2410c; padding-top: 15px; text-align: right;">
        <p style="font-size: 18px; color: #c2410c; margin: 0; font-weight: 700;">Total: ₹${data.totalAmount.toLocaleString("en-IN")}</p>
      </div>
      <div style="margin-top: 25px; padding: 16px; background: #f9fafb; border-radius: 8px;">
        <p style="font-size: 12px; color: #666; margin: 0 0 8px; font-weight: 600;">SHIPPING TO:</p>
        <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.5;">
          ${data.shippingAddress.fullName}<br>
          ${data.shippingAddress.addressLine1}${data.shippingAddress.addressLine2 ? ", " + data.shippingAddress.addressLine2 : ""}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br>
          Phone: ${data.shippingAddress.phone}
        </p>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 14px; color: #555; margin: 0 0 5px;">Thank you for shopping with <strong>TheIdeaDecorator</strong>!</p>
        <p style="font-size: 12px; color: #999; margin: 0;">If you have any questions, reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderEmailRequest = await request.json();

    if (!data.customerEmail || !data.orderId || !data.items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = generateInvoiceHtml(data);
    const result = await sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmed! #${data.orderId.slice(0, 8).toUpperCase()} — TheIdeaDecorator`,
      html,
    });

    return NextResponse.json({ success: true, message: result.error || "Email sent" });
  } catch (err: unknown) {
    console.error("Send email error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
