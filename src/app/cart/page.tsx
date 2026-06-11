"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  Ticket,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity, clearCart, isUserLoggedIn, appliedCoupon, applyCoupon, removeCoupon, getCouponDiscount } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const savings = cartItems.reduce((sum, item) => {
    const original = item.product?.originalPrice || item.product?.price || 0;
    const current = item.product?.price || 0;
    return sum + (original - current) * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const couponDiscount = getCouponDiscount();
  const total = subtotal + deliveryFee - couponDiscount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode.trim());
    setCouponMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setCouponCode("");
    setTimeout(() => setCouponMessage(null), 5000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary border border-border flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Start shopping to find amazing deals!
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Shopping Cart ({cartItems.length} items)
          </h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive/80 gap-1">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl border border-border bg-card backdrop-blur-sm"
              >
                {/* Image */}
                <Link href={`/products/${item.productId}`} className="shrink-0">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-card">
                    {item.product?.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-sm font-semibold text-foreground hover:text-purple-300 transition-colors line-clamp-2">
                      {item.product?.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.product?.platform} • {item.product?.category}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(item.product?.price || 0)}
                    </span>
                    {item.product?.originalPrice && item.product.originalPrice > (item.product.price || 0) && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/20 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/20 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-destructive/60 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Savings
                    </span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3 h-3" /> Coupon ({appliedCoupon?.code})
                    </span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Delivery
                  </span>
                  <span className={deliveryFee === 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-muted-foreground/60">
                    Free delivery on orders above ₹499
                  </p>
                )}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-border pt-4 space-y-3">
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-primary" /> Apply Coupon
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div>
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {appliedCoupon.type === "percentage" ? `${appliedCoupon.discount}% off` : `₹${appliedCoupon.discount} off`}
                      </p>
                    </div>
                    <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="text-xs uppercase"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyCoupon} className="shrink-0">
                      Apply
                    </Button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`text-[11px] flex items-center gap-1 ${couponMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
                    {couponMessage.type === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {couponMessage.text}
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-foreground font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href={isUserLoggedIn ? "/checkout" : "/user-login"} className="block">
                <Button size="lg" className="w-full gap-2">
                  {isUserLoggedIn ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/products" className="block">
                <Button variant="outline" size="sm" className="w-full gap-1 text-muted-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
