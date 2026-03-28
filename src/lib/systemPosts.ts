import { calculateStreak, isMilestone } from "./streak";

export type SystemPostType = "STREAK_MILESTONE" | "CONSTIPATION_ALERT";

export interface SystemPost {
  id: string;
  kind: "system";
  type: SystemPostType;
  userId: string;
  userName: string;
  avatarUrl: string;
  streak?: number;
  daysSinceLast?: number;
  createdAt: string;
  sortDate: string;
}

export interface UserForSystemPost {
  id: string;
  name: string;
  avatarUrl: string;
  posts: { createdAt: Date | string }[];
}

export function generateSystemPosts(
  users: UserForSystemPost[],
  networkUserIds: string[],
  today: Date = new Date()
): SystemPost[] {
  const systemPosts: SystemPost[] = [];

  for (const user of users) {
    const postDates = user.posts.map((p) =>
      typeof p.createdAt === "string" ? new Date(p.createdAt) : p.createdAt
    );
    const { currentStreak, isConstipated, lastPostDate, daysSinceLast } =
      calculateStreak(postDates, today);

    // Streak milestone: show for any user whose current streak is a milestone
    // Only show if the milestone was reached within the last 7 days
    if (
      currentStreak > 0 &&
      isMilestone(currentStreak) &&
      lastPostDate
    ) {
      systemPosts.push({
        id: `system-streak-${user.id}-${currentStreak}`,
        kind: "system",
        type: "STREAK_MILESTONE",
        userId: user.id,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        streak: currentStreak,
        createdAt: lastPostDate.toISOString(),
        sortDate: lastPostDate.toISOString(),
      });
    }

    // Constipation alert: only for network members
    if (isConstipated && networkUserIds.includes(user.id) && lastPostDate) {
      const alertDate = new Date(today);
      alertDate.setHours(0, 1, 0, 0); // Show near top of today
      systemPosts.push({
        id: `system-constipated-${user.id}`,
        kind: "system",
        type: "CONSTIPATION_ALERT",
        userId: user.id,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        daysSinceLast,
        createdAt: alertDate.toISOString(),
        sortDate: alertDate.toISOString(),
      });
    }
  }

  return systemPosts;
}

export function getStreakCopy(name: string, streak: number): string {
  const firstName = name.split(" ")[0];
  const messages: Record<number, string> = {
    3: `🔥 ${firstName} is on a 3-day poop streak! They say it takes 21 days to build a habit. ${firstName} is already 14% of the way there. The journey of a thousand miles begins with a single deposit.`,
    5: `🔥 ${firstName} is on a 5-day poop streak! Five consecutive days of professional excellence. Consistency is the foundation of every great career. Congratulations, ${firstName}.`,
    7: `🔥 ${firstName} is on a 7-day poop streak! One full week of uninterrupted value delivery. The market rewards those who show up every single day. This is what peak performance looks like.`,
    14: `🔥🔥 ${firstName} is on a 14-day poop streak! Two weeks of consecutive excellence. Most people quit before day 14. ${firstName} is not most people. This is what separating yourself from the competition looks like.`,
    30: `🔥🔥🔥 ${firstName} is on a 30-day poop streak! One full month of relentless consistency. They said it couldn't be done. ${firstName} said hold my fiber supplement. Truly an inspiration to us all.`,
  };
  return messages[streak] ?? `🔥 ${firstName} is on a ${streak}-day poop streak! Consistency is the foundation of every great professional. Congratulations.`;
}

export function getConstipationCopy(name: string, days: number): string {
  const firstName = name.split(" ")[0];
  return `👋 It looks like ${firstName} hasn't posted in ${days} day${days !== 1 ? "s" : ""}. Reach out and check on them — a supportive professional network makes all the difference. Sometimes all someone needs to know is that their network is thinking of them. 💩`;
}
