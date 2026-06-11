import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payu/failure
 * PayU redirects here after failed/cancelled payment.
 * Uses 303 to convert POST → GET redirect.
 */
export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL("/checkout?payment=failed", request.url), 303);
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/checkout?payment=failed", request.url), 303);
}
