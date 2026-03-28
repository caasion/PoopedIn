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

    const { postId, type } = await request.json();

    if (!postId || !type) {
      return NextResponse.json({ error: "postId and type required" }, { status: 400 });
    }

    const userId = dbUser.id;
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
