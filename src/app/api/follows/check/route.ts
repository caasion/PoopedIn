import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const followerId = request.nextUrl.searchParams.get("followerId");
    const followingId = request.nextUrl.searchParams.get("followingId");

    if (!followerId || !followingId) {
      return NextResponse.json({ following: false });
    }

    const existing = await prisma.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    return NextResponse.json({ following: !!existing });
  } catch {
    return NextResponse.json({ following: false });
  }
}
