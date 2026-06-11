"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  Trophy,
  Star,
  Gift,
  Crown,
  Gem,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Percent,
  Truck,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const TIER_CONFIG = {
  bronze: { name: "Bronze", icon: Shield, color: "text-amber-700", bg: "bg-amber-700/10", min: 0, pointsMultiplier: 1, perks: ["1 point per ₹10 spent", "Birthday bonus: 50 points"] },
  silver: { name: "Silver", icon: Star, color: "text-gray-400", bg: "bg-gray-400/10", min: 10000, pointsMultiplier: 1.5, perks: ["1.5x points on purchases", "Free shipping on all orders", "Early access to sales"] },
  gold: { name: "Gold", icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10", min: 25000, pointsMultiplier: 2, perks: ["2x points on purchases", "Free shipping always", "Priority support", "Exclusive deals"] },
  platinum: { name: "Platinum", icon: Gem, color: "text-purple-400", bg: "bg-purple-400/10", min: 50000, pointsMultiplier: 3, perks: ["3x points on purchases", "Free express shipping", "Dedicated support", "VIP events access", "Surprise gifts"] },
};

export default function RewardsPage() {
  const { currentUser, isUserLoggedIn, getLoyaltyTier, orders } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isUserLoggedIn) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Join Our Rewards Program</h1>
        <p className="text-muted-foreground mb-6">Log in to start earning points on every purchase.</p>
        <Link href="/user-login"><Button className="gap-2"><Sparkles className="w-4 h-4" /> Log In to Start</Button></Link>
      </div>
    );
  }

  const tier = getLoyaltyTier();
  const tierConfig = TIER_CONFIG[tier];
  const TierIcon = tierConfig.icon;
  const points = currentUser?.loyaltyPoints || 0;
  const totalSpent = currentUser?.totalSpent || 0;
  const referralCode = currentUser?.referralCode || `TID${(currentUser?.uid || currentUser?.email || "").slice(0, 6).toUpperCase()}`;

  // Calculate next tier
  const tiers = Object.entries(TIER_CONFIG);
  const currentTierIdx = tiers.findIndex(([key]) => key === tier);
  const nextTier = currentTierIdx < tiers.length - 1 ? tiers[currentTierIdx + 1] : null;
  const progressToNext = nextTier ? Math.min((totalSpent / nextTier[1].min) * 100, 100) : 100;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" /> Rewards & Loyalty
          </h1>
          <p className="text-muted-foreground mt-1">Earn points on every purchase and unlock exclusive benefits.</p>
        </motion.div>

        {/* Points & Tier Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-amber-500/10 to-purple-500/10 p-6 md:p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${tierConfig.bg} flex items-center justify-center`}>
                    <TierIcon className={`w-8 h-8 ${tierConfig.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Tier</p>
                    <p className={`text-2xl font-bold ${tierConfig.color}`}>{tierConfig.name}</p>
                    <p className="text-xs text-muted-foreground">{tierConfig.pointsMultiplier}x points multiplier</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Available Points</p>
                  <p className="text-4xl font-bold text-foreground">{points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">≈ {formatPrice(points)}</p>
                </div>
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress to {nextTier[1].name}</span>
                    <span>{formatPrice(totalSpent)} / {formatPrice(nextTier[1].min)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressToNext}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Spend {formatPrice(nextTier[1].min - totalSpent)} more to reach {nextTier[1].name}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Spent", value: formatPrice(totalSpent), icon: ShoppingBag, color: "text-blue-400" },
            { label: "Orders", value: orders.length.toString(), icon: TrendingUp, color: "text-green-400" },
            { label: "Points Earned", value: points.toLocaleString(), icon: Star, color: "text-amber-400" },
            { label: "Points Value", value: formatPrice(points), icon: Gift, color: "text-purple-400" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tier Benefits */}
        <h2 className="text-lg font-bold text-foreground mb-4">Tier Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(TIER_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = key === tier;
            return (
              <Card key={key} className={`relative ${isActive ? "border-primary shadow-lg" : ""}`}>
                {isActive && <Badge className="absolute -top-2 -right-2 text-[9px]">Current</Badge>}
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <p className={`text-sm font-bold ${config.color}`}>{config.name}</p>
                  <p className="text-[10px] text-muted-foreground mb-2">Spend {formatPrice(config.min)}+</p>
                  <ul className="space-y-1">
                    {config.perks.map((perk) => (
                      <li key={perk} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <CheckCircle className="w-2.5 h-2.5 text-green-400 shrink-0 mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Referral */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" /> Refer & Earn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Share your referral code with friends. Both of you get 100 bonus points when they make their first purchase!
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground">
                {referralCode}
              </div>
              <Button variant="outline" onClick={copyReferral} className="gap-1 shrink-0">
                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Shop", desc: "Earn 1 point per ₹10 spent on any purchase", icon: ShoppingBag },
                { step: "2", title: "Collect", desc: "Points accumulate automatically in your account", icon: Star },
                { step: "3", title: "Redeem", desc: "Use points as discount on your next order (1 point = ₹1)", icon: Gift },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
