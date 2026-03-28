import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { detectPoop } from "@/lib/poopDetector";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const caption = (formData.get("caption") as string) ?? "";
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
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
        userId,
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
