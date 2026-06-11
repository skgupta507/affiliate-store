"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { generateId } from "@/lib/utils";
import { BlogPost } from "@/types";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

export function AdminBlog() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, products } = useStore();
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Home Decor Tips");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("TheIdeaDecorator");
  const [readTime, setReadTime] = useState("5");
  const [isPublished, setIsPublished] = useState(true);
  const [relatedProductIds, setRelatedProductIds] = useState("");

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setCoverImage("");
    setCategory("Home Decor Tips"); setTags(""); setAuthor("TheIdeaDecorator");
    setReadTime("5"); setIsPublished(true); setRelatedProductIds(""); setEditingId(null); setShowForm(false);
  };

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      error("Missing fields", "Title and content are required.");
      return;
    }
    const postSlug = slug.trim() || generateSlug(title);
    const post: BlogPost = {
      id: editingId || generateId(),
      title: title.trim(),
      slug: postSlug,
      excerpt: excerpt.trim() || content.slice(0, 150) + "...",
      content: content.trim(),
      coverImage: coverImage.trim(),
      author,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      publishedAt: editingId ? (blogPosts.find((p) => p.id === editingId)?.publishedAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: parseInt(readTime) || 5,
      isPublished,
      relatedProducts: relatedProductIds.split(",").map((t) => t.trim()).filter(Boolean),
      views: editingId ? (blogPosts.find((p) => p.id === editingId)?.views || 0) : 0,
    };

    if (editingId) {
      updateBlogPost(editingId, post);
      success("Post updated", `"${post.title}" has been updated.`);
    } else {
      addBlogPost(post);
      success("Post created", `"${post.title}" has been published.`);
    }
    resetForm();
  };

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setCategory(post.category);
    setTags(post.tags.join(", "));
    setAuthor(post.author);
    setReadTime(post.readTime.toString());
    setIsPublished(post.isPublished);
    setRelatedProductIds(post.relatedProducts?.join(", ") || "");
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Blog Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{blogPosts.length} posts ({blogPosts.filter((p) => p.isPublished).length} published)</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-1.5">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm">{editingId ? "Edit Post" : "Create New Post"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Title *</label>
                  <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!editingId) setSlug(generateSlug(e.target.value)); }} placeholder="Post title" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Slug</label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Excerpt</label>
                <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description (auto-generated if empty)" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Content *</label>
                <textarea
                  value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... (supports basic HTML)"
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cover Image URL</label>
                  <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Home Decor Tips" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Read Time (min)</label>
                  <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} type="number" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tags (comma separated)</label>
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="decor, tips, lighting" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" />
                Published
              </label>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-1"><Save className="w-3.5 h-3.5" /> {editingId ? "Update" : "Publish"}</Button>
                <Button variant="outline" onClick={resetForm}><X className="w-3.5 h-3.5" /> Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Posts List */}
      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-medium">No blog posts yet</p>
            <p className="text-sm text-muted-foreground">Create your first post to start your blog.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {blogPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {post.coverImage && (
                      <div className="w-16 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground truncate">{post.title}</h3>
                        {post.isPublished ? (
                          <Badge variant="default" className="text-[9px] bg-green-500/10 text-green-500 shrink-0">Published</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px] shrink-0">Draft</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span>{post.category}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {post.readTime} min</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {post.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => updateBlogPost(post.id, { isPublished: !post.isPublished })} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                      {post.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => startEdit(post)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { deleteBlogPost(post.id); success("Deleted", "Post removed."); }} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
