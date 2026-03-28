"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import type { ReactionData, ReactionType } from "@/types";
import { ALL_REACTIONS, REACTION_EMOJI } from "@/types";

interface ReactionsBarProps {
  postId: string;
  reactions: ReactionData[];
  onReactionChange: (reactions: ReactionData[]) => void;
  onCommentClick: () => void;
  onRepoopClick: () => void;
  commentCount: number;
  repoopCount: number;
  postUserId: string;
}

export default function ReactionsBar({
  postId,
  reactions,
  onReactionChange,
  onCommentClick,
  onRepoopClick,
  commentCount,
  repoopCount,
  postUserId,
}: ReactionsBarProps) {
  const { currentUserId } = useUser();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const myReaction = reactions.find((r) => r.userId === currentUserId);

  // Group reactions by type for count display
  const reactionCounts = ALL_REACTIONS.map((r) => ({
    ...r,
    count: reactions.filter((rx) => rx.type === r.type).length,
  })).filter((r) => r.count > 0);

  async function handleReaction(type: ReactionType) {
    if (!currentUserId || isLoading) return;
    setPickerVisible(false);
    setLoading(true);

    // Optimistic update
    const prevReactions = [...reactions];
    let optimistic: ReactionData[];
    if (myReaction?.type === type) {
      optimistic = reactions.filter((r) => r.userId !== currentUserId);
    } else if (myReaction) {
      optimistic = reactions.map((r) =>
        r.userId === currentUserId ? { ...r, type } : r
      );
    } else {
      optimistic = [
        ...reactions,
        { id: "temp", postId, userId: currentUserId, type },
      ];
    }
    onReactionChange(optimistic);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId, type }),
      });
      const data = await res.json();
      onReactionChange(data.reactions);
    } catch {
      onReactionChange(prevReactions);
    } finally {
      setLoading(false);
    }
  }

  async function handleRepoop() {
    if (!currentUserId || postUserId === currentUserId) return;
    try {
      await fetch("/api/repoops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId }),
      });
      onRepoopClick();
    } catch {
      // silent
    }
  }

  return (
    <div>
      {/* Reaction summary row */}
      {reactionCounts.length > 0 && (
        <div className="px-4 py-2 flex items-center gap-1 text-xs text-gray-500 border-b border-gray-100">
          <div className="flex -space-x-1">
            {reactionCounts.slice(0, 3).map((r) => (
              <span key={r.type} className="text-sm">
                {r.emoji}
              </span>
            ))}
          </div>
          <span className="ml-1">{reactions.length}</span>
          <div className="flex-1" />
          <button
            onClick={onCommentClick}
            className="hover:text-[#0A66C2] hover:underline"
          >
            {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </button>
          <span>·</span>
          <span>{repoopCount} repoop{repoopCount !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-2 py-1 flex items-center border-t border-gray-100">
        {/* React button with hover picker */}
        <div
          className="relative"
          onMouseEnter={() => setPickerVisible(true)}
          onMouseLeave={() => setPickerVisible(false)}
        >
          <button
            onClick={() => handleReaction(myReaction?.type ?? "POOP")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
              myReaction ? "text-[#0A66C2]" : "text-gray-600"
            }`}
          >
            <span>{myReaction ? REACTION_EMOJI[myReaction.type] : "👍"}</span>
            <span className="hidden sm:inline">
              {myReaction
                ? myReaction.type.charAt(0) +
                  myReaction.type.slice(1).toLowerCase()
                : "React"}
            </span>
          </button>

          {/* Hover picker */}
          {isPickerVisible && (
            <div className="absolute bottom-full left-0 mb-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1.5 flex items-center gap-1 z-20 whitespace-nowrap">
              {ALL_REACTIONS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  title={r.label}
                  className={`text-2xl hover:scale-125 transition-transform p-0.5 rounded-full ${
                    myReaction?.type === r.type ? "bg-blue-50 scale-110" : ""
                  }`}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment button */}
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span>💬</span>
          <span className="hidden sm:inline">Comment</span>
        </button>

        {/* Repoop button */}
        {postUserId !== currentUserId && (
          <button
            onClick={handleRepoop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Repoop</span>
          </button>
        )}
      </div>
    </div>
  );
}
