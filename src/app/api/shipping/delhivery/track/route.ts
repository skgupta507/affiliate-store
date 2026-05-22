import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/shipping/delhivery/track?waybill=TRACKING_NUMBER
 * Tracks a shipment via Delhivery API (for heavy/bulky items).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const waybill = searchParams.get("waybill");

    if (!waybill) {
      return NextResponse.json({ error: "Waybill number required" }, { status: 400 });
    }

    const token = process.env.DELHIVERY_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Delhivery not configured" }, { status: 500 });
    }

    const baseUrl = process.env.DELHIVERY_MODE === "production"
      ? "https://track.delhivery.com"
      : "https://staging-express.delhivery.com";

    const res = await fetch(`${baseUrl}/api/v1/packages/json/?waybill=${waybill}`, {
      headers: { Authorization: `Token ${token}` },
    });

    const data = await res.json();

    if (!res.ok || !data.ShipmentData?.[0]) {
      return NextResponse.json({ error: "Tracking not found" }, { status: 404 });
    }

    const shipment = data.ShipmentData[0].Shipment;
    return NextResponse.json({
      success: true,
      status: shipment.Status?.Status,
      statusDate: shipment.Status?.StatusDateTime,
      origin: shipment.Origin,
      destination: shipment.Destination,
      expectedDelivery: shipment.ExpectedDeliveryDate,
      activities: shipment.Scans?.map((scan: { ScanDetail: { Scan: string; ScanDateTime: string; ScannedLocation: string } }) => ({
        status: scan.ScanDetail.Scan,
        date: scan.ScanDetail.ScanDateTime,
        location: scan.ScanDetail.ScannedLocation,
      })) || [],
    });
  } catch (err: unknown) {
    console.error("Delhivery track error:", err);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
