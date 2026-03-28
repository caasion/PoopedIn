import Link from "next/link";
import { getStreakCopy, getConstipationCopy } from "@/lib/systemPosts";
import type { SystemPost } from "@/lib/systemPosts";

interface SystemPostCardProps {
  post: SystemPost;
}

export default function SystemPostCard({ post }: SystemPostCardProps) {
  const isStreak = post.type === "STREAK_MILESTONE";

  const message = isStreak
    ? getStreakCopy(post.userName, post.streak ?? 0)
    : getConstipationCopy(post.userName, post.daysSinceLast ?? 3);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* LinkedIn-style blue left accent */}
      <div className="flex">
        <div className="w-1 bg-[#0A66C2] shrink-0" />
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            {/* System avatar */}
            <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-2xl shrink-0">
              {isStreak ? "🔥" : "💩"}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#0A66C2] uppercase tracking-wide">
                  {isStreak ? "Poop Streak Achievement" : "Wellness Check"}
                </span>
                <span className="text-xs bg-[#EBF3FB] text-[#0A66C2] px-2 py-0.5 rounded-full font-medium">
                  {isStreak ? `🔥 ${post.streak}-Day Streak` : "👋 Check In"}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-800 leading-relaxed">{message}</p>

              {/* CTA */}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/profile/${post.userId}`}
                  className="text-sm font-semibold text-[#0A66C2] hover:underline"
                >
                  View {post.userName.split(" ")[0]}&apos;s profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
