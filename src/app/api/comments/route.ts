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

    const { postId, content } = await request.json();

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: "postId and content required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: { postId, userId: dbUser.id, content: content.trim() },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, bio: true, title: true } },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
