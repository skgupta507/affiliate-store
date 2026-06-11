"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateId } from "@/lib/utils";
import { getRelativeTime } from "@/lib/utils";
import {
  MessageCircle,
  Plus,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
} from "lucide-react";

export default function SupportPage() {
  const { tickets, createTicket, addTicketReply, currentUser, isUserLoggedIn, orders } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [viewTicketId, setViewTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [orderId, setOrderId] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  if (!isUserLoggedIn) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Login Required</h1>
        <p className="text-muted-foreground mb-6">Please log in to access support.</p>
        <Link href="/user-login"><Button>Log In</Button></Link>
      </div>
    );
  }

  const userTickets = tickets.filter((t) => t.userId === (currentUser?.uid || currentUser?.email));
  const viewingTicket = viewTicketId ? tickets.find((t) => t.id === viewTicketId) : null;

  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) return;
    createTicket({
      userId: currentUser?.uid || currentUser?.email || "",
      userName: currentUser?.displayName || "User",
      orderId: orderId || undefined,
      subject: subject.trim(),
      message: message.trim(),
      priority,
    });
    setSubject("");
    setMessage("");
    setOrderId("");
    setShowForm(false);
  };

  const handleReply = () => {
    if (!replyMessage.trim() || !viewTicketId) return;
    addTicketReply(viewTicketId, { message: replyMessage.trim(), isAdmin: false });
    setReplyMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "in_progress": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "closed": return "bg-secondary text-muted-foreground border-border";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  // Viewing a specific ticket
  if (viewingTicket) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setViewTicketId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Tickets
          </button>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{viewingTicket.subject}</h2>
                <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(viewingTicket.createdAt)}</p>
              </div>
              <Badge className={getStatusColor(viewingTicket.status)}>{viewingTicket.status.replace("_", " ")}</Badge>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {/* Original message */}
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-xs font-medium text-foreground mb-1">{viewingTicket.userName}</p>
                <p className="text-sm text-muted-foreground">{viewingTicket.message}</p>
              </div>

              {/* Replies */}
              {viewingTicket.replies.map((reply) => (
                <div key={reply.id} className={`p-4 rounded-xl ${reply.isAdmin ? "bg-primary/5 border border-primary/20 ml-4" : "bg-secondary mr-4"}`}>
                  <p className="text-xs font-medium text-foreground mb-1">
                    {reply.isAdmin ? "Support Team" : "You"}
                  </p>
                  <p className="text-sm text-muted-foreground">{reply.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">{getRelativeTime(reply.createdAt)}</p>
                </div>
              ))}
            </div>

            {/* Reply input */}
            {viewingTicket.status !== "closed" && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <Input
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                />
                <Button onClick={handleReply} className="gap-1 shrink-0">
                  <Send className="w-4 h-4" /> Send
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" /> Support
            </h1>
            <p className="text-sm text-muted-foreground">Get help with your orders and account.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-1">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </motion.div>

        {/* Create Ticket Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 mb-8 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Create Support Ticket</h3>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Related Order (optional)</label>
                <select value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
                  <option value="">None</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>#{o.id.slice(0, 8).toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTicket}>Submit Ticket</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}

        {/* Tickets List */}
        {userTickets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card">
            <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No tickets yet</p>
            <p className="text-sm text-muted-foreground">Create a ticket if you need help.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userTickets.map((ticket) => (
              <motion.button
                key={ticket.id}
                onClick={() => setViewTicketId(ticket.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ticket.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {getRelativeTime(ticket.createdAt)}</span>
                      {ticket.replies.length > 0 && <span>{ticket.replies.length} replies</span>}
                    </div>
                  </div>
                  <Badge className={`shrink-0 text-[10px] ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
