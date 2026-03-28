"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserSummary } from "@/types";

interface UserContextValue {
  currentUserId: string | null;
  currentUser: UserSummary | null;
  safeMode: boolean;
  setSafeMode: (v: boolean) => void;
  toggleSafeMode: () => void;
  mounted: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  currentUserId: null,
  currentUser: null,
  safeMode: true,
  setSafeMode: () => {},
  toggleSafeMode: () => {},
  mounted: false,
  signOut: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const [safeMode, setSafeModeState] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    const res = await fetch("/api/me");
    const user: UserSummary | null = await res.json();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const storedSafe = localStorage.getItem("safeMode");
    if (storedSafe !== null) {
      setSafeModeState(JSON.parse(storedSafe));
    }

    fetchCurrentUser().then(() => setMounted(true));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCurrentUser();
    });

    return () => subscription.unsubscribe();
  }, [fetchCurrentUser]);

  const setSafeMode = (v: boolean) => {
    setSafeModeState(v);
    localStorage.setItem("safeMode", JSON.stringify(v));
  };

  const toggleSafeMode = () => setSafeMode(!safeMode);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUserId: currentUser?.id ?? null,
        currentUser,
        safeMode,
        setSafeMode,
        toggleSafeMode,
        mounted,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
