import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay order for payment
 * 
 * Body: { amount: number (in paise), receipt: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, receipt } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: receipt || `order_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Razorpay error: ${error}` },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
