"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  Package,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { AdminOverview } from "./AdminOverview";
import { AdminProducts } from "./AdminProducts";
import { AdminCategories } from "./AdminCategories";
import { AdminAddProduct } from "./AdminAddProduct";
import { AdminSettings } from "./AdminSettings";
import { AdminOrders } from "./AdminOrders";
import { cn } from "@/lib/utils";

type Tab = "overview" | "products" | "add" | "categories" | "orders" | "settings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { logout, user } = useStore();

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "add" as Tab, label: "Add Product", icon: Plus },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "categories" as Tab, label: "Categories", icon: Tag },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingCart },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.displayName || "Admin"}
            </p>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-2xl bg-card border border-border backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "add" && <AdminAddProduct />}
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "categories" && <AdminCategories />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "settings" && <AdminSettings />}
        </motion.div>
      </div>
    </div>
  );
}
