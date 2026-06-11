"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Download, Upload, Trash2, Database, Timer, X, CheckCircle } from "lucide-react";

export function AdminSettings() {
  const { products, categories, flashSaleEnd, setFlashSaleEnd } = useStore();
  const { success, error } = useToast();

  // Flash sale timer form
  const [saleDate, setSaleDate] = useState(flashSaleEnd ? flashSaleEnd.split("T")[0] : "");
  const [saleTime, setSaleTime] = useState(flashSaleEnd ? flashSaleEnd.split("T")[1]?.slice(0, 5) || "23:59" : "23:59");

  const handleSetTimer = () => {
    if (!saleDate) {
      error("Date required", "Please select a date for the flash sale to end.");
      return;
    }
    const endDate = new Date(`${saleDate}T${saleTime}:00`).toISOString();
    setFlashSaleEnd(endDate);
    success("Timer set!", `Flash sale countdown will end on ${new Date(endDate).toLocaleString("en-IN")}`);
  };

  const handleClearTimer = () => {
    setFlashSaleEnd(null);
    setSaleDate("");
    setSaleTime("23:59");
    success("Timer cleared", "Flash sale countdown has been removed.");
  };

  const handleExport = () => {
    const data = { products, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theideadecorator-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success("Data exported", "Your data has been downloaded as JSON.");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.products && Array.isArray(data.products)) {
          const store = useStore.getState();
          data.products.forEach((p: any) => store.addProduct(p));
          success("Data imported", `${data.products.length} products imported.`);
        } else {
          error("Invalid file", "The file does not contain valid product data.");
        }
      } catch {
        error("Import failed", "Could not parse the file.");
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL products? This cannot be undone.")) {
      const store = useStore.getState();
      products.forEach((p) => store.deleteProduct(p.id));
      success("All data cleared", "All products have been removed.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Flash Sale Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            Flash Sale Countdown Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set when the flash sale ends. A countdown timer will appear on the homepage for all visitors.
          </p>

          {flashSaleEnd && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Timer Active</p>
                  <p className="text-xs text-muted-foreground">Ends: {new Date(flashSaleEnd).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearTimer} className="gap-1 text-xs">
                <X className="w-3 h-3" /> Remove
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
              <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">End Time</label>
              <Input type="time" value={saleTime} onChange={(e) => setSaleTime(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSetTimer} className="gap-2">
            <Timer className="w-4 h-4" /> {flashSaleEnd ? "Update Timer" : "Start Timer"}
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">Export Data</p>
              <p className="text-xs text-muted-foreground">Download all products and categories as JSON</p>
            </div>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">Import Data</p>
              <p className="text-xs text-muted-foreground">Import products from a JSON file</p>
            </div>
            <Button variant="outline" onClick={handleImport} className="gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-red-300">Clear All Data</p>
              <p className="text-xs text-red-300/50">Permanently delete all products</p>
            </div>
            <Button variant="destructive" onClick={handleClearAll} className="gap-2">
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Type</span>
              <span className="text-foreground">LocalStorage + Supabase</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Products Stored</span>
              <span className="text-foreground">{products.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Categories</span>
              <span className="text-foreground">{categories.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Size</span>
              <span className="text-foreground">
                {(new Blob([JSON.stringify({ products, categories })]).size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
