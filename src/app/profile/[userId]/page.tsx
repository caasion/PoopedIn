"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@/context/UserContext";
import AppShell from "@/components/layout/AppShell";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostGrid from "@/components/profile/PostGrid";

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
  posts: {
    id: string;
    imageUrl: string;
    caption: string;
    createdAt: string;
    reactionCount: number;
    commentCount: number;
    repoopCount: number;
  }[];
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const { currentUserId, mounted } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/profile/${userId}`)
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!currentUserId || !userId || !mounted) return;
    fetch(`/api/follows/check?followerId=${currentUserId}&followingId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setIsFollowing(data.following ?? false);
      })
      .catch(() => {});
  }, [currentUserId, userId, mounted]);

  if (!mounted || loading) {
    return (
      <AppShell
        left={<LeftSidebar onDropPoop={() => setCreateModalOpen(true)} />}
        right={<RightSidebar />}
      >
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-64 animate-pulse" />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 animate-pulse" />
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell
        left={<LeftSidebar onDropPoop={() => setCreateModalOpen(true)} />}
        right={<RightSidebar />}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🚽</p>
          <p className="font-semibold text-gray-900">Profile not found</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      left={<LeftSidebar onDropPoop={() => setCreateModalOpen(true)} />}
      right={<RightSidebar />}
    >
      <ProfileHeader
        profile={profile}
        isFollowing={isFollowing}
        onFollowToggle={(following) => {
          setIsFollowing(following);
          setProfile((p) =>
            p
              ? {
                  ...p,
                  snifferCount: following
                    ? p.snifferCount + 1
                    : p.snifferCount - 1,
                }
              : p
          );
        }}
      />
      <PostGrid posts={profile.posts} />
    </AppShell>
  );
}
