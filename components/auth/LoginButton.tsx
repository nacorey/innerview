"use client";

import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "kakao";

const providerConfig: Record<Provider, { label: string; icon: string; bg: string; hover: string }> = {
  google: {
    label: "Google로 로그인",
    icon: "G",
    bg: "bg-white border border-gray-300 text-gray-700",
    hover: "hover:bg-gray-50",
  },
  kakao: {
    label: "카카오로 로그인",
    icon: "K",
    bg: "bg-[#FEE500] text-[#191919]",
    hover: "hover:bg-[#F5DC00]",
  },
};

export function LoginButton({
  provider,
  redirectTo,
}: {
  provider: Provider;
  redirectTo?: string;
}) {
  const config = providerConfig[provider];

  const handleLogin = async () => {
    const supabase = createClient();
    if (!supabase) {
      alert("Supabase가 연결되지 않았습니다. .env.local을 설정해 주세요.");
      return;
    }
    const callbackUrl = new URL("/callback", window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set("redirect", redirectTo);
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className={`flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${config.bg} ${config.hover}`}
    >
      <span className="text-lg font-bold">{config.icon}</span>
      {config.label}
    </button>
  );
}
