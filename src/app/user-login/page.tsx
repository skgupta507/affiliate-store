"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  hasFirebaseConfig,
} from "@/lib/firebase";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, isUserLoggedIn } = useStore();
  const router = useRouter();
  const { error, success, info } = useToast();

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push("/profile");
    }
  }, [isUserLoggedIn, router]);

  if (isUserLoggedIn) {
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (hasFirebaseConfig && auth) {
      try {
        // Check sign-in methods for this email
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0 && !methods.includes("password")) {
          if (methods.includes("google.com")) {
            error(
              "Use Google Sign-In",
              "This email is registered with Google. Please use the Google button to sign in."
            );
            setLoading(false);
            return;
          }
        }

        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        setCurrentUser({
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          isAdmin: false,
          provider: "email",
        });
        success("Welcome back!", `Signed in as ${user.displayName || user.email}`);
        router.push("/profile");
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          error("No account found", "No account exists with this email. Please sign up first.");
        } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          error("Wrong password", "The password is incorrect. Please try again.");
        } else {
          error("Login failed", err.message || "Something went wrong.");
        }
      }
    } else {
      // Demo mode
      setCurrentUser({
        email,
        displayName: email.split("@")[0],
        isAdmin: false,
        provider: "email",
      });
      success("Logged in (demo)!", "Welcome back.");
      router.push("/profile");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (!hasFirebaseConfig || !auth) {
      error("Firebase not configured", "Please add Firebase credentials to use Google Sign-In.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setCurrentUser({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        isAdmin: false,
        provider: "google",
      });
      success("Welcome!", `Signed in as ${user.displayName || user.email}`);
      router.push("/profile");
    } catch (err: any) {
      if (err.code === "auth/account-exists-with-different-credential") {
        info(
          "Account exists with email/password",
          "This email is already registered with a password. Log in with your password first, then you can link Google from your profile."
        );
      } else if (err.code !== "auth/popup-closed-by-user") {
        error("Google sign-in failed", err.message || "Something went wrong.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to access your wishlist and profile
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-3 mb-6"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
