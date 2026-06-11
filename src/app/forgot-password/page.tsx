"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { KeyRound, Mail, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import { auth, sendPasswordResetEmail, hasFirebaseConfig } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // If Firebase is configured, use its built-in reset
    if (hasFirebaseConfig && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        success("Reset link sent!", "Check your email for the password reset link.");
        setStep("success");
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          error("Not found", "No account found with this email.");
        } else {
          error("Error", err.message || "Failed to send reset email.");
        }
      }
    } else {
      // Use our OTP API for demo/non-Firebase mode
      try {
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          success("OTP Sent", data.devOtp ? `Dev OTP: ${data.devOtp}` : "Check your email for the OTP.");
          setStep("otp");
        } else {
          error("Error", data.error || "Failed to send OTP.");
        }
      } catch {
        error("Error", "Network error. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "verify", otp }),
      });
      const data = await res.json();
      if (data.success) {
        success("Verified!", "OTP verified successfully. You can now set a new password.");
        setStep("success");
      } else {
        error("Invalid OTP", data.error || "Please check and try again.");
      }
    } catch {
      error("Error", "Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="p-8 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-2xl">
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email and we'll send you {hasFirebaseConfig ? "a reset link" : "an OTP"} to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : hasFirebaseConfig ? "Send Reset Link" : "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Enter OTP</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">OTP Code</label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <button type="button" onClick={() => setStep("email")} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                  Didn't receive it? Send again
                </button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {hasFirebaseConfig ? "Reset Link Sent!" : "Password Reset Successful"}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {hasFirebaseConfig
                  ? "Check your email for the password reset link. It may take a few minutes."
                  : "Your password has been reset. You can now log in with your new password."}
              </p>
              <Link href="/user-login">
                <Button size="lg" className="w-full">Back to Login</Button>
              </Link>
            </div>
          )}

          {step !== "success" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link href="/user-login" className="text-primary hover:text-primary/80 flex items-center gap-1 justify-center">
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
