"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  LogOut,
  Heart,
  List,
  Plus,
  Trash2,
  Edit2,
  Camera,
  Clock,
  Package,
  Check,
  X,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

export default function ProfilePage() {
  const {
    currentUser,
    isUserLoggedIn,
    setCurrentUser,
    updateUserProfile,
    wishlist,
    watchlists,
    createWatchlist,
    deleteWatchlist,
    renameWatchlist,
    removeFromWatchlist,
    toggleWishlist,
    products,
    recentlyViewed,
    orders,
  } = useStore();
  const router = useRouter();
  const { success, error } = useToast();

  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push("/user-login");
    }
  }, [isUserLoggedIn, router]);

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "watchlists" | "history" | "password">("profile");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.displayName || "");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  if (!isUserLoggedIn) {
    return null;
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id));

  const handleUpdateName = () => {
    if (newName.trim()) {
      updateUserProfile({ displayName: newName.trim() });
      success("Name updated", "Your display name has been changed.");
    }
    setEditingName(false);
  };

  const handleUpdatePhoto = () => {
    if (newPhotoURL.trim()) {
      updateUserProfile({ photoURL: newPhotoURL.trim() });
      success("Photo updated", "Your profile picture has been changed.");
      setNewPhotoURL("");
    }
  };

  const handleCreateWatchlist = () => {
    if (!newWatchlistName.trim()) {
      error("Name required", "Please enter a name for the watchlist.");
      return;
    }
    createWatchlist(newWatchlistName.trim());
    success("Watchlist created", `"${newWatchlistName.trim()}" has been created.`);
    setNewWatchlistName("");
  };

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      renameWatchlist(id, renameValue.trim());
      success("Renamed", "Watchlist has been renamed.");
    }
    setRenamingId(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    success("Logged out", "See you next time!");
    router.push("/");
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "watchlists" as const, label: "Watchlists", icon: List },
    { id: "history" as const, label: "History", icon: Clock },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-foreground text-xl font-bold">
                  {(currentUser?.displayName || currentUser?.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {currentUser?.displayName || "User"}
              </h1>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              {currentUser?.provider && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {currentUser.provider === "google" ? "Google Account" : "Email Account"}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </motion.div>

        {/* Account Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <p className="text-lg font-bold text-foreground">{orders.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Orders</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <p className="text-lg font-bold text-foreground">{formatPrice(currentUser?.totalSpent || 0)}</p>
            <p className="text-[10px] text-muted-foreground">Total Spent</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <p className="text-lg font-bold text-foreground">{currentUser?.loyaltyPoints || 0}</p>
            <p className="text-[10px] text-muted-foreground">Loyalty Points</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <p className="text-lg font-bold text-foreground">{wishlist.length}</p>
            <p className="text-[10px] text-muted-foreground">Wishlist Items</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-2xl bg-card border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Name */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-card">
                  <div>
                    <p className="text-sm font-medium text-foreground">Display Name</p>
                    {editingName ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="h-8 w-48"
                          onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                        />
                        <Button size="sm" variant="ghost" onClick={handleUpdateName}>
                          <Check className="w-4 h-4 text-green-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>
                          <X className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentUser?.displayName || "Not set"}
                      </p>
                    )}
                  </div>
                  {!editingName && (
                    <Button variant="ghost" size="sm" onClick={() => { setEditingName(true); setNewName(currentUser?.displayName || ""); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Profile Photo */}
                <div className="p-4 rounded-xl bg-card">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Profile Photo
                  </p>
                  {currentUser?.provider === "google" && currentUser.photoURL && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Currently using your Google profile photo.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={newPhotoURL}
                      onChange={(e) => setNewPhotoURL(e.target.value)}
                      placeholder="Paste image URL for profile photo"
                      className="flex-1"
                    />
                    <Button onClick={handleUpdatePhoto} disabled={!newPhotoURL.trim()}>
                      Update
                    </Button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="p-4 rounded-xl bg-card">
                  <p className="text-sm font-medium text-foreground mb-3">Account Info</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{currentUser?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="text-foreground capitalize">{currentUser?.provider || "local"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wishlist Items</span>
                      <span className="text-foreground">{wishlist.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Watchlists</span>
                      <span className="text-foreground">{watchlists.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-semibold text-foreground mb-6">
              My Orders ({orders.length})
            </h2>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 20).map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <Badge variant={order.status === "delivered" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"} className="text-[10px] capitalize">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.productId} className="flex items-center gap-2 text-xs">
                            {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />}
                            <span className="text-muted-foreground truncate flex-1">{item.title} × {item.quantity}</span>
                            <span className="text-foreground font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && <p className="text-[10px] text-muted-foreground">+{order.items.length - 3} more items</p>}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground capitalize">Payment: {order.paymentMethod}</span>
                        <span className="text-sm font-bold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet.</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-4">Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                My Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            {wishlistProducts.length > 0 ? (
              <ProductGrid products={wishlistProducts} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">Your wishlist is empty.</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-4">Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Watchlists Tab */}
        {activeTab === "watchlists" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Create new */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    placeholder="New watchlist name (e.g. 'Tech Deals')"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateWatchlist()}
                    className="flex-1"
                  />
                  <Button onClick={handleCreateWatchlist} className="gap-2">
                    <Plus className="w-4 h-4" /> Create
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Watchlists */}
            {watchlists.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <List className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No watchlists yet. Create one above!</p>
                </CardContent>
              </Card>
            ) : (
              watchlists.map((wl) => {
                const wlProducts = products.filter((p) => wl.productIds.includes(p.id));
                return (
                  <Card key={wl.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        {renamingId === wl.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="h-8 w-48"
                              onKeyDown={(e) => e.key === "Enter" && handleRename(wl.id)}
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleRename(wl.id)}>
                              <Check className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setRenamingId(null)}>
                              <X className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        ) : (
                          <CardTitle className="text-base flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            {wl.name}
                            <Badge variant="secondary" className="text-[10px]">
                              {wl.productIds.length} items
                            </Badge>
                          </CardTitle>
                        )}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/30 hover:text-foreground"
                            onClick={() => { setRenamingId(wl.id); setRenameValue(wl.name); }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/30 hover:text-red-400"
                            onClick={() => {
                              if (confirm(`Delete watchlist "${wl.name}"?`)) {
                                deleteWatchlist(wl.id);
                                success("Deleted", `"${wl.name}" has been removed.`);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {wlProducts.length > 0 ? (
                        <div className="space-y-2">
                          {wlProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-card">
                              {p.image && (
                                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate">{p.title}</p>
                                <p className="text-xs text-muted-foreground">{p.platform}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-white/30 hover:text-red-400"
                                onClick={() => {
                                  removeFromWatchlist(wl.id, p.id);
                                  success("Removed", `Removed from "${wl.name}"`);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No products in this watchlist yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Recently Viewed ({recentProducts.length})
            </h2>
            {recentProducts.length > 0 ? (
              <ProductGrid products={recentProducts} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No recently viewed products.</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-4">Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
