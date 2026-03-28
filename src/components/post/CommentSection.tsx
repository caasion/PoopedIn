"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { timeAgo } from "@/lib/timeago";
import type { CommentWithUser } from "@/types";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithUser[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentSection({
  postId,
  initialComments,
  isOpen,
  onClose,
}: CommentSectionProps) {
  const { currentUserId, currentUser } = useUser();
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const visibleComments =
    expanded || comments.length <= 2 ? comments : comments.slice(0, 2);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId || !input.trim() || isSubmitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: input.trim() }),
      });
      const comment: CommentWithUser = await res.json();
      setComments((prev) => [...prev, comment]);
      setInput("");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen && comments.length === 0) return null;

  return (
    <div className="px-4 pt-2 pb-3 border-t border-gray-100">
      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-3">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <Link href={`/profile/${comment.user.id}`} className="shrink-0">
                <img
                  src={comment.user.avatarUrl}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full bg-gray-100"
                />
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl px-3 py-2">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="text-xs font-semibold text-gray-900 hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                  <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 pl-3">
                  {timeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {comments.length > 2 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-[#0A66C2] font-medium hover:underline pl-10"
            >
              View all {comments.length} comments
            </button>
          )}
          {expanded && comments.length > 2 && (
            <button
              onClick={() => setExpanded(false)}
              className="text-xs text-gray-400 hover:underline pl-10"
            >
              Show fewer
            </button>
          )}
        </div>
      )}

      {/* Comment input */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          {currentUser && (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full shrink-0 bg-gray-100"
            />
          )}
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-sm py-2 outline-none placeholder-gray-400"
            />
            {input.trim() && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-[#0A66C2] font-semibold text-sm ml-2 disabled:opacity-50"
              >
                Post
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
