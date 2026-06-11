"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Palette, Bell, Shield, Trash2, Globe, Mail, Package, Tag, TrendingDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, toggleTheme, currentUser, isUserLoggedIn, setCurrentUser, clearNotifications, notifications } = useStore();
  const { success } = useToast();

  // Notification preferences (stored locally for demo)
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(true);
  const [emailPriceDrops, setEmailPriceDrops] = useState(true);
  const [emailBackInStock, setEmailBackInStock] = useState(true);

  const handleClearNotifications = () => {
    clearNotifications();
    success("Cleared", "All notifications have been removed.");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setCurrentUser(null);
      success("Account deleted", "Your account has been removed.");
      window.location.href = "/";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="w-5 h-5 text-primary" /> Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">Theme</p>
                      <p className="text-xs text-muted-foreground">Currently using {theme} mode</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    Switch to {theme === "dark" ? "Light" : "Dark"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="w-5 h-5 text-primary" /> Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "orders", label: "Order Updates", desc: "Confirmation, shipping, delivery notifications", icon: Package, checked: emailOrders, onChange: setEmailOrders },
                  { id: "promos", label: "Promotions & Offers", desc: "Sales, new arrivals, coupon codes", icon: Tag, checked: emailPromotions, onChange: setEmailPromotions },
                  { id: "pricedrops", label: "Price Drop Alerts", desc: "Get notified when wishlisted items drop in price", icon: TrendingDown, checked: emailPriceDrops, onChange: setEmailPriceDrops },
                  { id: "backstock", label: "Back in Stock", desc: "Alerts for out-of-stock items you're watching", icon: Bell, checked: emailBackInStock, onChange: setEmailBackInStock },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                    <div className="flex items-center gap-3">
                      <pref.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="text-[10px] text-muted-foreground">{pref.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pref.checked}
                        onChange={(e) => pref.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notifications Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="w-5 h-5 text-primary" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                  <div>
                    <p className="text-sm font-medium text-foreground">Clear All Notifications</p>
                    <p className="text-xs text-muted-foreground">{notifications.length} notification{notifications.length !== 1 ? "s" : ""} stored</p>
                  </div>
                  <Button variant="outline" onClick={handleClearNotifications} disabled={notifications.length === 0}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account / Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-5 h-5 text-primary" /> Privacy & Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                  <div>
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                  <Link href="/forgot-password">
                    <Button variant="outline" size="sm">Change</Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                  <div>
                    <p className="text-sm font-medium text-foreground">Privacy Policy</p>
                    <p className="text-xs text-muted-foreground">Read our data handling practices</p>
                  </div>
                  <Link href="/privacy-policy">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>

                {isUserLoggedIn && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div>
                      <p className="text-sm font-medium text-red-500">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently remove your account and data</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDeleteAccount} className="text-red-500 border-red-500/30 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
