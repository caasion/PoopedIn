"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import type { UserSummary } from "@/types";

interface SidebarProps {
  onDropPoop: () => void;
}

export default function LeftSidebar({ onDropPoop }: SidebarProps) {
  const { currentUser, currentUserId, allUsers, mounted } = useUser();
  const [snifferCount, setSnifferCount] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<UserSummary[]>([]);

  useEffect(() => {
    if (!currentUserId || !mounted) return;

    fetch(`/api/profile/${currentUserId}`)
      .then((r) => r.json())
      .then((data) => {
        setSnifferCount(data.snifferCount ?? 0);
        // Suggestions: users not yet followed, excluding self
        const followedIds = new Set<string>();
        // We'll derive from allUsers; backend gives snifferCount
        // For suggestions, show random non-followed users
        const others = allUsers.filter((u) => u.id !== currentUserId);
        setSuggestions(others.slice(0, 3));
      });
  }, [currentUserId, mounted, allUsers]);

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mini profile card */}
      {currentUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Banner */}
          <div className="h-16 bg-gradient-to-r from-[#0A66C2] to-[#004182]" />
          <div className="px-4 pb-4 -mt-8">
            <Link href={`/profile/${currentUser.id}`}>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full border-2 border-white bg-white"
              />
            </Link>
            <Link
              href={`/profile/${currentUser.id}`}
              className="block mt-1 font-semibold text-gray-900 hover:underline text-sm leading-tight"
            >
              {currentUser.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              {currentUser.title}
            </p>
            {snifferCount !== null && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Sniffers</span>
                  <span className="font-semibold text-[#0A66C2]">
                    {snifferCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drop a Poop CTA */}
      <button
        onClick={onDropPoop}
        className="w-full bg-[#0A66C2] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-[#004182] transition-colors shadow-sm"
      >
        💩 Drop a Poop
      </button>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">🏠</span>
          <span className="font-medium">Feed</span>
        </Link>
        <Link
          href="/leaderboard"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">🏆</span>
          <span className="font-medium">Leaderboard</span>
        </Link>
      </div>

      {/* People you may want to sniff */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            People you may want to sniff
          </h3>
          <div className="space-y-3">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <Link href={`/profile/${user.id}`}>
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-9 h-9 rounded-full bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.id}`}
                    className="text-xs font-semibold text-gray-900 hover:underline block truncate"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-gray-500 truncate">{user.title}</p>
                </div>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-xs font-medium text-[#0A66C2] hover:underline shrink-0"
                >
                  + Sniff
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
