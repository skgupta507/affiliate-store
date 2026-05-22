import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/payu/generate-hash
 * Generates the PayU payment hash for secure form submission.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txnid, amount, productinfo, firstname, email, phone } = body;

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!key || !salt) {
      return NextResponse.json({ error: "PayU not configured" }, { status: 500 });
    }

    // PayU hash formula: sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Determine PayU URL (test vs production)
    const isTest = key.startsWith("gt") || process.env.PAYU_MODE === "test";
    const action = isTest
      ? "https://test.payu.in/_payment"
      : "https://secure.payu.in/_payment";

    return NextResponse.json({ hash, key, action });
  } catch (err) {
    console.error("PayU generate-hash error:", err);
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 });
  }
}
