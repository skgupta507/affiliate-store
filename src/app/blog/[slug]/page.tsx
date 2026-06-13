"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  BookOpen,
  User,
} from "lucide-react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { blogPosts, products } = useStore();
  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);

  // Increment views in useEffect (NEVER call setState/store actions during render)
  useEffect(() => {
    if (post) {
      useStore.getState().updateBlogPost(post.id, { views: post.views + 1 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!post) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
        <Link href="/blog">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = post.relatedProducts
    ? products.filter((p) => post.relatedProducts!.includes(p.id))
    : [];

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="outline" className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                {post.authorAvatar ? (
                  <Image src={post.authorAvatar} alt="" width={24} height={24} className="rounded-full" />
                ) : (
                  <User className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              {post.author}
            </span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} min read</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views} views</span>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border mb-8">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-12 text-muted-foreground leading-relaxed space-y-4">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-line">{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-border">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Products Mentioned
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
