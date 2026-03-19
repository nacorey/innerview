"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/results", label: "결과/통계" },
  { href: "/admin/tools", label: "도구 관리" },
  { href: "/admin/workshops", label: "워크숍" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="flex w-56 flex-col border-r border-foreground/10 bg-coral-brand/5">
      <div className="flex h-14 items-center gap-2 border-b border-foreground/10 px-4">
        <Link href="/admin" className="text-lg font-bold">
          <span className="text-coral-brand">Admin</span>
        </Link>
        <span className="rounded bg-coral-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-coral-brand">
          관리자
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-coral-brand/10 font-medium text-coral-brand"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-foreground/10 p-3">
        <div className="mb-2 truncate text-xs text-foreground/40">
          {profile?.display_name ?? "관리자"}
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-foreground/10 py-1.5 text-center text-xs text-foreground/50 hover:bg-foreground/5"
          >
            사이트로
          </Link>
          <button
            onClick={signOut}
            className="flex-1 rounded-lg border border-foreground/10 py-1.5 text-xs text-foreground/50 hover:bg-foreground/5"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RoleGuard role="admin">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </RoleGuard>
    </AuthProvider>
  );
}
