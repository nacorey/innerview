"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

function UserNav() {
  const { user, profile, signOut, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          <span className="text-amber-brand">Inner</span>View
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
            진단 도구
          </Link>
          {user && (
            <>
              <Link href="/my" className="text-sm text-foreground/60 hover:text-foreground">
                마이페이지
              </Link>
              <Link href="/my/integrated" className="text-sm text-foreground/60 hover:text-foreground">
                통합 프로필
              </Link>
            </>
          )}
          {!isLoading && (
            user ? (
              <button
                onClick={signOut}
                className="rounded-lg border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 hover:bg-foreground/5"
              >
                {profile?.display_name ?? "로그아웃"}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-amber-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-brand/90"
              >
                로그인
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserNav />
      <div className="flex-1">{children}</div>
    </AuthProvider>
  );
}
