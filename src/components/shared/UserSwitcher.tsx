"use client";

import { useUser } from "@/context/UserContext";

export default function UserSwitcher() {
  const { currentUserId, allUsers, setCurrentUserId, mounted } = useUser();

  if (!mounted || allUsers.length === 0) {
    return <div className="w-24 h-8 bg-gray-100 rounded animate-pulse" />;
  }

  return (
    <select
      value={currentUserId ?? ""}
      onChange={(e) => setCurrentUserId(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] cursor-pointer"
    >
      {allUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
