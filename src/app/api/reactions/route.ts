import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, type } = await request.json();

    if (!postId || !userId || !type) {
      return NextResponse.json({ error: "postId, userId, type required" }, { status: 400 });
    }

    const existing = await prisma.reaction.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    let action: "created" | "removed" | "updated";
    if (!existing) {
      await prisma.reaction.create({ data: { postId, userId, type } });
      action = "created";
    } else if (existing.type === type) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      action = "removed";
    } else {
      await prisma.reaction.update({ where: { id: existing.id }, data: { type } });
      action = "updated";
    }

    const reactions = await prisma.reaction.findMany({ where: { postId } });
    return NextResponse.json({ action, reactions });
  } catch (error) {
    console.error("POST /api/reactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
