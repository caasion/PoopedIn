import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const userId = dbUser.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId === userId) {
      return NextResponse.json({ error: "Cannot repoop your own post" }, { status: 400 });
    }

    const existing = await prisma.repoop.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.repoop.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    await prisma.repoop.create({ data: { postId, userId } });
    return NextResponse.json({ action: "created" });
  } catch (error) {
    console.error("POST /api/repoops error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
