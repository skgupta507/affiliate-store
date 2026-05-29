"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-sm text-foreground">
          <span>Chat with us on WhatsApp!</span>
          <button onClick={() => setTooltip(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <a
        href="https://wa.me/917892430507?text=Hi%2C%20I%20have%20a%20question%20about%20TheIdeaDecorator"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all hover:scale-110 animate-pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
