import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(n: number, hourOffset = 7): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hourOffset, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

const SEED_IMAGES = [
  { imageUrl: "/uploads/poop-seed-1.jpg", bristolType: "Type 7", confidence: 0.5403   },
  { imageUrl: "/uploads/poop-seed-2.jpg", bristolType: "Type 4", confidence: 0.3075 },
  { imageUrl: "/uploads/poop-seed-3.jpg", bristolType: "Type 7", confidence: 0.4392 },
  { imageUrl: "/uploads/poop-seed-4.jpg", bristolType: "Type 4", confidence: 0.3349 },
  { imageUrl: "/uploads/poop-seed-5.jpg", bristolType: "Type 7", confidence: 0.4035   },
];

function img(i: number) {
  return SEED_IMAGES[i % SEED_IMAGES.length];
}

async function main() {
  console.log("🌱 Seeding PoopedIn database...");

  // Clear existing data
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.repoop.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Frances Zhao",
        avatarUrl: "/avatars/frances-zhao.webp",
        bio: "Thought leader in synergizing synergies. I poop, therefore I am.",
        title: "Senior Defecation Analyst",
      },
    }),
    prisma.user.create({
      data: {
        name: "Smit Patel",
        avatarUrl: "/avatars/smit-patel.webp",
        bio: "Growth hacker. Disrupting the disruption disruptors. 🚀",
        title: "VP of Bowel Operations",
      },
    }),
    prisma.user.create({
      data: {
        name: "Kallie Zhang",
        avatarUrl: "/avatars/kallie-zhang.webp",
        bio: "Ex-FAANG. Building in public. Currently blocked.",
        title: "Chief Excrement Officer",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jennifer Park",
        avatarUrl: "/avatars/jennifer-park.webp",
        bio: "CMO by day. Content creator by night. Coffee by always.",
        title: "Director of Waste Management",
      },
    }),
    prisma.user.create({
      data: {
        name: "Andrew Law",
        avatarUrl: "/avatars/andrew-law.webp",
        bio: "14-day streak and counting. Consistency > talent.",
        title: "Poop Products Manager",
      },
    }),
    prisma.user.create({
      data: {
        name: "Isaac Ng",
        avatarUrl: "/avatars/isaac-ng.webp",
        bio: "Startup founder. Dog mom. Amateur pickleball enthusiast.",
        title: "Head of Elimination Strategy",
      },
    }),
  ]);

  const [david, sarah, marcus, jennifer, tyler, amanda] = users;
  console.log("✅ Created 6 users");

  // ── Posts ─────────────────────────────────────────────────────────────────
  // Tyler Brooks — 14-day streak (days 0–13)
  const tylerPosts = await Promise.all([
    prisma.post.create({ data: { userId: tyler.id, ...img(0), caption: "Day 1. Starting the journey. Every great career begins with a single step — or in this case, a single deposit. #Consistency", createdAt: daysAgo(13, 6) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(1), caption: "Day 2. The grind continues. Two days in and I can already feel the momentum building.", createdAt: daysAgo(12, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(2), caption: "Day 3. Consistency is a muscle. You don't build it in a day, but you build it day by day. 🔥 #3DayStreak", createdAt: daysAgo(11, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(3), caption: "Day 4. Still here. Still showing up. The market doesn't sleep and neither do I.", createdAt: daysAgo(10, 8) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(4), caption: "Day 5. Half a week strong. 🔥 If you're not posting daily, you're leaving gains on the table. #5DayStreak", createdAt: daysAgo(9, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(0), caption: "Day 6. Discipline is choosing between what you want now and what you want most.", createdAt: daysAgo(8, 6) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(1), caption: "Day 7. One full week. 🔥 They said it couldn't be done. They were wrong. #7DayStreak #ThoughtLeadership", createdAt: daysAgo(7, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(2), caption: "Day 8. Second week begins. Winners don't take days off.", createdAt: daysAgo(6, 8) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(3), caption: "Day 9. Your network is your net worth. Also your net girth. Showing up for both.", createdAt: daysAgo(5, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(4), caption: "Day 10. Double digits. The algorithm rewards those who never stop delivering.", createdAt: daysAgo(4, 6) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(0), caption: "Day 11. At this point it's not a habit, it's an identity.", createdAt: daysAgo(3, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(1), caption: "Day 12. I wake up at 4am every morning. The market doesn't sleep. Neither do I.", createdAt: daysAgo(2, 5) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(2), caption: "Day 13. One more day. Tomorrow I make history.", createdAt: daysAgo(1, 7) } }),
    prisma.post.create({ data: { userId: tyler.id, ...img(3), caption: "Day 14. 🔥🔥🔥 14 consecutive days. Nobody believed in me except me and my gastroenterologist. This is what winning looks like. #14DayStreak #Blessed", createdAt: daysAgo(0, 7) } }),
  ]);

  // David Chen — 7-day streak (days 0–6)
  const davidPosts = await Promise.all([
    prisma.post.create({ data: { userId: david.id, ...img(1), caption: "Grateful for this platform and all of you. Every morning I am reminded of what truly matters. 💩", createdAt: daysAgo(6, 8) } }),
    prisma.post.create({ data: { userId: david.id, ...img(2), caption: "Hot take: hustle culture is just culture. Change my mind.", createdAt: daysAgo(5, 9) } }),
    prisma.post.create({ data: { userId: david.id, ...img(3), caption: "LinkedIn is the only social network that rewards authenticity. Here is my authentic self.", createdAt: daysAgo(4, 7) } }),
    prisma.post.create({ data: { userId: david.id, ...img(4), caption: "Failure is just success that hasn't been leveraged yet. Keep going.", createdAt: daysAgo(3, 8) } }),
    prisma.post.create({ data: { userId: david.id, ...img(0), caption: "I wake up at 5am every morning and the first thing I do is deliver value. Today was no exception.", createdAt: daysAgo(2, 5) } }),
    prisma.post.create({ data: { userId: david.id, ...img(1), caption: "Your morning routine is a mirror of your professional ambitions. Mine is immaculate.", createdAt: daysAgo(1, 7) } }),
    prisma.post.create({ data: { userId: david.id, ...img(2), caption: "Excited to announce I've disrupted my own morning routine. Day 7 of showing up. #Consistency #ThoughtLeadership", createdAt: daysAgo(0, 8) } }),
  ]);

  // Sarah Mitchell — 5-day streak (days 0–4)
  const sarahPosts = await Promise.all([
    prisma.post.create({ data: { userId: sarah.id, ...img(2), caption: "Growth is not a destination. It's a direction. And mine is always forward.", createdAt: daysAgo(4, 9) } }),
    prisma.post.create({ data: { userId: sarah.id, ...img(3), caption: "The best time to start was yesterday. The second best time is right now. I chose right now.", createdAt: daysAgo(3, 8) } }),
    prisma.post.create({ data: { userId: sarah.id, ...img(4), caption: "Controversial opinion: if you're not measuring it, you're not managing it. I am measuring everything.", createdAt: daysAgo(2, 7) } }),
    prisma.post.create({ data: { userId: sarah.id, ...img(0), caption: "People ask me how I stay consistent. I tell them: I don't have a choice. This is who I am now.", createdAt: daysAgo(1, 8) } }),
    prisma.post.create({ data: { userId: sarah.id, ...img(1), caption: "5 days of uninterrupted value delivery. The market has spoken. 🔥 #5DayStreak #Growth", createdAt: daysAgo(0, 9) } }),
  ]);

  // Jennifer Park — 3-day streak (days 0–2)
  const jenniferPosts = await Promise.all([
    prisma.post.create({ data: { userId: jennifer.id, ...img(3), caption: "Day 1 of my new commitment to radical transparency. This is me, unfiltered.", createdAt: daysAgo(2, 10) } }),
    prisma.post.create({ data: { userId: jennifer.id, ...img(4), caption: "The algorithm rewards consistency. I am becoming the algorithm.", createdAt: daysAgo(1, 9) } }),
    prisma.post.create({ data: { userId: jennifer.id, ...img(0), caption: "3 days in. I've learned more about myself in 72 hours than in 3 years of executive coaching. #3DayStreak", createdAt: daysAgo(0, 10) } }),
  ]);

  // Amanda Foster — 2-day streak (days 0–1)
  const amandaPosts = await Promise.all([
    prisma.post.create({ data: { userId: amanda.id, ...img(4), caption: "My investors told me to build in public. This is as public as it gets.", createdAt: daysAgo(1, 11) } }),
    prisma.post.create({ data: { userId: amanda.id, ...img(0), caption: "Founders: stop waiting for the perfect moment. The perfect moment is when you go.", createdAt: daysAgo(0, 11) } }),
  ]);

  // Marcus Webb — CONSTIPATED (last post 4 days ago)
  const marcusPosts = await Promise.all([
    prisma.post.create({ data: { userId: marcus.id, ...img(1), caption: "I used to post every day. Then I got acquired and everything changed.", createdAt: daysAgo(30, 8) } }),
    prisma.post.create({ data: { userId: marcus.id, ...img(2), caption: "Back on my bullshit. New chapter, new metrics.", createdAt: daysAgo(15, 9) } }),
    prisma.post.create({ data: { userId: marcus.id, ...img(3), caption: "Shipping is a habit. I'm getting back into the habit.", createdAt: daysAgo(7, 8) } }),
    prisma.post.create({ data: { userId: marcus.id, ...img(4), caption: "Still here. Still building. The silence was intentional.", createdAt: daysAgo(4, 9) } }),
  ]);

  console.log("✅ Created posts");

  // ── Follows ──────────────────────────────────────────────────────────────
  const followPairs = [
    // David follows: Sarah, Marcus, Tyler, Jennifer
    [david.id, sarah.id], [david.id, marcus.id], [david.id, tyler.id], [david.id, jennifer.id],
    // Sarah follows: David, Amanda, Tyler
    [sarah.id, david.id], [sarah.id, amanda.id], [sarah.id, tyler.id],
    // Marcus follows: David, Sarah, Tyler
    [marcus.id, david.id], [marcus.id, sarah.id], [marcus.id, tyler.id],
    // Jennifer follows: David, Tyler, Amanda
    [jennifer.id, david.id], [jennifer.id, tyler.id], [jennifer.id, amanda.id],
    // Tyler follows: David, Sarah, Jennifer, Marcus, Amanda
    [tyler.id, david.id], [tyler.id, sarah.id], [tyler.id, jennifer.id], [tyler.id, marcus.id], [tyler.id, amanda.id],
    // Amanda follows: David, Tyler, Jennifer
    [amanda.id, david.id], [amanda.id, tyler.id], [amanda.id, jennifer.id],
  ];

  await Promise.all(
    followPairs.map(([followerId, followingId]) =>
      prisma.follows.create({ data: { followerId, followingId } })
    )
  );
  console.log("✅ Created follows");

  // ── Reactions ────────────────────────────────────────────────────────────
  type ReactionType = "POOP" | "CELEBRATE" | "INSIGHTFUL" | "CURIOUS" | "LOVE";
  const TYPES: ReactionType[] = ["POOP", "CELEBRATE", "INSIGHTFUL", "CURIOUS", "LOVE"];

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Tyler's Day 14 post — star post
  const tyler14 = tylerPosts[13];
  const tyler14Reactions: [string, ReactionType][] = [
    [david.id, "CELEBRATE"], [sarah.id, "CELEBRATE"], [jennifer.id, "LOVE"],
    [amanda.id, "CELEBRATE"], [marcus.id, "POOP"],
  ];
  await Promise.all(tyler14Reactions.map(([userId, type]) =>
    prisma.reaction.create({ data: { postId: tyler14.id, userId, type } })
  ));

  // Tyler's Day 7 milestone
  const tyler7 = tylerPosts[6];
  await Promise.all([
    prisma.reaction.create({ data: { postId: tyler7.id, userId: david.id, type: "CELEBRATE" } }),
    prisma.reaction.create({ data: { postId: tyler7.id, userId: sarah.id, type: "INSIGHTFUL" } }),
    prisma.reaction.create({ data: { postId: tyler7.id, userId: jennifer.id, type: "LOVE" } }),
  ]);

  // David's Day 7 post
  const david7 = davidPosts[6];
  await Promise.all([
    prisma.reaction.create({ data: { postId: david7.id, userId: sarah.id, type: "CELEBRATE" } }),
    prisma.reaction.create({ data: { postId: david7.id, userId: tyler.id, type: "POOP" } }),
    prisma.reaction.create({ data: { postId: david7.id, userId: marcus.id, type: "CURIOUS" } }),
    prisma.reaction.create({ data: { postId: david7.id, userId: jennifer.id, type: "INSIGHTFUL" } }),
  ]);

  // Sarah's 5-day post
  const sarah5 = sarahPosts[4];
  await Promise.all([
    prisma.reaction.create({ data: { postId: sarah5.id, userId: david.id, type: "CELEBRATE" } }),
    prisma.reaction.create({ data: { postId: sarah5.id, userId: tyler.id, type: "CELEBRATE" } }),
    prisma.reaction.create({ data: { postId: sarah5.id, userId: amanda.id, type: "LOVE" } }),
  ]);

  // Jennifer's 3-day post
  const jennifer3 = jenniferPosts[2];
  await Promise.all([
    prisma.reaction.create({ data: { postId: jennifer3.id, userId: david.id, type: "INSIGHTFUL" } }),
    prisma.reaction.create({ data: { postId: jennifer3.id, userId: tyler.id, type: "CELEBRATE" } }),
    prisma.reaction.create({ data: { postId: jennifer3.id, userId: amanda.id, type: "CURIOUS" } }),
  ]);

  // Scatter reactions across remaining posts
  const allPosts = [
    ...tylerPosts.slice(0, 13),
    ...davidPosts.slice(0, 6),
    ...sarahPosts.slice(0, 4),
    ...jenniferPosts.slice(0, 2),
    ...amandaPosts,
    ...marcusPosts,
  ];

  const allUserIds = users.map((u) => u.id);
  for (const post of allPosts) {
    const reactors = allUserIds
      .filter((uid) => uid !== post.userId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);

    for (const userId of reactors) {
      try {
        await prisma.reaction.create({
          data: { postId: post.id, userId, type: pick(TYPES) },
        });
      } catch {
        // Skip duplicate reactions (unique constraint)
      }
    }
  }
  console.log("✅ Created reactions");

  // ── Comments ──────────────────────────────────────────────────────────────
  const commentData = [
    // Tyler's Day 14
    { postId: tyler14.id, userId: david.id, content: "This is the most inspiring thing I have seen on this platform. Forwarding to my entire team.", createdAt: daysAgo(0, 8) },
    { postId: tyler14.id, userId: sarah.id, content: "Tyler I literally have this saved. I reference it in every 1:1 now. Thank you for being so brave.", createdAt: daysAgo(0, 9) },
    { postId: tyler14.id, userId: jennifer.id, content: "The consistency here is benchmark-worthy. I've been taking notes since Day 3.", createdAt: daysAgo(0, 10) },
    { postId: tyler14.id, userId: amanda.id, content: "Commenting for reach 🚀 But also genuinely inspired.", createdAt: daysAgo(0, 11) },

    // Tyler's Day 7
    { postId: tyler7.id, userId: sarah.id, content: "One week! The algorithm LOVES this. So do I.", createdAt: daysAgo(7, 10) },
    { postId: tyler7.id, userId: jennifer.id, content: "This resonates on so many levels. Sharing with my network.", createdAt: daysAgo(7, 11) },

    // David's Day 7
    { postId: david7.id, userId: tyler.id, content: "Great content David. You're building something special here. Keep going.", createdAt: daysAgo(0, 9) },
    { postId: david7.id, userId: sarah.id, content: "The form. The technique. The dedication. Simply put: incredible.", createdAt: daysAgo(0, 10) },
    { postId: david7.id, userId: jennifer.id, content: "I'm taking notes. This has prompted me to reflect on my own process.", createdAt: daysAgo(0, 11) },

    // Sarah's 5-day
    { postId: sarah5.id, userId: david.id, content: "5 days of excellence. You make the rest of us want to be better.", createdAt: daysAgo(0, 10) },
    { postId: sarah5.id, userId: amanda.id, content: "I aspire to your level of commitment. Thank you for being a role model.", createdAt: daysAgo(0, 12) },

    // Jennifer's 3-day
    { postId: jennifer3.id, userId: tyler.id, content: "Day 3! I remember my Day 3. Keep going, it only gets better from here.", createdAt: daysAgo(0, 11) },
    { postId: jennifer3.id, userId: sarah.id, content: "Wow. Just wow. Radical transparency at its finest.", createdAt: daysAgo(0, 12) },

    // Marcus's most recent (before he went silent)
    { postId: marcusPosts[3].id, userId: david.id, content: "Marcus! Great to see you back. The network missed you.", createdAt: daysAgo(4, 11) },
    { postId: marcusPosts[3].id, userId: sarah.id, content: "The silence was strategic I'm sure. Welcome back. 💩", createdAt: daysAgo(4, 12) },

    // Amanda's posts
    { postId: amandaPosts[0].id, userId: tyler.id, content: "Building in public is the highest form of courage. Respect.", createdAt: daysAgo(1, 12) },
    { postId: amandaPosts[1].id, userId: david.id, content: "Preach. Done is better than perfect. You are living proof.", createdAt: daysAgo(0, 12) },

    // Tyler Day 5
    { postId: tylerPosts[4].id, userId: david.id, content: "5 days! The gains are compounding.", createdAt: daysAgo(9, 8) },
  ];

  await Promise.all(
    commentData.map((c) => prisma.comment.create({ data: c }))
  );
  console.log("✅ Created comments");

  // ── Repoops ───────────────────────────────────────────────────────────────
  // Tyler repoops David's Day 7 post
  await prisma.repoop.create({
    data: { postId: david7.id, userId: tyler.id, createdAt: daysAgo(0, 9) },
  });
  // Sarah repoops Tyler's Day 14 post
  await prisma.repoop.create({
    data: { postId: tyler14.id, userId: sarah.id, createdAt: daysAgo(0, 10) },
  });
  // David repoops Jennifer's 3-day post
  await prisma.repoop.create({
    data: { postId: jennifer3.id, userId: david.id, createdAt: daysAgo(0, 11) },
  });
  console.log("✅ Created repoops");

  const totalPosts = await prisma.post.count();
  const totalReactions = await prisma.reaction.count();
  const totalComments = await prisma.comment.count();
  const totalFollows = await prisma.follows.count();

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   👤 Users: 6`);
  console.log(`   💩 Posts: ${totalPosts}`);
  console.log(`   ❤️  Reactions: ${totalReactions}`);
  console.log(`   💬 Comments: ${totalComments}`);
  console.log(`   🤝 Follows: ${totalFollows}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
