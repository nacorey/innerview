"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AuthContext {
  user: User | null;
  session: Session | null;
  profile: { role: "user" | "admin"; display_name: string | null; avatar_url: string | null } | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthContext["profile"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Supabase 미연결 시 로딩만 해제
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 프로필 조회 헬퍼 (실패해도 안전)
    async function fetchProfile(client: SupabaseClient, userId: string) {
      try {
        const { data } = await client
          .from("profiles")
          .select("role, display_name, avatar_url")
          .eq("id", userId)
          .single();
        if (isMounted) setProfile(data as AuthContext["profile"]);
      } catch {
        if (isMounted) setProfile(null);
      }
    }

    // 1) getSession(): 메모리/스토리지에서 즉시 세션 반환 → isLoading 해제 보장
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        fetchProfile(supabase, session.user.id);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    // 2) onAuthStateChange: 로그인/로그아웃/토큰 갱신 시 후속 반영
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        // getSession()이 이미 초기 상태를 처리했으므로 INITIAL_SESSION은 건너뜀
        if (event === "INITIAL_SESSION") return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(supabase, session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
