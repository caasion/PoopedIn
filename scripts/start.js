#!/usr/bin/env node
// Railway startup script: migrates DB, seeds on first boot, then starts the app.
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

async function main() {
  // 1. Sync database schema (safe to run on every boot)
  console.log("🔄 Syncing database schema...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  // 2. Seed only if the database is empty (first deploy)
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("🌱 Empty database — seeding for the first time...");
      execSync("npm run db:seed", { stdio: "inherit" });
    } else {
      console.log(`✅ Database already has ${userCount} users, skipping seed.`);
    }
  } finally {
    await prisma.$disconnect();
  }

  // 3. Start Next.js (Railway injects PORT automatically)
  console.log("🚀 Starting PoopedIn...");
  execSync("npm start", { stdio: "inherit" });
}

main().catch((err) => {
  console.error("❌ Startup failed:", err);
  process.exit(1);
});
