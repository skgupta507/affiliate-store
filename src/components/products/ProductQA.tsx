"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Send, User, CheckCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRelativeTime } from "@/lib/utils";

interface ProductQAProps {
  productId: string;
}

export function ProductQA({ productId }: ProductQAProps) {
  const { productQuestions, askQuestion, answerQuestion, upvoteQuestion, isUserLoggedIn, isAuthenticated } = useStore();
  const [newQuestion, setNewQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const questions = productQuestions
    .filter((q) => q.productId === productId)
    .sort((a, b) => b.upvotes - a.upvotes);

  const handleAsk = () => {
    if (!newQuestion.trim()) return;
    askQuestion(productId, newQuestion.trim());
    setNewQuestion("");
  };

  const handleAnswer = (questionId: string) => {
    if (!answerText.trim()) return;
    answerQuestion(questionId, answerText.trim());
    setAnsweringId(null);
    setAnswerText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Customer Questions ({questions.length})
        </h3>
      </div>

      {/* Ask Question */}
      {isUserLoggedIn && (
        <div className="flex gap-2">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Have a question? Ask here..."
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={!newQuestion.trim()} className="gap-1 shrink-0">
            <Send className="w-4 h-4" /> Ask
          </Button>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.slice(0, 10).map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              {/* Question */}
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-primary shrink-0">Q:</span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.question}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" /> {q.userName}</span>
                    <span>{getRelativeTime(q.createdAt)}</span>
                    <button onClick={() => upvoteQuestion(q.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="w-2.5 h-2.5" /> {q.upvotes}
                    </button>
                  </div>
                </div>
              </div>

              {/* Answer */}
              {q.answer ? (
                <div className="flex items-start gap-3 mt-3 pl-6 pt-3 border-t border-border/50">
                  <span className="text-sm font-bold text-green-500 shrink-0">A:</span>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{q.answer}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-2.5 h-2.5" /> {q.answeredBy}</span>
                      {q.answeredAt && <span>{getRelativeTime(q.answeredAt)}</span>}
                    </div>
                  </div>
                </div>
              ) : isAuthenticated ? (
                // Admin can answer
                <div className="mt-3 pl-6 pt-3 border-t border-border/50">
                  {answeringId === q.id ? (
                    <div className="flex gap-2">
                      <Input value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Type your answer..." className="text-xs" onKeyDown={(e) => e.key === "Enter" && handleAnswer(q.id)} />
                      <Button size="sm" onClick={() => handleAnswer(q.id)}>Answer</Button>
                      <Button size="sm" variant="outline" onClick={() => setAnsweringId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <button onClick={() => setAnsweringId(q.id)} className="text-xs text-primary hover:underline">
                      + Add Answer
                    </button>
                  )}
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-xl bg-card border border-border">
          <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No questions yet. Be the first to ask!</p>
        </div>
      )}
    </div>
  );
}
