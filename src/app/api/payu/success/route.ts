import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/payu/success
 * PayU redirects here after successful payment via form POST.
 * Verifies the reverse hash and redirects to the order completion page.
 * 
 * IMPORTANT: Must use 303 status to convert POST → GET redirect,
 * otherwise the browser sends a POST to /orders which returns 405.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const status = formData.get("status") as string;
    const txnid = formData.get("txnid") as string;
    const amount = formData.get("amount") as string;
    const productinfo = formData.get("productinfo") as string;
    const firstname = formData.get("firstname") as string;
    const email = formData.get("email") as string;
    const hash = formData.get("hash") as string;
    const additionalCharges = (formData.get("additionalCharges") as string) || "";

    const salt = process.env.PAYU_MERCHANT_SALT;
    const key = process.env.PAYU_MERCHANT_KEY;

    if (!salt || !key) {
      return NextResponse.redirect(new URL("/orders?payment=error&reason=config", request.url), 303);
    }

    // Reverse hash verification
    let reverseHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    if (additionalCharges) {
      reverseHashString = `${additionalCharges}|${reverseHashString}`;
    }
    const generatedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");

    if (generatedHash === hash && status === "success") {
      return NextResponse.redirect(new URL(`/orders?payment=success&txnid=${txnid}&method=payu`, request.url), 303);
    } else {
      return NextResponse.redirect(new URL(`/orders?payment=failed&reason=hash_mismatch`, request.url), 303);
    }
  } catch (err) {
    console.error("PayU success handler error:", err);
    return NextResponse.redirect(new URL("/orders?payment=error", request.url), 303);
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/orders", request.url), 303);
}
