"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import PostCard from "@/components/post/PostCard";
import SystemPostCard from "@/components/feed/SystemPostCard";
import CreatePostModal from "@/components/modals/CreatePostModal";
import type { FeedItem, PostData } from "@/types";
import type { SystemPost } from "@/lib/systemPosts";

interface FeedListProps {
  isCreateModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
}

export default function FeedList({ isCreateModalOpen, onModalOpen, onModalClose }: FeedListProps) {
  const { currentUserId, mounted } = useUser();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = currentUserId ? `/api/feed?userId=${currentUserId}` : `/api/feed`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load feed");
      const items: FeedItem[] = await res.json();
      setFeedItems(items);
    } catch {
      setError("Unable to load your feed. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (mounted) {
      loadFeed();
    }
  }, [currentUserId, mounted, loadFeed]);

  function handlePostCreated(post: PostData) {
    const newItem: FeedItem = {
      kind: "post",
      data: post,
      sortDate: post.createdAt,
    };
    setFeedItems((prev) => [newItem, ...prev]);
  }

  if (!mounted || loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={loadFeed}
          className="mt-3 text-sm text-[#0A66C2] font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-4xl mb-3">💩</p>
        <p className="font-semibold text-gray-900">Your feed is empty</p>
        <p className="text-sm text-gray-500 mt-1">
          Start sniffing people to see their poops here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Create post prompt */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <button
          onClick={() => onModalOpen()}
          className="flex-1 text-left text-sm text-gray-500 border border-gray-300 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
        >
          Drop a Poop
        </button>
      </div>

      <div className="space-y-3">
        {feedItems.map((item) => {
          if (item.kind === "post") {
            return (
              <PostCard
                key={item.data.id}
                post={item.data}
                onNewRepoop={loadFeed}
              />
            );
          }

          if (item.kind === "repoop") {
            return (
              <PostCard
                key={`repoop-${item.data.id}`}
                post={item.data.post}
                repoopedBy={item.data.user}
                onNewRepoop={loadFeed}
              />
            );
          }

          if (item.kind === "system") {
            return (
              <SystemPostCard
                key={(item.data as SystemPost).id}
                post={item.data as SystemPost}
              />
            );
          }

          return null;
        })}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={onModalClose}
        onPostCreated={handlePostCreated}
      />
    </>
  );
}
