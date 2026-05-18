"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MousePointerClick, Tag, TrendingUp } from "lucide-react";

export function AdminOverview() {
  const { products, categories } = useStore();

  const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
  const featuredCount = products.filter((p) => p.isFeatured).length;
  const trendingCount = products.filter((p) => p.isTrending).length;

  const topProducts = [...products].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  const platformStats = products.reduce((acc, p) => {
    acc[p.platform] = (acc[p.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: MousePointerClick,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Tag,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Trending",
      value: trendingCount,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products by Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-white/40">{product.platform}</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-300">
                      {product.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40 text-center py-8">
                No products yet. Add your first product!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(platformStats).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(platformStats).map(([platform, count]) => (
                  <div key={platform} className="flex items-center gap-3">
                    <span className="text-sm text-white/70 w-24">{platform}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{
                          width: `${(count / products.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/60 w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40 text-center py-8">
                No data available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
