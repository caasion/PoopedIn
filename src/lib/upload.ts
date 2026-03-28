import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveUploadedFile(buffer: Buffer, originalName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}
