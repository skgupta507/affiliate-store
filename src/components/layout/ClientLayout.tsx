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
  const theme = useStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }
  }, [theme, mounted]);

  return (
    <>
      <FirestoreSync />
      <UserDataSync />
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      {mounted && <BackToTop />}
      <ToastContainer />
    </>
  );
}
