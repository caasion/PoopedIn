"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { timeAgo } from "@/lib/timeago";
import ReactionsBar from "./ReactionsBar";
import CommentSection from "./CommentSection";
import type { PostData, ReactionData, UserSummary } from "@/types";

const BRISTOL_LABELS: Record<string, string> = {
  "Type 1": "Separate hard lumps",
  "Type 2": "Lumpy sausage",
  "Type 3": "Cracked sausage",
  "Type 4": "Smooth sausage",
  "Type 5": "Soft blobs",
  "Type 6": "Fluffy pieces",
  "Type 7": "Watery",
};

interface PostCardProps {
  post: PostData;
  repoopedBy?: UserSummary;
  onNewRepoop?: () => void;
}

export default function PostCard({ post: initialPost, repoopedBy, onNewRepoop }: PostCardProps) {
  const { safeMode, mounted } = useUser();
  const [post, setPost] = useState(initialPost);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const blurImage = !mounted || safeMode;

  function handleReactionChange(reactions: ReactionData[]) {
    setPost((p) => ({ ...p, reactions }));
  }

  function handleRepoopClick() {
    if (onNewRepoop) onNewRepoop();
    // Optimistically increment repoop count
    setPost((p) => ({
      ...p,
      repoops: [
        ...p.repoops,
        { id: "temp", postId: p.id, userId: "temp", createdAt: new Date().toISOString() },
      ],
    }));
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Repoop attribution */}
      {repoopedBy && (
        <div className="px-4 pt-3 pb-0 flex items-center gap-1.5 text-xs text-gray-500">
          <span>🔄</span>
          <Link
            href={`/profile/${repoopedBy.id}`}
            className="font-medium hover:underline text-gray-600"
          >
            {repoopedBy.name}
          </Link>
          <span>repooped this</span>
        </div>
      )}

      {/* Post header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.user.id}`} className="shrink-0">
            <img
              src={post.user.avatarUrl}
              alt={post.user.name}
              className="w-12 h-12 rounded-full bg-gray-100"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${post.user.id}`}
              className="font-semibold text-gray-900 hover:underline text-sm"
            >
              {post.user.name}
            </Link>
            <p className="text-xs text-gray-500 truncate">{post.user.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
          </div>
          {/* Three dots menu placeholder */}
          <button className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="mt-3 text-sm text-gray-800 leading-relaxed">{post.caption}</p>
        )}
      </div>

      {/* Post image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={post.imageUrl}
          alt="Poop"
          className={`w-full object-cover max-h-[500px] transition-all duration-300 ${
            blurImage ? "blur-xl scale-110" : ""
          }`}
        />
        {blurImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-5xl">🙈</span>
            <p className="text-xs text-gray-500 mt-2 bg-white/80 px-3 py-1 rounded-full">
              Safe Mode is ON
            </p>
          </div>
        )}
      </div>

      {/* Bristol Stool verification badge */}
      {post.bristolType && post.confidence != null && (
        <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100 bg-gray-50/60">
          <span className="text-xs">🔬</span>
          <span className="text-xs font-medium text-gray-700">
            {post.bristolType}
            {BRISTOL_LABELS[post.bristolType] && (
              <span className="font-normal text-gray-500"> · {BRISTOL_LABELS[post.bristolType]}</span>
            )}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-500">
            {Math.round(post.confidence * 100)}% confidence
          </span>
          <span className="ml-auto text-xs text-[#0A66C2] font-medium">
            Verified Professional Content ✓
          </span>
        </div>
      )}

      {/* Reactions bar */}
      <ReactionsBar
        postId={post.id}
        reactions={post.reactions}
        onReactionChange={handleReactionChange}
        onCommentClick={() => setCommentsOpen((v) => !v)}
        onRepoopClick={handleRepoopClick}
        commentCount={post.comments.length}
        repoopCount={post.repoops.length}
        postUserId={post.user.id}
      />

      {/* Comments */}
      <CommentSection
        postId={post.id}
        initialComments={post.comments}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </div>
  );
}
