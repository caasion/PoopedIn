import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/streak";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: { select: { createdAt: true } },
        followers: true,
      },
    });

    const leaderboard = users
      .map((user) => {
        const { currentStreak, isConstipated, lastPostDate, daysSinceLast } =
          calculateStreak(user.posts.map((p) => p.createdAt));
        return {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          title: user.title,
          bio: user.bio,
          currentStreak,
          isConstipated,
          lastPostDate: lastPostDate?.toISOString() ?? null,
          daysSinceLast,
          totalPoops: user.posts.length,
          snifferCount: user.followers.length,
        };
      })
      .sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        return b.totalPoops - a.totalPoops;
      });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
