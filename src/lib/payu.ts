"use client";

/**
 * PayU Hosted Checkout Integration
 * 
 * Flow:
 * 1. Call /api/payu/generate-hash to get the hash + payment URL
 * 2. Create a hidden form with all required params
 * 3. Submit the form — browser redirects to PayU payment page
 * 4. After payment, PayU POSTs to surl (success) or furl (failure)
 */

export interface PayUOptions {
  amount: number;
  productInfo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
}

export async function initiatePayUPayment(options: PayUOptions): Promise<void> {
  const { amount, productInfo, customerName, customerEmail, customerPhone, orderId } = options;

  // Step 1: Get hash from our backend
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
    const err = await res.json();
    throw new Error(err.error || "Failed to generate payment hash");
  }

  const { hash, key, action } = await res.json();

  // Step 2: Create form and submit to PayU
  // Remove any existing PayU form
  const existingForm = document.getElementById("payu-payment-form");
  if (existingForm) existingForm.remove();

  const form = document.createElement("form");
  form.id = "payu-payment-form";
  form.method = "POST";
  form.action = action;
  form.style.display = "none";

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
    // Optional but recommended
    lastname: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zipcode: "",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  // Step 3: Append to body and submit
  document.body.appendChild(form);
  form.submit();
}
