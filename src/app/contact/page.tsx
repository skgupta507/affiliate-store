"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, MapPin, Clock, Phone, Send, ChevronDown, ChevronUp,
  MessageCircle, ExternalLink, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store/useStore";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days across India. Express delivery (2–3 days) is available for select pin codes. You can track your order from the Orders page."
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day easy return policy for all direct purchases. Products must be unused and in original packaging. Affiliate-linked products follow the return policy of the respective seller."
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you'll receive a tracking number via email. You can also visit the Orders section in your account to see live tracking."
  },
  {
    q: "Do you ship outside India?",
    a: "Currently we ship only within India. We're working on expanding international shipping — stay tuned!"
  },
  {
    q: "How do I cancel an order?",
    a: "Orders can be cancelled within 24 hours of placement, as long as they haven't been shipped. Go to My Orders → Select Order → Request Cancellation, or write to us at support@theideadecorator.in."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, Net Banking, Credit/Debit Cards, and Cash on Delivery (COD) for eligible orders. All payments are secured via Razorpay."
  },
  {
    q: "Are the products authentic?",
    a: "Yes, all products sold directly by TheIdeaDecorator are 100% authentic and quality-checked. Affiliate links lead to trusted platforms like Amazon and Flipkart."
  },
];

const socialLinks = [
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/917892430507?text=Hi%2C%20I%20need%20help%20with%20my%20order", color: "text-green-500", bg: "bg-green-500/10 hover:bg-green-500/20" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/theideadecorator", color: "text-pink-500", bg: "bg-pink-500/10 hover:bg-pink-500/20" },
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/theideadecorator", color: "text-blue-500", bg: "bg-blue-500/10 hover:bg-blue-500/20" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@theideadecorator", color: "text-red-500", bg: "bg-red-500/10 hover:bg-red-500/20" },
  { name: "Pinterest", icon: "pinterest", href: "https://www.pinterest.com/theideadecorator", color: "text-red-600", bg: "bg-red-600/10 hover:bg-red-600/20" },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
  { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { success, error: toastError } = useToast();
  const { createTicket, currentUser, isUserLoggedIn } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);

    // 1. Create a support ticket in the store
    createTicket({
      userId: currentUser?.uid || currentUser?.email || email,
      userName: name.trim(),
      subject: subject || "Contact Form Inquiry",
      message: message.trim(),
      priority: "medium",
    });

    // 2. Send email notification (fire and forget)
    try {
      await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject || "Contact Form Inquiry",
          message: message.trim(),
        }),
      });
    } catch {
      // Don't block UX if email fails
    }

    success("Message sent!", "We've received your message and created a support ticket. We'll get back to you within 24 hours.");
    setSubmitted(true);
    setName(""); setEmail(""); setSubject(""); setMessage("");
    setLoading(false);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-amber-50/50 dark:from-primary/5 dark:via-background dark:to-amber-950/20 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Mail className="w-4 h-4" /> We're here to help
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Have a question about your order, a product, or just want to say hello? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Replies within 24 hours</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Friendly support team</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Based in Bangalore</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Contact Info + Form */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Info Cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>

              <a 
              href="mailto:support@theideadecorator.in"
              className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
>
  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
    <Mail className="w-5 h-5 text-primary" />
  </div>

  <div>
    <p className="text-sm font-semibold text-foreground mb-0.5">
      Email Us
    </p>

    {/* Owner Name */}
    <p className="text-sm font-medium text-foreground">
      Sunil Kumar Gupta
    </p>

    {/* Email */}
    <p className="text-primary text-sm font-medium">
      support@theideadecorator.in
    </p>

    <p className="text-xs text-muted-foreground mt-1">
      We respond within 24 business hours
    </p>
  </div>

  <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
</a>

              <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Visit Us</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    #541, Vidyasagar Saraiplaya<br />
                    Thanisandra Main Road<br />
                    Dr. SRK Nagar Post<br />
                    Bangalore – 560077, Karnataka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold text-foreground mb-3">Business Hours</p>
                  <div className="space-y-1.5">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className={`font-medium ${h.time === "Closed" ? "text-red-400" : "text-foreground"}`}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">All times in IST (UTC+5:30)</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-3">Follow & Connect</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${s.bg} ${s.color}`}
                    >
                      {s.name === "WhatsApp" ? (
                        <MessageCircle className="w-3.5 h-3.5" />
                      ) : s.name === "Instagram" ? (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      ) : s.name === "Facebook" ? (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      ) : s.name === "YouTube" ? (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                      )}
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
                {submitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">We'll get back to you at <span className="text-primary">{email || "your email"}</span> within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject *</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="flex w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="">Select a topic…</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="product">Product Query</option>
                        <option value="payment">Payment Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your question or issue in detail…"
                        required
                        rows={5}
                        className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                      <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Or email us directly at <a href="mailto:support@theideadecorator.in" className="text-primary hover:underline">support@theideadecorator.in</a>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Google Map */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Find Us on the Map
          </h2>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6!2d77.6305301!3d13.0470097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae170003d28c93%3A0xee7cde4bf0603935!2sTheIdeaDecorator!5e0!3m2!1sen!2sin!4v1&q=TheIdeaDecorator,63,Vidyasagar+Rd,Ashwath+Nagar,HBR+Layout,Bengaluru,Karnataka+560077"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TheIdeaDecorator location on Google Maps"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <a
              href="https://www.google.com/maps/dir//TheIdeaDecorator,+63,+Vidyasagar+Rd,+Ashwath+Nagar,+HBR+Layout,+Bengaluru,+Karnataka+560077/@13.0470097,77.6305301,14z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Get Directions on Google Maps
            </a>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Quick answers to common questions. Can't find what you need? Just reach out.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium text-foreground text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
