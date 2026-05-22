import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payu/failure
 * PayU redirects here after failed payment.
 */
export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL("/checkout?payment=failed", request.url));
}
