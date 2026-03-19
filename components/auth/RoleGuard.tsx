"use client";

import { useAuth } from "./AuthProvider";

export function RoleGuard({
  role,
  children,
  fallback,
}: {
  role: "admin" | "user";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-brand border-t-transparent" />
      </div>
    );
  }

  if (!profile || (role === "admin" && profile.role !== "admin")) {
    return fallback ?? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground/70">접근 권한이 없습니다</p>
        <p className="mt-2 text-sm text-foreground/50">이 페이지는 {role === "admin" ? "관리자" : "로그인한 사용자"}만 이용할 수 있습니다.</p>
      </div>
    );
  }

  return <>{children}</>;
}
