import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, content } = await request.json();

    if (!postId || !userId || !content?.trim()) {
      return NextResponse.json({ error: "postId, userId, content required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: { postId, userId, content: content.trim() },
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
