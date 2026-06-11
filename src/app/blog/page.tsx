"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Search,
  Eye,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

export default function BlogPage() {
  const { blogPosts } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const publishedPosts = blogPosts.filter((p) => p.isPublished);

  const categories = useMemo(() => {
    const cats = new Set(publishedPosts.map((p) => p.category));
    return Array.from(cats);
  }, [publishedPosts]);

  const filteredPosts = useMemo(() => {
    let posts = [...publishedPosts];
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "all") {
      posts = posts.filter((p) => p.category === selectedCategory);
    }
    return posts.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [publishedPosts, search, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  if (publishedPosts.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Blog Coming Soon</h1>
        <p className="text-muted-foreground mb-6">
          We&apos;re working on amazing home decor tips and styling guides for you.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" /> Blog
          </h1>
          <p className="text-muted-foreground">Home decor tips, styling guides, and product roundups.</p>
        </motion.div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden border border-border bg-card mb-8 group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative aspect-[16/10] md:aspect-auto bg-secondary">
                  {featuredPost.coverImage && (
                    <Image src={featuredPost.coverImage} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <Badge className="absolute top-4 left-4 gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </Badge>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-3">{featuredPost.category}</Badge>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readTime} min read</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {featuredPost.views} views</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {getRelativeTime(featuredPost.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Posts Grid */}
        {restPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="relative aspect-[16/10] bg-secondary">
                      {post.coverImage && (
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <Badge variant="outline" className="w-fit mb-2 text-[10px]">{post.category}</Badge>
                      <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {post.readTime} min</span>
                        <span>{getRelativeTime(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
