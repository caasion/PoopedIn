import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId } = await request.json();

    if (!postId || !userId) {
      return NextResponse.json({ error: "postId and userId required" }, { status: 400 });
    }

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
