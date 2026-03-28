import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { saveUploadedFile } from "@/lib/upload";
import { detectPoop } from "@/lib/poopDetector";

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

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const caption = (formData.get("caption") as string) ?? "";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    // Read buffer once — used for both saving and poop detection
    const buffer = Buffer.from(await file.arrayBuffer());

    // AI poop verification
    const detection = await detectPoop(buffer);
    if (!detection.detected) {
      return NextResponse.json(
        { error: "No poop detected. This is PoopedIn, not LinkedIn." },
        { status: 422 }
      );
    }

    // Save image to disk
    const imageUrl = await saveUploadedFile(buffer, file.name);

    // Create post with Bristol Stool metadata
    const post = await prisma.post.create({
      data: {
        userId: dbUser.id,
        imageUrl,
        caption,
        bristolType: detection.bristolType,
        confidence: detection.confidence,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, bio: true, title: true } },
        reactions: true,
        comments: { include: { user: { select: { id: true, name: true, avatarUrl: true, bio: true, title: true } } } },
        repoops: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
