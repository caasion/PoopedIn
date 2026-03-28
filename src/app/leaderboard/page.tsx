"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { useUser } from "@/context/UserContext";
import { timeAgo } from "@/lib/timeago";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  currentStreak: number;
  isConstipated: boolean;
  lastPostDate: string | null;
  daysSinceLast: number;
  totalPoops: number;
  snifferCount: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { mounted } = useUser();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data: LeaderboardEntry[]) => {
        setLeaders(data);
        setLoading(false);
      });
  }, [mounted]);

  return (
    <AppShell
      left={<LeftSidebar onDropPoop={() => setCreateModalOpen(true)} />}
      right={<RightSidebar />}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0A66C2] to-[#004182]">
          <h1 className="text-lg font-bold text-white">🏆 Streak Leaderboard</h1>
          <p className="text-sm text-blue-100 mt-0.5">
            Recognizing the most consistent contributors to our professional community.
          </p>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 animate-pulse"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaders.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors ${
                  index < 3 ? "bg-blue-50/30" : ""
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {index < 3 ? (
                    <span className="text-xl">{MEDALS[index]}</span>
                  ) : (
                    <span className="text-sm font-semibold text-gray-400">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Link href={`/profile/${entry.id}`} className="shrink-0">
                  <img
                    src={entry.avatarUrl}
                    alt={entry.name}
                    className="w-11 h-11 rounded-full bg-gray-100"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/profile/${entry.id}`}
                      className="font-semibold text-gray-900 hover:underline text-sm"
                    >
                      {entry.name}
                    </Link>
                    {entry.isConstipated && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                        Constipated 🚽
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{entry.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>💩 {entry.totalPoops} poops</span>
                    <span>👥 {entry.snifferCount} sniffers</span>
                    {entry.lastPostDate && (
                      <span>Last: {timeAgo(entry.lastPostDate)}</span>
                    )}
                  </div>
                </div>

                {/* Streak badge */}
                <div className="shrink-0 text-right">
                  {entry.isConstipated || entry.currentStreak === 0 ? (
                    <div className="text-sm text-gray-300 font-bold">—</div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-orange-500">
                        🔥{entry.currentStreak}
                      </span>
                      <span className="text-xs text-gray-400">
                        day{entry.currentStreak !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Streaks reset if you miss a day. Stay consistent. Stay professional. Stay regular.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
