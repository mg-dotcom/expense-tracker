"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/expense-api";
import { getErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(username, password);
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm animate-scale-in">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">Expense Tracker</h1>
          <p className="text-sm text-[var(--color-ink)]/50 mt-1">Track your spending with AI insights</p>
        </div>

        {/* Card */}
        <div className="border border-[var(--color-line)] rounded-2xl p-8 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[var(--color-ink)]/60">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-forest)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[var(--color-ink)]/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-forest)] transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-rust)] animate-shake">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--color-forest)] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-ink)]/30 mt-6">
          Expense Tracker © 2026
        </p>
      </div>
    </div>
  );
}