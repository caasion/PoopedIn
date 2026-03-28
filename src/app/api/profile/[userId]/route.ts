import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/streak";

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
          include: { reactions: true, _count: { select: { comments: true, repoops: true } } },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { currentStreak, isConstipated, daysSinceLast } = calculateStreak(
      user.posts.map((p) => p.createdAt)
    );

    return NextResponse.json({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      title: user.title,
      currentStreak,
      isConstipated,
      daysSinceLast,
      totalPoops: user.posts.length,
      snifferCount: user.followers.length,
      sniffingCount: user.following.length,
      posts: user.posts.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        caption: p.caption,
        createdAt: p.createdAt.toISOString(),
        reactionCount: p.reactions.length,
        commentCount: p._count.comments,
        repoopCount: p._count.repoops,
      })),
    });
  } catch (error) {
    console.error("GET /api/profile/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
