"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package, AlertTriangle, TrendingDown, Search, Filter, Download,
  ArrowUpDown, ChevronUp, ChevronDown, Edit2, Save, X, Check,
  BarChart3, AlertCircle, CheckCircle2, RefreshCcw, BoxSelect,
  Layers, SlidersHorizontal, History
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

type SortKey = "title" | "stock" | "price" | "category" | "sku";
type StockStatus = "all" | "in_stock" | "low_stock" | "out_of_stock";

const LOW_STOCK_THRESHOLD = 10;

function getStockStatus(stock: number | undefined): { label: string; color: string; bg: string } {
  if (stock === undefined || stock === null) return { label: "N/A", color: "text-muted-foreground", bg: "bg-secondary" };
  if (stock === 0) return { label: "Out of Stock", color: "text-red-500", bg: "bg-red-500/10" };
  if (stock <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", color: "text-amber-500", bg: "bg-amber-500/10" };
  return { label: "In Stock", color: "text-green-500", bg: "bg-green-500/10" };
}

interface StockLog {
  id: string;
  productId: string;
  productTitle: string;
  oldStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export function AdminInventory() {
  const { products, updateProduct, categories } = useStore();
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("stock");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editLowThreshold, setEditLowThreshold] = useState("");
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkStock, setBulkStock] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [activeTab, setActiveTab] = useState<"table" | "analytics">("table");

  // Only show non-affiliate (direct sell) products — those are the ones we hold stock for
  const directProducts = products.filter(p => !p.isAffiliate);

  // Computed stats
  const stats = useMemo(() => {
    const inStock = directProducts.filter(p => (p.stock ?? 0) > LOW_STOCK_THRESHOLD).length;
    const lowStock = directProducts.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW_STOCK_THRESHOLD).length;
    const outOfStock = directProducts.filter(p => (p.stock ?? 0) === 0).length;
    const totalValue = directProducts.reduce((sum, p) => sum + ((p.stock ?? 0) * (p.price ?? 0)), 0);
    const totalUnits = directProducts.reduce((sum, p) => sum + (p.stock ?? 0), 0);
    return { inStock, lowStock, outOfStock, totalValue, totalUnits, total: directProducts.length };
  }, [directProducts]);

  // Filter & sort
  const filtered = useMemo(() => {
    let list = [...directProducts];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter(p => {
        const stock = p.stock ?? 0;
        if (statusFilter === "out_of_stock") return stock === 0;
        if (statusFilter === "low_stock") return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
        if (statusFilter === "in_stock") return stock > LOW_STOCK_THRESHOLD;
        return true;
      });
    }

    if (categoryFilter !== "all") {
      list = list.filter(p => p.category === categoryFilter);
    }

    list.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortKey) {
        case "stock": aVal = a.stock ?? -1; bVal = b.stock ?? -1; break;
        case "price": aVal = a.price ?? 0; bVal = b.price ?? 0; break;
        case "category": aVal = a.category; bVal = b.category; break;
        case "sku": aVal = a.sku ?? ""; bVal = b.sku ?? ""; break;
        default: aVal = a.title; bVal = b.title;
      }
      if (typeof aVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [directProducts, search, statusFilter, categoryFilter, sortKey, sortAsc]);

  // Category analytics
  const categoryAnalytics = useMemo(() => {
    const map: Record<string, { total: number; value: number; low: number; out: number }> = {};
    directProducts.forEach(p => {
      if (!map[p.category]) map[p.category] = { total: 0, value: 0, low: 0, out: 0 };
      map[p.category].total += p.stock ?? 0;
      map[p.category].value += (p.stock ?? 0) * (p.price ?? 0);
      if ((p.stock ?? 0) === 0) map[p.category].out++;
      else if ((p.stock ?? 0) <= LOW_STOCK_THRESHOLD) map[p.category].low++;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [directProducts]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditStock(p.stock?.toString() ?? "0");
    setEditSku(p.sku ?? "");
    setEditLowThreshold(LOW_STOCK_THRESHOLD.toString());
    setEditReason("Manual adjustment");
  };

  const saveEdit = (p: Product) => {
    const newStock = parseInt(editStock);
    if (isNaN(newStock) || newStock < 0) {
      error("Invalid value", "Stock must be a non-negative number.");
      return;
    }
    const log: StockLog = {
      id: crypto.randomUUID(),
      productId: p.id,
      productTitle: p.title,
      oldStock: p.stock ?? 0,
      newStock,
      reason: editReason || "Manual adjustment",
      timestamp: new Date().toISOString(),
    };
    setStockLogs(prev => [log, ...prev].slice(0, 100));
    updateProduct(p.id, { stock: newStock, sku: editSku || p.sku });
    success("Stock updated", `${p.title}: ${p.stock ?? 0} → ${newStock} units`);
    setEditingId(null);
  };

  const handleBulkUpdate = () => {
    const qty = parseInt(bulkStock);
    if (isNaN(qty) || qty < 0) { error("Invalid value", "Enter a valid stock quantity."); return; }
    bulkSelected.forEach(id => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const log: StockLog = { id: crypto.randomUUID(), productId: id, productTitle: p.title, oldStock: p.stock ?? 0, newStock: qty, reason: "Bulk update", timestamp: new Date().toISOString() };
      setStockLogs(prev => [log, ...prev].slice(0, 100));
      updateProduct(id, { stock: qty });
    });
    success("Bulk update done", `Updated ${bulkSelected.size} products to ${qty} units.`);
    setBulkSelected(new Set());
    setBulkStock("");
  };

  const exportCSV = () => {
    const header = "SKU,Title,Category,Price,Stock,Status\n";
    const rows = filtered.map(p => {
      const s = getStockStatus(p.stock);
      return `"${p.sku ?? ""}","${p.title}","${p.category}",${p.price ?? 0},${p.stock ?? 0},"${s.label}"`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success("CSV exported", `${filtered.length} products exported.`);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(bulkSelected);
    next.has(id) ? next.delete(id) : next.add(id);
    setBulkSelected(next);
  };

  const selectAll = () => {
    if (bulkSelected.size === filtered.length) setBulkSelected(new Set());
    else setBulkSelected(new Set(filtered.map(p => p.id)));
  };

  if (directProducts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Direct Products</h3>
          <p className="text-sm text-muted-foreground">Add direct-sell products to manage inventory. Affiliate products don't have stock.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Inventory Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage stock levels for your direct-sell products</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowLogs(!showLogs)} className="gap-1.5">
            <History className="w-3.5 h-3.5" /> Logs ({stockLogs.length})
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Products", value: stats.total, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "In Stock", value: stats.inStock, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Out of Stock", value: stats.outOfStock, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Total Units", value: stats.totalUnits.toLocaleString(), icon: BoxSelect, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Value Banner */}
      <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-amber-500/5 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Total Inventory Value</p>
          <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalValue)}</p>
        </div>
        <div className="text-xs text-muted-foreground bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg font-medium">
          {stats.lowStock + stats.outOfStock} products need restocking
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["table", "analytics"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground bg-secondary"}`}>
            {t === "table" ? "Stock Table" : "Analytics"}
          </button>
        ))}
      </div>

      {/* Stock Logs */}
      {showLogs && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Stock Change History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stockLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No stock changes recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stockLogs.map(log => (
                    <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs font-medium truncate">{log.productTitle}</p>
                        <p className="text-muted-foreground text-[11px]">{log.reason}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs shrink-0">
                        <span className="text-muted-foreground">{log.oldStock}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className={log.newStock > log.oldStock ? "text-green-400" : log.newStock < log.oldStock ? "text-red-400" : "text-muted-foreground"}>
                          {log.newStock}
                        </span>
                        <span className="text-muted-foreground/60 ml-2 hidden sm:inline">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "analytics" ? (
        /* Analytics View */
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Stock by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryAnalytics.map(([cat, data]) => {
                  const maxVal = Math.max(...categoryAnalytics.map(c => c[1].total), 1);
                  const pct = Math.round((data.total / maxVal) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-foreground font-medium truncate max-w-[40%]">{cat}</span>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {data.low > 0 && <span className="text-amber-500">{data.low} low</span>}
                          {data.out > 0 && <span className="text-red-500">{data.out} out</span>}
                          <span>{data.total} units</span>
                          <span className="text-primary">{formatPrice(data.value)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert Table */}
          {(stats.lowStock > 0 || stats.outOfStock > 0) && (
            <Card className="border-amber-500/30">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2 text-amber-500"><AlertTriangle className="w-4 h-4" /> Restock Alerts</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {directProducts
                    .filter(p => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
                    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
                    .map(p => {
                      const s = getStockStatus(p.stock);
                      return (
                        <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary text-sm">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                            <div className="min-w-0">
                              <p className="text-foreground text-xs font-medium truncate">{p.title}</p>
                              <p className="text-muted-foreground text-[11px]">{p.category} {p.sku ? `· SKU: ${p.sku}` : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{p.stock ?? 0} left</span>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(p)}>Restock</Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, SKU…" className="pl-9 h-9" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StockStatus)}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            {search || statusFilter !== "all" || categoryFilter !== "all" ? (
              <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); }} className="h-9 gap-1.5">
                <RefreshCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            ) : null}
          </div>

          {/* Bulk Actions */}
          {bulkSelected.size > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30">
              <span className="text-sm font-medium text-primary">{bulkSelected.size} selected</span>
              <Input value={bulkStock} onChange={e => setBulkStock(e.target.value)} placeholder="Set stock qty…" type="number" min="0" className="w-36 h-8" />
              <Button size="sm" onClick={handleBulkUpdate} className="h-8 gap-1">
                <Check className="w-3.5 h-3.5" /> Apply
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setBulkSelected(new Set())} className="h-8 ml-auto text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            </motion.div>
          )}

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left w-10">
                        <input type="checkbox" checked={bulkSelected.size === filtered.length && filtered.length > 0}
                          onChange={selectAll} className="rounded" />
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        <button onClick={() => toggleSort("sku")} className="flex items-center gap-1">SKU <SortIcon col="sku" /></button>
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        <button onClick={() => toggleSort("category")} className="flex items-center gap-1">Category <SortIcon col="category" /></button>
                      </th>
                      <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <button onClick={() => toggleSort("price")} className="flex items-center gap-1 ml-auto">Price <SortIcon col="price" /></button>
                      </th>
                      <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 ml-auto">Stock <SortIcon col="stock" /></button>
                      </th>
                      <th className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No products match your filters.</td>
                      </tr>
                    ) : filtered.map((p) => {
                      const status = getStockStatus(p.stock);
                      const isEditing = editingId === p.id;
                      return (
                        <motion.tr key={p.id} layout
                          className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${bulkSelected.has(p.id) ? "bg-primary/5" : ""}`}>
                          <td className="p-3">
                            <input type="checkbox" checked={bulkSelected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              {p.image && <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 hidden xs:block" />}
                              <div className="min-w-0">
                                <p className="font-medium text-foreground text-xs truncate max-w-[140px] sm:max-w-[200px]">{p.title}</p>
                                {p.brand && <p className="text-[11px] text-muted-foreground">{p.brand}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden sm:table-cell">
                            {isEditing ? (
                              <Input value={editSku} onChange={e => setEditSku(e.target.value)} className="h-7 w-24 text-xs" placeholder="SKU" />
                            ) : (
                              <span className="text-xs text-muted-foreground font-mono">{p.sku || "—"}</span>
                            )}
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className="text-xs text-muted-foreground">{p.category}</span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-xs font-medium text-foreground">{formatPrice(p.price ?? 0)}</span>
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex flex-col gap-1 items-end">
                                <Input
                                  value={editStock}
                                  onChange={e => setEditStock(e.target.value)}
                                  type="number" min="0"
                                  className="h-7 w-20 text-xs text-right"
                                />
                                <Input
                                  value={editReason}
                                  onChange={e => setEditReason(e.target.value)}
                                  className="h-6 w-28 text-[10px]"
                                  placeholder="Reason…"
                                />
                              </div>
                            ) : (
                              <span className={`text-sm font-bold ${(p.stock ?? 0) === 0 ? "text-red-500" : (p.stock ?? 0) <= LOW_STOCK_THRESHOLD ? "text-amber-500" : "text-foreground"}`}>
                                {p.stock ?? 0}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                          </td>
                          <td className="p-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center gap-1 justify-center">
                                <button onClick={() => saveEdit(p)} className="w-7 h-7 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20 transition-colors">
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center hover:bg-accent transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground hover:bg-accent transition-colors mx-auto">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Showing {filtered.length} of {directProducts.length} products</span>
                  <span>Total stock value: <span className="text-foreground font-medium">{formatPrice(stats.totalValue)}</span></span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
