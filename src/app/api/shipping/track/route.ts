import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/shipping/track?awb=TRACKING_NUMBER
 * Tracks a shipment via Shiprocket API.
 */

let shiprocketToken: string | null = null;
let tokenExpiry = 0;

async function getShiprocketToken(): Promise<string> {
  if (shiprocketToken && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials not configured");
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Shiprocket authentication failed");

  const data = await res.json();
  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
  return data.token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get("awb");

    if (!awb) {
      return NextResponse.json({ error: "AWB tracking number required" }, { status: 400 });
    }

    const token = await getShiprocketToken();

    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Tracking failed" }, { status: res.status });
    }

    // Parse tracking data
    const tracking = data.tracking_data;
    return NextResponse.json({
      success: true,
      status: tracking?.shipment_status_id,
      statusText: tracking?.shipment_status,
      currentLocation: tracking?.current_status,
      estimatedDelivery: tracking?.etd,
      courier: tracking?.courier_name,
      activities: tracking?.shipment_track_activities || [],
    });
  } catch (err: unknown) {
    console.error("Track shipment error:", err);
    const message = err instanceof Error ? err.message : "Tracking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
