"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();

    const isAuth = pathname !== "/" && pathname !== "/login";
    const showBack = pathname.startsWith("/dashboard/");

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <nav className="bg-[var(--color-paper)] border-b border-[var(--color-line)] sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {showBack && (
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                    <Link
                        href="/dashboard"
                        className="font-semibold text-[var(--color-ink)]"
                    >
                        Expense Tracker
                    </Link>

                    {isAuth && (
                        <Link
                            href="/dashboard/summary"
                            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${pathname === "/dashboard/summary"
                                    ? "bg-[var(--color-forest)] text-white font-medium"
                                    : "border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]"
                                }`}
                        >
                            Summary
                        </Link>
                    )}
                </div>

                {isAuth && (
                    <button
                        onClick={handleLogout}
                        className="text-sm text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] transition-colors"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}