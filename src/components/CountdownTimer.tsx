"use client";

import { useState, useEffect, useMemo } from "react";

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Memoize target timestamp to avoid recalculating on every render
  const targetTime = useMemo(() => {
    if (targetDate) return targetDate.getTime();
    // Default: end of today
    const eod = new Date();
    eod.setHours(23, 59, 59, 999);
    return eod.getTime();
  }, [targetDate?.getTime()]);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        <span className="bg-foreground text-background text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>
        <span className="text-foreground font-bold text-xs">:</span>
        <span className="bg-foreground text-background text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
        <span className="text-foreground font-bold text-xs">:</span>
        <span className="bg-foreground text-background text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
