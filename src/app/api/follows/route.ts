import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "followerId and followingId required" }, { status: 400 });
    }
    if (followerId === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const existing = await prisma.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await prisma.follows.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "unfollowed" });
    } else {
      await prisma.follows.create({ data: { followerId, followingId } });
      return NextResponse.json({ action: "followed" });
    }
  } catch (error) {
    console.error("POST /api/follows error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
