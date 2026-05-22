"use client";

/**
 * Shiprocket Delivery Integration
 * 
 * To use:
 * 1. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to server env
 * 2. Use the API routes to create shipments and track orders
 * 
 * Shiprocket API docs: https://apidocs.shiprocket.in/
 */

export interface ShipmentStatus {
  id: string;
  orderId: string;
  trackingNumber: string;
  courier: string;
  status: ShipmentStatusType;
  statusDescription: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  timeline: TrackingEvent[];
}

export type ShipmentStatusType =
  | "pickup_pending"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "rto_initiated"
  | "rto_delivered"
  | "cancelled";

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface ShiprocketOrder {
  orderId: string;
  orderDate: string;
  pickupLocation: string;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingPhone: string;
  billingEmail: string;
  shippingIsBilling: boolean;
  items: ShiprocketItem[];
  paymentMethod: "prepaid" | "cod";
  subTotal: number;
  weight: number; // in kg
  length: number; // in cm
  breadth: number; // in cm
  height: number; // in cm
}

export interface ShiprocketItem {
  name: string;
  sku: string;
  units: number;
  sellingPrice: number;
}

/**
 * Get tracking URL for a shipment
 */
export function getTrackingUrl(trackingNumber: string, courier?: string): string {
  if (!trackingNumber) return "#";
  
  // Shiprocket tracking page
  return `https://shiprocket.co/tracking/${trackingNumber}`;
}

/**
 * Get status color for display
 */
export function getStatusColor(status: ShipmentStatusType): string {
  switch (status) {
    case "pickup_pending":
    case "pickup_scheduled":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20";
    case "picked_up":
    case "in_transit":
      return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20";
    case "out_for_delivery":
      return "text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20";
    case "delivered":
      return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20";
    case "rto_initiated":
    case "rto_delivered":
      return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20";
    case "cancelled":
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20";
    default:
      return "text-muted-foreground bg-secondary border-border";
  }
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: ShipmentStatusType): string {
  switch (status) {
    case "pickup_pending": return "Pickup Pending";
    case "pickup_scheduled": return "Pickup Scheduled";
    case "picked_up": return "Picked Up";
    case "in_transit": return "In Transit";
    case "out_for_delivery": return "Out for Delivery";
    case "delivered": return "Delivered";
    case "rto_initiated": return "Return Initiated";
    case "rto_delivered": return "Returned";
    case "cancelled": return "Cancelled";
    default: return status;
  }
}
