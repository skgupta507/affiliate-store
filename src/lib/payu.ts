"use client";

/**
 * PayU Payment Integration - Client Side
 * 
 * Flow:
 * 1. Call our API to generate the payment hash
 * 2. Submit a form to PayU's payment page
 * 3. PayU redirects back to our success/failure URL
 */

export interface PayUOptions {
  amount: number; // in rupees
  productInfo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
}

export async function initiatePayUPayment(options: PayUOptions): Promise<void> {
  const { amount, productInfo, customerName, customerEmail, customerPhone, orderId } = options;

  // Get hash from our API
  const res = await fetch("/api/payu/generate-hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      txnid: orderId,
      amount: amount.toFixed(2),
      productinfo: productInfo,
      firstname: customerName,
      email: customerEmail,
      phone: customerPhone,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate payment hash");
  }

  const { hash, key, action } = await res.json();

  // Create and submit form to PayU
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;

  const fields: Record<string, string> = {
    key,
    txnid: orderId,
    amount: amount.toFixed(2),
    productinfo: productInfo,
    firstname: customerName,
    email: customerEmail,
    phone: customerPhone,
    surl: `${window.location.origin}/api/payu/success`,
    furl: `${window.location.origin}/api/payu/failure`,
    hash,
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
