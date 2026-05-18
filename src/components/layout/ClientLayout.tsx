"use client";

import { useStore } from "@/store/useStore";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ToastContainer } from "./ToastContainer";
import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className={theme === "light" ? "light" : ""}>
      <Navbar />
      <main className="pt-24 min-h-screen">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
