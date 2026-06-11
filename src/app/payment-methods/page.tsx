"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, Smartphone, Building, Banknote, Shield, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay instantly using Google Pay, PhonePe, Paytm, or any UPI app. Scan QR or enter UPI ID.",
    icon: Smartphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    features: ["Instant payment", "No extra charges", "Most popular in India"],
  },
  {
    id: "cards",
    name: "Credit / Debit Cards",
    description: "Visa, Mastercard, Rupay cards accepted. EMI options available on select cards.",
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    features: ["All major cards accepted", "EMI available", "3D Secure verified"],
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "Pay directly from your bank account. All major Indian banks supported.",
    icon: Building,
    color: "text-green-500",
    bg: "bg-green-500/10",
    features: ["50+ banks supported", "Secure bank login", "Instant confirmation"],
  },
  {
    id: "wallets",
    name: "Digital Wallets",
    description: "Paytm Wallet, Amazon Pay, Freecharge, and other popular wallets.",
    icon: Smartphone,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    features: ["Quick checkout", "Cashback offers", "No bank details needed"],
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your order arrives at your doorstep. Available on most orders.",
    icon: Banknote,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    features: ["No online payment needed", "Pay at delivery", "₹49 COD fee may apply"],
  },
];

export default function PaymentMethodsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Payment Methods</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We offer multiple secure payment options so you can choose what works best for you.
          </p>
        </motion.div>

        {/* Security Banner */}
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-3 mb-8">
          <Lock className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">256-bit SSL Encrypted Payments</p>
            <p className="text-xs text-muted-foreground">All transactions are secured with industry-standard encryption. Your payment information is never stored on our servers.</p>
          </div>
          <Shield className="w-8 h-8 text-green-500/40 shrink-0" />
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-12">
          {paymentMethods.map((method, i) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${method.bg} flex items-center justify-center shrink-0`}>
                  <method.icon className={`w-6 h-6 ${method.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {method.features.map((feat) => (
                      <span key={feat} className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        <CheckCircle className="w-2.5 h-2.5 text-green-500" /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Partners */}
        <div className="text-center mb-8">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">Powered By</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            <span className="text-lg font-bold text-muted-foreground">Razorpay</span>
            <span className="text-lg font-bold text-muted-foreground">PayU</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-6 rounded-2xl bg-card border border-border">
          <h3 className="text-lg font-bold text-foreground mb-2">Ready to Shop?</h3>
          <p className="text-sm text-muted-foreground mb-4">All payment methods are available at checkout.</p>
          <Link href="/products">
            <Button className="gap-2">Start Shopping <CreditCard className="w-4 h-4" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
