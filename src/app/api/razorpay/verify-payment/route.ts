import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/razorpay/verify-payment
 * Verifies the Razorpay payment signature using HMAC-SHA256.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    // Generate signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    console.error("Razorpay verify-payment error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
