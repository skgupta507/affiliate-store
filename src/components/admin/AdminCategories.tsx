"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { generateId } from "@/lib/utils";

export function AdminCategories() {
  const { categories, addCategory, deleteCategory, products } = useStore();
  const { success, error } = useToast();
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) {
      error("Name required", "Please enter a category name.");
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      error("Already exists", "A category with this name already exists.");
      return;
    }

    addCategory({
      id: generateId(),
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
    });
    success("Category added", `"${newName.trim()}" has been created.`);
    setNewName("");
  };

  const handleDelete = (id: string, name: string) => {
    const productCount = products.filter((p) => p.category === name).length;
    if (productCount > 0) {
      error(
        "Cannot delete",
        `This category has ${productCount} products. Remove them first.`
      );
      return;
    }
    if (confirm(`Delete category "${name}"?`)) {
      deleteCategory(id);
      success("Category deleted", `"${name}" has been removed.`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories ({categories.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new */}
        <div className="flex gap-2 mb-6">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1"
          />
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category.name).length;
            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "product" : "products"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id, category.name)}
                  className="h-8 w-8 text-white/30 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
