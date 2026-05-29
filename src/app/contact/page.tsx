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
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/918000000000?text=Hi%2C%20I%20need%20help%20with%20my%20order", color: "text-green-500", bg: "bg-green-500/10 hover:bg-green-500/20" },
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success("Message sent!", "We'll get back to you within 24 hours.");
    setSubmitted(true);
    setName(""); setEmail(""); setSubject(""); setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
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

              <a href="mailto:support@theideadecorator.in" className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Email Us</p>
                  <p className="text-primary text-sm font-medium">support@theideadecorator.in</p>
                  <p className="text-xs text-muted-foreground mt-1">We respond within 24 business hours</p>
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
                <div className="flex gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${s.bg} ${s.color}`}
                    >
                      <s.icon className="w-4 h-4" />
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
                    <Button type="submit" size="lg" className="w-full gap-2">
                      <Send className="w-4 h-4" /> Send Message
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4281305068986!2d77.62386!3d13.0627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzQ1LjciTiA3N8KwMzcnMjUuOSJF!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin&q=Thanisandra+Main+Road+Bangalore+560077"
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
              href="https://maps.google.com/?q=Thanisandra+Main+Road+Bangalore+560077"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
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
