import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Auth check — followerId is always the signed-in user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json({ error: "followingId required" }, { status: 400 });
    }

    const followerId = dbUser.id;

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
