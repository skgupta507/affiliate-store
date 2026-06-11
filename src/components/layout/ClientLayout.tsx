"use client";

import { useStore } from "@/store/useStore";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ToastContainer } from "./ToastContainer";
import { WhatsAppButton } from "./WhatsAppButton";
import { BackToTop } from "./BackToTop";
import { FirestoreSync } from "@/components/FirestoreSync";
import { UserDataSync } from "@/components/UserDataSync";
import { useEffect, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand store to hydrate from localStorage before rendering
  // This prevents hydration mismatch between server (empty state) and client (persisted state)
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  // Show a minimal loading shell until hydration completes
  // This ensures React doesn't mismatch server vs client HTML and break event handlers
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-border bg-background" />
        <main className="pt-0 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <FirestoreSync />
      <UserDataSync />
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <ToastContainer />
    </div>
  );
}
