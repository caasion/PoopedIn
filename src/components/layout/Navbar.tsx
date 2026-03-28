"use client";

import Link from "next/link";
import UserSwitcher from "@/components/shared/UserSwitcher";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { safeMode, toggleSafeMode, mounted } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-[#0A66C2] rounded-md flex items-center justify-center text-white font-bold text-lg leading-none">
            💩
          </div>
          <span className="text-xl font-bold text-[#0A66C2] hidden sm:block">
            PoopedIn
          </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Safe Mode Toggle */}
          <button
            onClick={toggleSafeMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !mounted
                ? "bg-blue-50 text-blue-700"
                : safeMode
                ? "bg-blue-50 text-[#0A66C2] border border-[#0A66C2]"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <span>{mounted && !safeMode ? "👁️" : "🙈"}</span>
            <span className="hidden sm:inline">
              Safe Mode: {mounted ? (safeMode ? "ON" : "OFF") : "ON"}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* View as: label + user switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden md:block">
              Viewing as:
            </span>
            <UserSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
