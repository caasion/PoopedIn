"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { timeAgo } from "@/lib/timeago";

interface GridPost {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
  repoopCount: number;
}

interface PostGridProps {
  posts: GridPost[];
}

export default function PostGrid({ posts }: PostGridProps) {
  const { safeMode, mounted } = useUser();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const blurImage = !mounted || safeMode;

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-4xl mb-3">💩</p>
        <p className="font-semibold text-gray-900">No poops yet</p>
        <p className="text-sm text-gray-500 mt-1">
          This professional hasn&apos;t dropped any poops yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm">
          Poops ({posts.length})
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={post.imageUrl}
              alt="Poop"
              className={`w-full h-full object-cover transition-all duration-200 ${
                blurImage ? "blur-md scale-110" : ""
              } ${hoveredId === post.id ? "scale-105" : ""}`}
            />
            {hoveredId === post.id && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 text-white text-xs font-medium">
                <span>💩 {post.reactionCount}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
