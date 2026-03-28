"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { UserSummary } from "@/types";

interface UserContextValue {
  currentUserId: string | null;
  currentUser: UserSummary | null;
  setCurrentUserId: (id: string) => void;
  allUsers: UserSummary[];
  safeMode: boolean;
  setSafeMode: (v: boolean) => void;
  toggleSafeMode: () => void;
  mounted: boolean;
}

const UserContext = createContext<UserContextValue>({
  currentUserId: null,
  currentUser: null,
  setCurrentUserId: () => {},
  allUsers: [],
  safeMode: true,
  setSafeMode: () => {},
  toggleSafeMode: () => {},
  mounted: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(null);
  const [safeMode, setSafeModeState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((users: UserSummary[]) => {
        setAllUsers(users);

        const storedId = localStorage.getItem("currentUserId");
        const validId =
          storedId && users.find((u) => u.id === storedId)
            ? storedId
            : users[0]?.id ?? null;
        setCurrentUserIdState(validId);

        const storedSafe = localStorage.getItem("safeMode");
        if (storedSafe !== null) {
          setSafeModeState(JSON.parse(storedSafe));
        }

        setMounted(true);
      });
  }, []);

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
    localStorage.setItem("currentUserId", id);
  };

  const setSafeMode = (v: boolean) => {
    setSafeModeState(v);
    localStorage.setItem("safeMode", JSON.stringify(v));
  };

  const toggleSafeMode = () => setSafeMode(!safeMode);

  const currentUser = allUsers.find((u) => u.id === currentUserId) ?? null;

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        currentUser,
        setCurrentUserId,
        allUsers,
        safeMode,
        setSafeMode,
        toggleSafeMode,
        mounted,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
