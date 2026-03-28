export interface StreakResult {
  currentStreak: number;
  isConstipated: boolean;
  lastPostDate: Date | null;
  daysSinceLast: number;
}

export const MILESTONE_DAYS = [3, 5, 7, 14, 30];

function toMidnightUTC(d: Date): number {
  const n = new Date(d);
  n.setUTCHours(0, 0, 0, 0);
  return n.getTime();
}

export function calculateStreak(
  postDates: Date[],
  today: Date = new Date()
): StreakResult {
  if (postDates.length === 0) {
    return { currentStreak: 0, isConstipated: false, lastPostDate: null, daysSinceLast: Infinity };
  }

  const todayMs = toMidnightUTC(today);
  const dayMs = 86_400_000;

  // Deduplicate to unique calendar days, sort descending
  const uniqueDays = Array.from(new Set(postDates.map(toMidnightUTC))).sort(
    (a, b) => b - a
  );

  const mostRecent = uniqueDays[0];
  const lastPostDate = new Date(mostRecent);
  const daysSinceLast = Math.floor((todayMs - mostRecent) / dayMs);

  // Constipated = last post was 3+ days ago
  const isConstipated = daysSinceLast >= 3;

  // Streak is only active if last post was today or yesterday
  if (daysSinceLast > 1) {
    return { currentStreak: 0, isConstipated, lastPostDate, daysSinceLast };
  }

  // Count consecutive days walking back from most recent post
  let streak = 0;
  let expected = mostRecent;

  for (const day of uniqueDays) {
    if (day === expected) {
      streak++;
      expected -= dayMs;
    } else {
      break;
    }
  }

  return { currentStreak: streak, isConstipated, lastPostDate, daysSinceLast };
}

export function isMilestone(streak: number): boolean {
  return MILESTONE_DAYS.includes(streak);
}
