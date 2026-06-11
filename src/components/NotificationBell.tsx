"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getRelativeTime } from "@/lib/utils";
import {
  Bell,
  X,
  Check,
  Tag,
  Package,
  Gift,
  TrendingDown,
  Megaphone,
} from "lucide-react";
import Link from "next/link";

export function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead, getUnreadCount } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = getUnreadCount();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "price_drop": return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
      case "back_in_stock": return <Package className="w-3.5 h-3.5 text-blue-400" />;
      case "order_update": return <Package className="w-3.5 h-3.5 text-purple-400" />;
      case "promotion": return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
      case "reward": return <Gift className="w-3.5 h-3.5 text-pink-400" />;
      default: return <Bell className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-xl border border-border bg-card shadow-lg z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllNotificationsRead} className="text-[10px] text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-72">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 20).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => { markNotificationRead(notif.id); if (notif.link) setIsOpen(false); }}
                    className={`flex items-start gap-3 p-3 border-b border-border/50 cursor-pointer hover:bg-accent/30 transition-colors ${!notif.isRead ? "bg-primary/5" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {notif.link ? (
                        <Link href={notif.link} className="block">
                          <p className="text-xs font-medium text-foreground">{notif.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                        </Link>
                      ) : (
                        <>
                          <p className="text-xs font-medium text-foreground">{notif.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                        </>
                      )}
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{getRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
