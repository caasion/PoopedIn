"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import type { PostData } from "@/types";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  currentStreak: number;
  isConstipated: boolean;
}

export default function RightSidebar() {
  const { currentUserId, mounted } = useUser();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [trending, setTrending] = useState<PostData | null>(null);

  useEffect(() => {
    if (!mounted) return;

    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data: LeaderboardEntry[]) => {
        setLeaders(data.slice(0, 3));
      });
  }, [mounted]);

  useEffect(() => {
    if (!currentUserId || !mounted) return;

    fetch(`/api/feed?userId=${currentUserId}`)
      .then((r) => r.json())
      .then((items: Array<{ kind: string; data: PostData; sortDate: string }>) => {
        // Find most reacted post from today in the feed
        const today = new Date().toDateString();
        const todayPosts = items
          .filter(
            (item) =>
              item.kind === "post" &&
              new Date(item.sortDate).toDateString() === today
          )
          .map((item) => item.data as PostData);

        if (todayPosts.length > 0) {
          const sorted = todayPosts.sort(
            (a, b) => b.reactions.length - a.reactions.length
          );
          setTrending(sorted[0]);
        }
      });
  }, [currentUserId, mounted]);

  const medals = ["🥇", "🥈", "🥉"];

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Leaderboard preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">
            🏆 Streak Leaderboard
          </h3>
          <Link
            href="/leaderboard"
            className="text-xs text-[#0A66C2] hover:underline font-medium"
          >
            See all
          </Link>
        </div>
        {leaders.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            Loading...
          </p>
        ) : (
          <div className="space-y-3">
            {leaders.map((user, i) => (
              <div key={user.id} className="flex items-center gap-2">
                <span className="text-lg w-6 text-center">{medals[i]}</span>
                <Link href={`/profile/${user.id}`}>
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.id}`}
                    className="text-xs font-semibold text-gray-900 hover:underline block truncate"
                  >
                    {user.name}
                  </Link>
                </div>
                <div className="text-xs font-semibold text-orange-500 shrink-0">
                  {user.isConstipated ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <span>🔥{user.currentStreak}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending in your network */}
      {trending && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            📈 Trending in your network
          </h3>
          <div className="flex gap-2">
            <img
              src={trending.user.avatarUrl}
              alt={trending.user.name}
              className="w-9 h-9 rounded-full shrink-0 bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {trending.user.name}
              </p>
              {trending.caption && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                  {trending.caption}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                💩 {trending.reactions.length} reactions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="px-1">
        <p className="text-xs text-gray-400 leading-relaxed">
          PoopedIn © 2026 · Where professionals connect over what connects us all.
        </p>
      </div>
    </div>
  );
}
