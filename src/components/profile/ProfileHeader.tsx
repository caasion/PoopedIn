"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface ProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  title: string;
  currentStreak: number;
  isConstipated: boolean;
  daysSinceLast: number;
  totalPoops: number;
  snifferCount: number;
  sniffingCount: number;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isFollowing: boolean;
  onFollowToggle: (following: boolean) => void;
}

export default function ProfileHeader({
  profile,
  isFollowing,
  onFollowToggle,
}: ProfileHeaderProps) {
  const { currentUserId } = useUser();
  const [following, setFollowing] = useState(isFollowing);
  const [isLoading, setLoading] = useState(false);

  const isOwnProfile = currentUserId === profile.id;

  async function handleFollowToggle() {
    if (!currentUserId || isOwnProfile || isLoading) return;
    setLoading(true);
    const prev = following;
    setFollowing(!prev);

    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: profile.id,
        }),
      });
      const data = await res.json();
      const nowFollowing = data.action === "followed";
      setFollowing(nowFollowing);
      onFollowToggle(nowFollowing);
    } catch {
      setFollowing(prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Cover banner */}
      <div className="h-32 bg-gradient-to-r from-[#0A66C2] to-[#004182]" />

      {/* Profile info */}
      <div className="px-6 pb-5 -mt-14">
        <div className="flex items-end justify-between mb-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-sm"
          />
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`mb-1 px-5 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                following
                  ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600"
                  : "border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
              } disabled:opacity-50`}
            >
              {following ? "Sniffing ✓" : "+ Sniff"}
            </button>
          )}
        </div>

        {/* Name and title */}
        <div className="flex items-start gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
          {profile.isConstipated && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
              Constipated 🚽
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{profile.title}</p>
        {profile.bio && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{profile.totalPoops}</p>
            <p className="text-xs text-gray-500">Poops</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#0A66C2]">{profile.snifferCount}</p>
            <p className="text-xs text-gray-500">Sniffers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{profile.sniffingCount}</p>
            <p className="text-xs text-gray-500">Sniffing</p>
          </div>
          <div className="text-center">
            {profile.isConstipated ? (
              <>
                <p className="text-lg font-bold text-gray-400">—</p>
                <p className="text-xs text-gray-500">Streak</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-orange-500">
                  🔥 {profile.currentStreak}
                </p>
                <p className="text-xs text-gray-500">Day Streak</p>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary section */}
        {profile.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
