"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Camera, User } from "lucide-react";
import { Review } from "@/types";
import { useStore } from "@/store/useStore";
import { generateId, getRelativeTime } from "@/lib/utils";

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onAddReview?: (review: Review) => void;
}

export function ReviewSection({ productId, reviews, onAddReview }: ReviewSectionProps) {
  const { currentUser, isUserLoggedIn } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    const review: Review = {
      id: generateId(),
      productId,
      userId: currentUser?.uid || "anonymous",
      userName: currentUser?.displayName || "Anonymous User",
      userAvatar: currentUser?.photoURL,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      helpful: 0,
      createdAt: new Date().toISOString(),
    };

    onAddReview?.(review);
    setShowForm(false);
    setTitle("");
    setComment("");
    setRating(5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Customer Reviews</h3>
        {isUserLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-[0_2px_8px_var(--glow-primary)] hover:scale-[1.02] transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Summary - Amazon style */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-card border border-border">
          {/* Average */}
          <div className="text-center sm:text-left">
            <p className="text-4xl font-bold text-foreground">{avgRating}</p>
            <div className="flex items-center gap-0.5 justify-center sm:justify-start mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(Number(avgRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-1.5">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-6">{star}★</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="p-5 rounded-xl bg-card border border-border space-y-4"
        >
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      i < (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.02] transition-all"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                  {review.userAvatar ? (
                    <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{review.userName}</p>
                    {review.verifiedPurchase && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{getRelativeTime(review.createdAt)}</p>
                </div>
              </div>

              {/* Rating & Title */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{review.title}</span>
              </div>

              {/* Comment */}
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg border border-border overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-xl bg-card border border-border">
          <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
}
