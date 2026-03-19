"use client";

import { useSearchParams } from "next/navigation";
import { LoginButton } from "@/components/auth/LoginButton";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/my";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-4">
      <div className="w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="mt-2 text-sm text-foreground/60">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          <LoginButton provider="google" redirectTo={redirectTo} />
          <LoginButton provider="kakao" redirectTo={redirectTo} />
        </div>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-foreground/40">또는</span>
          </div>
        </div>

        {/* 게스트 모드 */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-foreground/50 underline-offset-4 hover:text-foreground/70 hover:underline"
          >
            로그인 없이 체험하기
          </Link>
          <p className="mt-1 text-xs text-foreground/30">
            결과가 저장되지 않습니다
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-brand border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
