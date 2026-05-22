"use client";

/**
 * Razorpay Payment Integration
 * 
 * To use:
 * 1. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local
 * 2. Add RAZORPAY_KEY_SECRET to your server-side env (for order creation API)
 * 
 * Flow:
 * 1. Create order on server (POST /api/razorpay/create-order)
 * 2. Open Razorpay checkout on client
 * 3. Verify payment on server (POST /api/razorpay/verify)
 */

export interface RazorpayOptions {
  amount: number; // in paise (₹1 = 100 paise)
  currency?: string;
  orderId?: string;
  name?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: unknown) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      close: () => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment(options: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    options.onFailure?.("Failed to load Razorpay SDK");
    return;
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    options.onFailure?.("Razorpay key not configured");
    return;
  }

  const razorpayOptions = {
    key: keyId,
    amount: options.amount,
    currency: options.currency || "INR",
    name: options.name || "TheIdeaDecorator",
    description: options.description || "Purchase from TheIdeaDecorator",
    order_id: options.orderId,
    handler: (response: RazorpayResponse) => {
      options.onSuccess(response);
    },
    prefill: {
      name: options.customerName || "",
      email: options.customerEmail || "",
      contact: options.customerPhone || "",
    },
    theme: {
      color: "#ea580c", // Primary brand color
    },
    modal: {
      ondismiss: () => {
        options.onFailure?.("Payment cancelled by user");
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
}
