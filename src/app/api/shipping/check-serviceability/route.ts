import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/shipping/check-serviceability?pickup=110001&delivery=400001&weight=0.5
 * Checks if delivery is available and gets shipping rates.
 */

let shiprocketToken: string | null = null;
let tokenExpiry = 0;

async function getShiprocketToken(): Promise<string> {
  if (shiprocketToken && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) throw new Error("Shiprocket credentials not configured");

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
    const pickup = searchParams.get("pickup") || "110001"; // Default pickup pincode
    const delivery = searchParams.get("delivery");
    const weight = searchParams.get("weight") || "0.5";

    if (!delivery) {
      return NextResponse.json({ error: "Delivery pincode required" }, { status: 400 });
    }

    const token = await getShiprocketToken();

    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=${weight}&cod=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (!res.ok || !data.data?.available_courier_companies) {
      return NextResponse.json({
        serviceable: false,
        message: "Delivery not available to this pincode",
      });
    }

    const couriers = data.data.available_courier_companies.map((c: {
      courier_name: string;
      rate: number;
      etd: string;
      cod: number;
      estimated_delivery_days: string;
    }) => ({
      name: c.courier_name,
      rate: c.rate,
      etd: c.etd,
      cod: c.cod === 1,
      estimatedDays: c.estimated_delivery_days,
    }));

    return NextResponse.json({
      serviceable: true,
      couriers: couriers.slice(0, 5), // Top 5 options
      cheapest: couriers[0],
    });
  } catch (err: unknown) {
    console.error("Serviceability check error:", err);
    const message = err instanceof Error ? err.message : "Check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
