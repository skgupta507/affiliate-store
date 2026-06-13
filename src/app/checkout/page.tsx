"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, generateId } from "@/lib/utils";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { initiatePayUPayment } from "@/lib/payu";
import { Order, Address } from "@/types";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle,
  Truck,
  Shield,
  Package,
  Ticket,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, products, addresses, addAddress, addOrder, clearCart, isUserLoggedIn, currentUser, updateUserProfile, appliedCoupon, getCouponDiscount, removeCoupon, addLoyaltyPoints } = useStore();
  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.find((a) => a.isDefault) || addresses[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Login guard — redirect to login if not authenticated
  if (!isUserLoggedIn) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary border border-border flex items-center justify-center">
            <Shield className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Login Required</h1>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Please log in or create an account to proceed with checkout.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/user-login">
              <Button>Log In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Address form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const couponDiscount = getCouponDiscount();
  const total = subtotal + deliveryFee - couponDiscount;

  const handleAddAddress = () => {
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) return;
    const newAddress: Address = {
      id: generateId(),
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country: "India",
      isDefault: addresses.length === 0,
    };
    addAddress(newAddress);
    setSelectedAddress(newAddress);
    // Reset form
    setFullName("");
    setPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPincode("");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;

    // COD limit: not available on orders above ₹5,000
    if (paymentMethod === "cod" && total > 5000) {
      return; // Silently block — UI already shows it disabled
    }

    const createOrder = () => {
      const order: Order = {
        id: generateId(),
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.product?.title || "",
          image: item.product?.image || "",
          price: item.product?.price || 0,
          quantity: item.quantity,
        })),
        status: "confirmed",
        totalAmount: total,
        shippingAddress: selectedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
        couponCode: appliedCoupon?.code,
        couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
        userId: currentUser?.uid || currentUser?.email,
        customerEmail: currentUser?.email,
      };

      addOrder(order);
      clearCart();
      removeCoupon();

      // Award loyalty points (1 point per ₹10 spent)
      const pointsEarned = Math.floor(total / 10);
      if (pointsEarned > 0) {
        addLoyaltyPoints(pointsEarned);
      }

      // Update user's total spent
      const profileUpdates: Record<string, unknown> = {
        totalSpent: (currentUser?.totalSpent || 0) + total,
        orderCount: (currentUser?.orderCount || 0) + 1,
      };
      if (!currentUser?.displayName && selectedAddress.fullName) {
        profileUpdates.displayName = selectedAddress.fullName;
      }
      if (!currentUser?.phone && selectedAddress.phone) {
        profileUpdates.phone = selectedAddress.phone;
      }
      updateUserProfile(profileUpdates);

      // Send order confirmation email (fire and forget)
      if (currentUser?.email) {
        fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: currentUser.email,
            customerName: selectedAddress.fullName || currentUser.displayName || "Customer",
            orderId: order.id,
            items: order.items,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
            orderDate: order.createdAt,
          }),
        }).catch((err) => console.error("Failed to send order email:", err));
      }

      setPlacedOrderId(order.id);
      setOrderPlaced(true);
    };

    if (paymentMethod === "razorpay") {
      await initiateRazorpayPayment({
        amount: total,
        description: `Order - ${cartItems.length} items`,
        customerName: selectedAddress.fullName,
        customerPhone: selectedAddress.phone,
        customerEmail: currentUser?.email,
        onSuccess: () => {
          createOrder();
        },
        onFailure: (error) => {
          console.error("Payment failed:", error);
        },
      });
    } else if (paymentMethod === "payu") {
      // PayU: store order details in sessionStorage, create order AFTER successful payment
      const pendingOrder = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.product?.title || "",
          image: item.product?.image || "",
          price: item.product?.price || 0,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress: selectedAddress,
        couponCode: appliedCoupon?.code,
        couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
        userId: currentUser?.uid || currentUser?.email,
        customerEmail: currentUser?.email,
        customerName: selectedAddress.fullName,
      };
      sessionStorage.setItem("pendingPayUOrder", JSON.stringify(pendingOrder));

      try {
        await initiatePayUPayment({
          amount: total,
          productInfo: `Order - ${cartItems.length} items`,
          customerName: selectedAddress.fullName,
          customerEmail: currentUser?.email || "",
          customerPhone: selectedAddress.phone,
          orderId: Date.now().toString(),
        });
        // User gets redirected to PayU — order will be created on /api/payu/success callback
      } catch (err) {
        console.error("PayU payment failed:", err);
        sessionStorage.removeItem("pendingPayUOrder");
      }
    } else {
      createOrder();
    }
  };

  if (orderPlaced) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-sm text-muted-foreground mb-1">
            Order ID: <span className="font-mono font-bold text-foreground">#{placedOrderId.slice(0, 8).toUpperCase()}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Payment: <span className="font-semibold uppercase">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</span>
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
            {paymentMethod === "cod"
              ? "Your order is confirmed. Pay when you receive your delivery."
              : "Payment successful! Your order is confirmed."}
            {currentUser?.email && (
              <span className="block mt-1 text-xs">Confirmation email sent to {currentUser.email}</span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/orders">
              <Button size="lg" className="gap-2">
                <Package className="w-4 h-4" /> View Orders & Invoice
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No items to checkout</h1>
        <Link href="/products">
          <Button>Go Shopping</Button>
        </Link>
      </div>
    );
  }

  // Stock validation: check if any item is out of stock
  const outOfStockItems = cartItems.filter(
    (item) => item.product && !item.product.isAffiliate && item.product.stock !== undefined && item.product.stock < item.quantity
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
        </div>

        {/* Stock Warning */}
        {outOfStockItems.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm font-semibold text-red-500 mb-2">⚠ Some items are out of stock or have limited availability:</p>
            <ul className="space-y-1">
              {outOfStockItems.map((item) => (
                <li key={item.productId} className="text-xs text-red-400">
                  • {item.product?.title} — {item.product?.stock === 0 ? "Out of stock" : `Only ${item.product?.stock} available (you have ${item.quantity})`}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Please update your cart before proceeding.</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["address", "payment", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? "bg-primary text-foreground"
                    : i < ["address", "payment", "confirm"].indexOf(step)
                    ? "bg-green-500 text-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm capitalize ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < 2 && <div className="w-8 h-px bg-secondary" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {step === "address" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                </h2>

                {/* Existing Addresses */}
                {addresses.length > 0 && (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedAddress?.id === addr.id
                            ? "border-primary/50 bg-primary/5"
                            : "border-border bg-card hover:border-border"
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">{addr.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Phone: {addr.phone}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                  <p className="text-sm font-medium text-white/70">Add New Address</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <Input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Input placeholder="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="sm:col-span-2" />
                    <Input placeholder="Address Line 2 (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="sm:col-span-2" />
                    <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                    <Input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  </div>
                  <Button onClick={handleAddAddress} variant="outline" size="sm">
                    Save Address
                  </Button>
                </div>

                <Button
                  onClick={() => setStep("payment")}
                  disabled={!selectedAddress}
                  size="lg"
                  className="w-full gap-2"
                >
                  Continue to Payment <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "Pay Online (Razorpay)", desc: "UPI, Cards, Net Banking, Wallets" },
                    { id: "payu", label: "Pay Online (PayU)", desc: "UPI, Cards, Net Banking, EMI" },
                    { id: "cod", label: "Cash on Delivery", desc: total > 5000 ? `Not available on orders above ₹5,000` : "Pay when you receive" },
                  ].map((method) => {
                    const isCODDisabled = method.id === "cod" && total > 5000;
                    return (
                    <button
                      key={method.id}
                      onClick={() => !isCODDisabled && setPaymentMethod(method.id)}
                      disabled={isCODDisabled}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isCODDisabled
                          ? "border-border bg-secondary opacity-50 cursor-not-allowed"
                          : paymentMethod === method.id
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-card hover:border-border"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{method.label}</p>
                      <p className={`text-xs ${isCODDisabled ? "text-red-400" : "text-muted-foreground"}`}>{method.desc}</p>
                    </button>
                  );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("address")}>
                    Back
                  </Button>
                  <Button onClick={() => setStep("confirm")} size="lg" className="flex-1 gap-2">
                    Review Order <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Confirm Step */}
            {step === "confirm" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" /> Review & Place Order
                </h2>

                {/* Address Summary */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Delivering to:</p>
                  <p className="text-sm font-medium text-foreground">{selectedAddress?.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-card">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                        {item.product?.image && (
                          <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">{item.product?.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("payment")}>
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} size="lg" className="flex-1 gap-2">
                    Place Order • {formatPrice(total)}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({cartItems.length})</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> Coupon</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-400" : "text-foreground"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-foreground font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="w-3 h-3" /> Estimated delivery in 3-5 days
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" /> Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
