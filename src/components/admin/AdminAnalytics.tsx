"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  MousePointer,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Percent,
  PieChart,
} from "lucide-react";

export function AdminAnalytics() {
  const { products, orders, reviews, blogPosts } = useStore();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status !== "cancelled" ? sum + o.totalAmount : sum, 0);
    const totalOrders = orders.filter((o) => o.status !== "cancelled").length;
    const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
    const affiliateProducts = products.filter((p) => p.isAffiliate);
    const directProducts = products.filter((p) => !p.isAffiliate);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Conversion funnel
    const totalViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const cartAddRate = totalViews > 0 ? ((orders.length / totalViews) * 100) : 0;

    // Revenue by month
    const revenueByMonth: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        const month = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + o.totalAmount;
      }
    });

    // Top categories by revenue
    const categoryRevenue: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        o.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            categoryRevenue[product.category] = (categoryRevenue[product.category] || 0) + item.price * item.quantity;
          }
        });
      }
    });

    // Affiliate performance
    const affiliateClicks = affiliateProducts.reduce((sum, p) => sum + p.clicks, 0);
    const estimatedCommission = affiliateClicks * 2.5; // Estimated ₹2.5 per click

    // Platform clicks
    const platformClicks: Record<string, number> = {};
    affiliateProducts.forEach((p) => {
      platformClicks[p.platform] = (platformClicks[p.platform] || 0) + p.clicks;
    });

    // Order status distribution
    const statusDist: Record<string, number> = {};
    orders.forEach((o) => { statusDist[o.status] = (statusDist[o.status] || 0) + 1; });

    // Profit margin (if costPrice available)
    const totalCost = orders.reduce((sum, o) => {
      if (o.status === "cancelled") return sum;
      return sum + o.items.reduce((itemSum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return itemSum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
    }, 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100) : 0;

    return {
      totalRevenue, totalOrders, totalClicks, avgOrderValue, totalViews, cartAddRate,
      affiliateProducts: affiliateProducts.length, directProducts: directProducts.length,
      revenueByMonth, categoryRevenue, affiliateClicks, estimatedCommission,
      platformClicks, statusDist, profitMargin, totalCost,
      totalReviews: reviews.length,
      blogViews: blogPosts.reduce((sum, p) => sum + p.views, 0),
    };
  }, [products, orders, reviews, blogPosts]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Advanced Analytics
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Deep insights into your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "text-green-400", change: "+12%" },
          { label: "Avg Order Value", value: formatPrice(stats.avgOrderValue), icon: Target, color: "text-blue-400", change: "+5%" },
          { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingCart, color: "text-purple-400", change: "+8%" },
          { label: "Profit Margin", value: `${stats.profitMargin.toFixed(1)}%`, icon: Percent, color: "text-amber-400", change: "" },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                {metric.change && (
                  <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                    <ArrowUpRight className="w-2.5 h-2.5" /> {metric.change}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Conversion Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Product Views", value: stats.totalViews, pct: 100 },
              { label: "Affiliate Clicks", value: stats.affiliateClicks, pct: stats.totalViews ? (stats.affiliateClicks / stats.totalViews) * 100 : 0 },
              { label: "Orders Placed", value: stats.totalOrders, pct: stats.totalViews ? (stats.totalOrders / stats.totalViews) * 100 : 0 },
              { label: "Delivered", value: Object.entries(stats.statusDist).find(([k]) => k === "delivered")?.[1] || 0, pct: stats.totalOrders ? ((stats.statusDist["delivered"] || 0) / stats.totalOrders) * 100 : 0 },
            ].map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{step.label}</span>
                  <span className="text-muted-foreground">{typeof step.value === "number" ? step.value.toLocaleString() : step.value} ({step.pct.toFixed(1)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${Math.min(step.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MousePointer className="w-4 h-4 text-primary" /> Affiliate Performance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-lg font-bold text-foreground">{stats.affiliateClicks.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Total Clicks</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-lg font-bold text-foreground">{formatPrice(stats.estimatedCommission)}</p>
                <p className="text-[10px] text-muted-foreground">Est. Commission</p>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground mb-2">By Platform</p>
            {Object.entries(stats.platformClicks)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([platform, clicks]) => {
                const maxClicks = Math.max(...Object.values(stats.platformClicks), 1);
                return (
                  <div key={platform}>
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="text-muted-foreground">{platform}</span>
                      <span className="text-foreground font-medium">{clicks} clicks</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400/60" style={{ width: `${(clicks / maxClicks) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><PieChart className="w-4 h-4 text-primary" /> Revenue by Category</CardTitle></CardHeader>
        <CardContent>
          {Object.keys(stats.categoryRevenue).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No revenue data yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(stats.categoryRevenue)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, revenue]) => {
                  const maxRev = Math.max(...Object.values(stats.categoryRevenue), 1);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-foreground font-medium truncate">{cat}</span>
                          <span className="text-muted-foreground shrink-0">{formatPrice(revenue)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-green-400/60" style={{ width: `${(revenue / maxRev) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Order Status</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.statusDist).map(([status, count]) => {
              const colors: Record<string, string> = {
                pending: "text-amber-400 bg-amber-400/10",
                confirmed: "text-blue-400 bg-blue-400/10",
                processing: "text-purple-400 bg-purple-400/10",
                shipped: "text-cyan-400 bg-cyan-400/10",
                delivered: "text-green-400 bg-green-400/10",
                cancelled: "text-red-400 bg-red-400/10",
                returned: "text-orange-400 bg-orange-400/10",
              };
              const color = colors[status] || "text-muted-foreground bg-secondary";
              return (
                <div key={status} className={`p-3 rounded-lg ${color.split(" ")[1]} text-center`}>
                  <p className={`text-lg font-bold ${color.split(" ")[0]}`}>{count}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{status}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-lg font-bold text-foreground">{stats.totalReviews}</p><p className="text-[10px] text-muted-foreground">Total Reviews</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-lg font-bold text-foreground">{stats.blogViews}</p><p className="text-[10px] text-muted-foreground">Blog Views</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-lg font-bold text-foreground">{stats.affiliateProducts}</p><p className="text-[10px] text-muted-foreground">Affiliate Products</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-lg font-bold text-foreground">{stats.directProducts}</p><p className="text-[10px] text-muted-foreground">Direct Products</p></CardContent></Card>
      </div>
    </div>
  );
}
