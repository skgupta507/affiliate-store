"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MousePointerClick, Tag, TrendingUp, ShoppingCart, DollarSign, Users, BarChart3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function AdminOverview() {
  const { products, categories, orders } = useStore();

  const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
  const featuredCount = products.filter((p) => p.isFeatured).length;
  const trendingCount = products.filter((p) => p.isTrending).length;
  const totalRevenue = orders.reduce((sum, o) => o.status !== "cancelled" ? sum + o.totalAmount : sum, 0);
  const totalOrders = orders.length;
  const affiliateProducts = products.filter((p) => p.isAffiliate).length;
  const directProducts = products.filter((p) => !p.isAffiliate).length;

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
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
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
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      label: "Trending",
      value: trendingCount,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Affiliate",
      value: affiliateProducts,
      icon: BarChart3,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Direct Sell",
      value: directProducts,
      icon: Package,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
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
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary"
                  >
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.platform} • {product.isAffiliate ? "Affiliate" : "Direct"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {product.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No products yet. Add your first product!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} items • {order.status}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet.
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
                    <span className="text-sm text-muted-foreground w-28 truncate">{platform}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                        style={{
                          width: `${(count / products.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {Object.entries(
                  orders.reduce((acc, o) => {
                    acc[o.status] = (acc[o.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                    <span className="text-sm text-muted-foreground capitalize">{status}</span>
                    <span className="text-sm font-bold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
