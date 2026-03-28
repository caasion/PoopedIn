export type ReactionType = "POOP" | "CELEBRATE" | "INSIGHTFUL" | "CURIOUS" | "LOVE";

export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  title: string;
}

export interface CommentWithUser {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: UserSummary;
}

export interface ReactionData {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
}

export interface RepoopData {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface PostData {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  bristolType?: string | null;
  confidence?: number | null;
  user: UserSummary;
  reactions: ReactionData[];
  comments: CommentWithUser[];
  repoops: RepoopData[];
}

export interface RepoopFeedItem {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  user: UserSummary;
  post: PostData;
}

import type { SystemPost } from "@/lib/systemPosts";

export type FeedItemKind = "post" | "repoop" | "system";

export type FeedItem =
  | { kind: "post"; data: PostData; sortDate: string }
  | { kind: "repoop"; data: RepoopFeedItem; sortDate: string }
  | { kind: "system"; data: SystemPost; sortDate: string };

export const REACTION_EMOJI: Record<ReactionType, string> = {
  POOP: "💩",
  CELEBRATE: "🎉",
  INSIGHTFUL: "🧠",
  CURIOUS: "🤔",
  LOVE: "❤️",
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  POOP: "Poop",
  CELEBRATE: "Celebrate",
  INSIGHTFUL: "Insightful",
  CURIOUS: "Curious",
  LOVE: "Love",
};

export const ALL_REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "POOP", emoji: "💩", label: "Poop" },
  { type: "CELEBRATE", emoji: "🎉", label: "Celebrate" },
  { type: "INSIGHTFUL", emoji: "🧠", label: "Insightful" },
  { type: "CURIOUS", emoji: "🤔", label: "Curious" },
  { type: "LOVE", emoji: "❤️", label: "Love" },
];
