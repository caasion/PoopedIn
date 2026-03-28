"use client";

import { useUser } from "@/context/UserContext";

export default function UserSwitcher() {
  const { currentUserId, allUsers, setCurrentUserId, mounted } = useUser();

  if (!mounted || allUsers.length === 0) {
    return (
      <div className="h-8 w-36 bg-gray-100 rounded animate-pulse" />
    );
  }

  return (
    <select
      value={currentUserId ?? ""}
      onChange={(e) => setCurrentUserId(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
    >
      {allUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
