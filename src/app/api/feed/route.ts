import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSystemPosts } from "@/lib/systemPosts";
import type { FeedItem, ReactionType } from "@/types";

export const dynamic = "force-dynamic";

const userSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  bio: true,
  title: true,
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Unauthenticated: show all posts
    let networkIds: string[] | null = null;
    if (userId) {
      const follows = await prisma.follows.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      networkIds = [userId, ...follows.map((f) => f.followingId)];
    }

    // Fetch posts from network (or all posts if unauthenticated)
    const posts = await prisma.post.findMany({
      where: networkIds ? { userId: { in: networkIds } } : undefined,
      include: {
        user: { select: userSelect },
        reactions: true,
        comments: {
          include: { user: { select: userSelect } },
          orderBy: { createdAt: "asc" },
        },
        repoops: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Fetch repoops from network (or all if unauthenticated)
    const repoops = await prisma.repoop.findMany({
      where: networkIds ? { userId: { in: networkIds } } : undefined,
      include: {
        user: { select: userSelect },
        post: {
          include: {
            user: { select: userSelect },
            reactions: true,
            comments: {
              include: { user: { select: userSelect } },
              orderBy: { createdAt: "asc" },
            },
            repoops: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // All users with post dates for system post generation
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        posts: { select: { createdAt: true } },
      },
    });

    const systemPosts = generateSystemPosts(allUsers, networkIds ?? allUsers.map((u) => u.id));

    // Compose feed
    const feedItems: FeedItem[] = [
      ...posts.map((p) => ({
        kind: "post" as const,
        data: {
          ...p,
          createdAt: p.createdAt.toISOString(),
          reactions: p.reactions.map((r) => ({ ...r, type: r.type as ReactionType })),
          comments: p.comments.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          })),
          repoops: p.repoops.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          })),
          user: p.user,
        },
        sortDate: p.createdAt.toISOString(),
      })),
      ...repoops.map((r) => ({
        kind: "repoop" as const,
        data: {
          ...r,
          createdAt: r.createdAt.toISOString(),
          user: r.user,
          post: {
            ...r.post,
            createdAt: r.post.createdAt.toISOString(),
            reactions: r.post.reactions.map((rx) => ({ ...rx, type: rx.type as ReactionType })),
            comments: r.post.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
            })),
            repoops: r.post.repoops.map((rp) => ({
              ...rp,
              createdAt: rp.createdAt.toISOString(),
            })),
            user: r.post.user,
          },
        },
        sortDate: r.createdAt.toISOString(),
      })),
      ...systemPosts.map((s) => ({
        kind: "system" as const,
        data: s,
        sortDate: s.sortDate,
      })),
    ];

    // Sort by date descending
    feedItems.sort(
      (a, b) =>
        new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
    );

    return NextResponse.json(feedItems);
  } catch (error) {
    console.error("GET /api/feed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
