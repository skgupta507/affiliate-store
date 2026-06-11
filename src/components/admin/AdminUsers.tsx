"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { generateId } from "@/lib/utils";
import {
  Users,
  Search,
  UserPlus,
  Shield,
  Ban,
  Trash2,
  ShoppingCart,
  Eye,
} from "lucide-react";

// Admin users management - view orders by user, manage user accounts
export function AdminUsers() {
  const { orders, products, user } = useStore();
  const { success, error } = useToast();
  const [search, setSearch] = useState("");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());

  // Derive users from orders (since we don't have a user database, we aggregate from order data)
  const users = useMemo(() => {
    const userMap: Record<string, { email: string; name: string; orderCount: number; totalSpent: number; lastOrder: string; userId?: string }> = {};
    orders.forEach((o) => {
      const key = o.userId || o.shippingAddress.phone || o.shippingAddress.fullName;
      if (!userMap[key]) {
        userMap[key] = {
          email: o.userId || "",
          name: o.shippingAddress.fullName,
          orderCount: 0,
          totalSpent: 0,
          lastOrder: o.createdAt,
          userId: o.userId,
        };
      }
      userMap[key].orderCount++;
      userMap[key].totalSpent += o.totalAmount;
      if (new Date(o.createdAt) > new Date(userMap[key].lastOrder)) {
        userMap[key].lastOrder = o.createdAt;
      }
    });
    return Object.values(userMap);
  }, [orders]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleBanUser = (email: string, name: string) => {
    if (confirm(`Are you sure you want to ban "${name}" (${email})? They won't be able to place orders.`)) {
      setBannedUsers((prev) => new Set([...prev, email]));
      success("User banned", `${name} has been banned.`);
    }
  };

  const handleUnban = (email: string) => {
    setBannedUsers((prev) => {
      const next = new Set(prev);
      next.delete(email);
      return next;
    });
    success("User unbanned", "User can now place orders again.");
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) {
      error("Email required", "Please enter an admin email.");
      return;
    }
    // In a real app, this would create a user with admin role
    success("Admin added", `${newAdminName || newAdminEmail} has been added as an admin.`);
    setNewAdminEmail("");
    setNewAdminName("");
    setShowAddAdmin(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> User Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} customers from order history</p>
        </div>
        <Button onClick={() => setShowAddAdmin(!showAddAdmin)} className="gap-1.5">
          <UserPlus className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      {/* Add Admin Form */}
      {showAddAdmin && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Add New Admin</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="Admin name" />
                <Input value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="Admin email" type="email" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAdmin} className="gap-1"><Shield className="w-3.5 h-3.5" /> Add Admin</Button>
                <Button variant="outline" onClick={() => setShowAddAdmin(false)}>Cancel</Button>
              </div>
              <p className="text-[10px] text-muted-foreground">The new admin will be able to log in and manage the store.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-10" />
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-medium">No customers found</p>
            <p className="text-sm text-muted-foreground">Users will appear here once orders are placed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((u, i) => {
            const isBanned = bannedUsers.has(u.email);
            return (
              <motion.div
                key={u.email || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={isBanned ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-foreground">{u.name[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                            {isBanned && <Badge variant="destructive" className="text-[9px]">Banned</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{u.email || "No email"}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><ShoppingCart className="w-2.5 h-2.5" /> {u.orderCount} orders</span>
                            <span>₹{u.totalSpent.toLocaleString("en-IN")} spent</span>
                            <span>Last: {new Date(u.lastOrder).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {isBanned ? (
                          <Button size="sm" variant="outline" onClick={() => handleUnban(u.email)} className="gap-1 text-xs h-8">
                            Unban
                          </Button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(u.email, u.name)}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                            title="Ban user"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
