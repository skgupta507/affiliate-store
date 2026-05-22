"use client";

/**
 * Razorpay Standard Web Checkout - Client Integration
 *
 * Flow:
 * 1. Call createRazorpayOrder() to get order_id from our API
 * 2. Open Razorpay modal with openRazorpayCheckout()
 * 3. On success, call verifyRazorpayPayment() to verify signature
 */

export interface RazorpayCheckoutOptions {
  amount: number; // in rupees (will be converted to paise)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  onSuccess: (data: { payment_id: string; order_id: string }) => void;
  onFailure?: (error: string) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      close: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

/**
 * Load the Razorpay checkout.js script
 */
function loadScript(): Promise<boolean> {
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

/**
 * Step 1: Create order via our API route
 */
async function createRazorpayOrder(amountInPaise: number): Promise<{ order_id: string; amount: number; currency: string }> {
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountInPaise }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create order");
  }

  return res.json();
}

/**
 * Step 3: Verify payment signature via our API route
 */
async function verifyRazorpayPayment(response: RazorpayResponse): Promise<boolean> {
  const res = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.verified === true;
}

/**
 * Main function: handles the full Razorpay checkout flow
 * 1. Creates order
 * 2. Opens modal
 * 3. Verifies payment
 * 4. Calls onSuccess or onFailure
 */
export async function initiateRazorpayPayment(options: RazorpayCheckoutOptions): Promise<void> {
  const { amount, customerName, customerEmail, customerPhone, description, onSuccess, onFailure } = options;

  // Load Razorpay script
  const loaded = await loadScript();
  if (!loaded) {
    onFailure?.("Failed to load Razorpay SDK. Check your internet connection.");
    return;
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    onFailure?.("Razorpay key not configured");
    return;
  }

  // Step 1: Create order
  let order: { order_id: string; amount: number; currency: string };
  try {
    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      onFailure?.("Minimum payment amount is ₹1");
      return;
    }
    order = await createRazorpayOrder(amountInPaise);
  } catch (err) {
    onFailure?.(err instanceof Error ? err.message : "Failed to create payment order");
    return;
  }

  // Step 2: Open Razorpay checkout modal
  const razorpayOptions = {
    key: keyId,
    amount: order.amount,
    currency: order.currency,
    name: "TheIdeaDecorator",
    description: description || "Purchase from TheIdeaDecorator",
    order_id: order.order_id,
    handler: async (response: RazorpayResponse) => {
      // Step 3: Verify payment signature
      const verified = await verifyRazorpayPayment(response);
      if (verified) {
        onSuccess({
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
        });
      } else {
        onFailure?.("Payment verification failed. Please contact support.");
      }
    },
    prefill: {
      name: customerName || "",
      email: customerEmail || "",
      contact: customerPhone || "",
    },
    theme: {
      color: "#c2410c",
    },
    modal: {
      ondismiss: () => {
        onFailure?.("Payment cancelled");
      },
    },
  };

  const rzp = new window.Razorpay(razorpayOptions);

  // Handle payment failure event
  rzp.on("payment.failed", (response: unknown) => {
    const err = response as { error?: { description?: string } };
    onFailure?.(err?.error?.description || "Payment failed. Please try again.");
  });

  rzp.open();
}
