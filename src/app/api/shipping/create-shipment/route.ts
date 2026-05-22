import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/shipping/create-shipment
 * Creates a shipment via Shiprocket API.
 * 
 * Body: {
 *   orderId, orderDate, pickupLocation,
 *   billingName, billingAddress, billingCity, billingState, billingPincode, billingPhone, billingEmail,
 *   items: [{ name, sku, units, sellingPrice }],
 *   paymentMethod: "prepaid" | "cod",
 *   subTotal, weight, length, breadth, height
 * }
 */

let shiprocketToken: string | null = null;
let tokenExpiry = 0;

async function getShiprocketToken(): Promise<string> {
  // Token is valid for 10 days, cache it
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

  if (!res.ok) {
    throw new Error("Shiprocket authentication failed");
  }

  const data = await res.json();
  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days
  return data.token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await getShiprocketToken();

    // Create order on Shiprocket
    const orderPayload = {
      order_id: body.orderId,
      order_date: body.orderDate || new Date().toISOString().split("T")[0],
      pickup_location: body.pickupLocation || "Primary",
      billing_customer_name: body.billingName,
      billing_last_name: "",
      billing_address: body.billingAddress,
      billing_address_2: body.billingAddress2 || "",
      billing_city: body.billingCity,
      billing_pincode: body.billingPincode,
      billing_state: body.billingState,
      billing_country: "India",
      billing_email: body.billingEmail,
      billing_phone: body.billingPhone,
      shipping_is_billing: true,
      order_items: body.items.map((item: { name: string; sku: string; units: number; sellingPrice: number }) => ({
        name: item.name,
        sku: item.sku || `SKU-${Date.now()}`,
        units: item.units,
        selling_price: item.sellingPrice,
      })),
      payment_method: body.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: body.subTotal,
      weight: body.weight || 0.5,
      length: body.length || 20,
      breadth: body.breadth || 15,
      height: body.height || 10,
    };

    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to create shipment" }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      shiprocketOrderId: data.order_id,
      shipmentId: data.shipment_id,
      awb: data.awb_code,
      courier: data.courier_name,
    });
  } catch (err: unknown) {
    console.error("Create shipment error:", err);
    const message = err instanceof Error ? err.message : "Failed to create shipment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
