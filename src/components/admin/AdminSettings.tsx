"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Download, Upload, Trash2, Database } from "lucide-react";

export function AdminSettings() {
  const { products, categories } = useStore();
  const { success, error } = useToast();

  const handleExport = () => {
    const data = { products, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affiliatehub-export-${new Date().toISOString().split("T")[0]}.json`;
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
    if (
      confirm(
        "Are you sure you want to delete ALL products? This cannot be undone."
      )
    ) {
      const store = useStore.getState();
      products.forEach((p) => store.deleteProduct(p.id));
      success("All data cleared", "All products have been removed.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
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
              <p className="text-xs text-muted-foreground">
                Download all products and categories as JSON
              </p>
            </div>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">Import Data</p>
              <p className="text-xs text-muted-foreground">
                Import products from a JSON file
              </p>
            </div>
            <Button variant="outline" onClick={handleImport} className="gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-red-300">Clear All Data</p>
              <p className="text-xs text-red-300/50">
                Permanently delete all products
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Type</span>
              <span className="text-foreground">LocalStorage (Browser)</span>
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
