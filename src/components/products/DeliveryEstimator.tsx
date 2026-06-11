"use client";

import { useState } from "react";
import { Truck, MapPin, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeliveryEstimatorProps {
  isAffiliate: boolean;
}

// Simulated delivery estimation based on pincode
function estimateDelivery(pincode: string): { days: number; express: boolean; serviceable: boolean; city?: string } {
  const pin = parseInt(pincode);
  if (isNaN(pin) || pincode.length !== 6) return { days: 0, express: false, serviceable: false };

  // Metro cities (fast delivery)
  if (pin >= 560000 && pin <= 560999) return { days: 2, express: true, serviceable: true, city: "Bangalore" };
  if (pin >= 400000 && pin <= 400999) return { days: 2, express: true, serviceable: true, city: "Mumbai" };
  if (pin >= 110000 && pin <= 110999) return { days: 2, express: true, serviceable: true, city: "Delhi" };
  if (pin >= 600000 && pin <= 600999) return { days: 3, express: true, serviceable: true, city: "Chennai" };
  if (pin >= 700000 && pin <= 700999) return { days: 3, express: true, serviceable: true, city: "Kolkata" };
  if (pin >= 500000 && pin <= 500999) return { days: 3, express: true, serviceable: true, city: "Hyderabad" };
  if (pin >= 380000 && pin <= 380999) return { days: 3, express: true, serviceable: true, city: "Ahmedabad" };
  if (pin >= 411000 && pin <= 411999) return { days: 3, express: true, serviceable: true, city: "Pune" };

  // Tier 2 cities
  if (pin >= 100000 && pin <= 899999) return { days: 5, express: false, serviceable: true };

  // Remote areas
  return { days: 7, express: false, serviceable: true };
}

export function DeliveryEstimator({ isAffiliate }: DeliveryEstimatorProps) {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{ days: number; express: boolean; serviceable: boolean; city?: string } | null>(null);

  if (isAffiliate) return null;

  const handleCheck = () => {
    if (pincode.length !== 6) return;
    setResult(estimateDelivery(pincode));
  };

  const deliveryDate = result ? new Date(Date.now() + result.days * 86400000) : null;

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Truck className="w-4 h-4 text-primary" /> Delivery Information
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={pincode}
            onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setResult(null); }}
            placeholder="Enter pincode"
            className="pl-9 text-sm"
            maxLength={6}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleCheck} disabled={pincode.length !== 6}>
          Check
        </Button>
      </div>

      {result && (
        <div className="mt-3 space-y-2">
          {result.serviceable ? (
            <>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Delivery available {result.city ? `to ${result.city}` : "to this area"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  Estimated delivery by <strong>{deliveryDate?.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</strong>
                  {result.express && <span className="ml-1 text-primary font-medium">(Express available)</span>}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Free delivery on orders above ₹499</p>
            </>
          ) : (
            <p className="text-xs text-red-500">Sorry, delivery is not available to this pincode.</p>
          )}
        </div>
      )}
    </div>
  );
}
