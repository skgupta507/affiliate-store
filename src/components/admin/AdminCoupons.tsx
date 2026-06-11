"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { generateId } from "@/lib/utils";
import { Coupon } from "@/types";
import {
  Ticket,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Copy,
  CheckCircle,
  AlertCircle,
  Percent,
  IndianRupee,
} from "lucide-react";

export function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [description, setDescription] = useState("");
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);

  const resetForm = () => {
    setCode("");
    setDiscount("");
    setType("percentage");
    setMinOrder("");
    setMaxDiscount("");
    setValidUntil("");
    setUsageLimit("");
    setDescription("");
    setFirstOrderOnly(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!code.trim() || !discount) {
      error("Missing fields", "Code and discount are required.");
      return;
    }
    const couponData: Coupon = {
      id: editingId || generateId(),
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      type,
      minOrder: minOrder ? Number(minOrder) : undefined,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      validUntil: validUntil || new Date(Date.now() + 30 * 86400000).toISOString(),
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: editingId ? (coupons.find((c) => c.id === editingId)?.usedCount || 0) : 0,
      isActive: true,
      description: description.trim() || undefined,
      firstOrderOnly,
    };

    if (editingId) {
      updateCoupon(editingId, couponData);
      success("Coupon updated", `Coupon "${couponData.code}" has been updated.`);
    } else {
      addCoupon(couponData);
      success("Coupon created", `Coupon "${couponData.code}" is now active.`);
    }
    resetForm();
  };

  const startEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDiscount(coupon.discount.toString());
    setType(coupon.type);
    setMinOrder(coupon.minOrder?.toString() || "");
    setMaxDiscount(coupon.maxDiscount?.toString() || "");
    setValidUntil(coupon.validUntil ? coupon.validUntil.split("T")[0] : "");
    setUsageLimit(coupon.usageLimit?.toString() || "");
    setDescription(coupon.description || "");
    setFirstOrderOnly(coupon.firstOrderOnly || false);
    setShowForm(true);
  };

  const copyCouponCode = (c: string) => {
    navigator.clipboard.writeText(c);
    success("Copied", `Code "${c}" copied to clipboard.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" /> Coupon Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{coupons.length} coupons created</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-1.5">
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{editingId ? "Edit Coupon" : "Create New Coupon"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Code *</label>
                  <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE20" className="uppercase" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Discount *</label>
                  <Input value={discount} onChange={(e) => setDiscount(e.target.value)} type="number" placeholder="e.g. 20" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as "percentage" | "fixed")} className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min Order (₹)</label>
                  <Input value={minOrder} onChange={(e) => setMinOrder(e.target.value)} type="number" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Discount (₹)</label>
                  <Input value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} type="number" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Valid Until</label>
                  <Input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} type="date" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Usage Limit</label>
                  <Input value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} type="number" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. New year sale" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={firstOrderOnly} onChange={(e) => setFirstOrderOnly(e.target.checked)} className="rounded" />
                First order only
              </label>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-1"><Save className="w-3.5 h-3.5" /> {editingId ? "Update" : "Create"}</Button>
                <Button variant="outline" onClick={resetForm}><X className="w-3.5 h-3.5" /> Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-medium">No coupons yet</p>
            <p className="text-sm text-muted-foreground">Create your first coupon to offer discounts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.validUntil) < new Date();
            const isExhausted = coupon.usageLimit ? coupon.usedCount >= coupon.usageLimit : false;
            return (
              <Card key={coupon.id} className={`${!coupon.isActive || isExpired ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 border-dashed">
                        <span className="text-sm font-bold font-mono text-primary">{coupon.code}</span>
                      </div>
                      <button onClick={() => copyCouponCode(coupon.code)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(coupon)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { deleteCoupon(coupon.id); success("Deleted", "Coupon removed."); }} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {coupon.type === "percentage" ? (
                      <Badge variant="secondary" className="gap-1"><Percent className="w-2.5 h-2.5" /> {coupon.discount}% off</Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1"><IndianRupee className="w-2.5 h-2.5" /> ₹{coupon.discount} off</Badge>
                    )}
                    {coupon.firstOrderOnly && <Badge variant="outline" className="text-[9px]">First order</Badge>}
                    {isExpired && <Badge variant="destructive" className="text-[9px]">Expired</Badge>}
                    {isExhausted && <Badge variant="destructive" className="text-[9px]">Exhausted</Badge>}
                    {!isExpired && !isExhausted && coupon.isActive && <Badge variant="default" className="text-[9px] bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>}
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-0.5">
                    {coupon.minOrder && <p>Min order: ₹{coupon.minOrder}</p>}
                    {coupon.maxDiscount && <p>Max discount: ₹{coupon.maxDiscount}</p>}
                    <p>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                    <p>Used: {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} times</p>
                    {coupon.description && <p className="italic">{coupon.description}</p>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
