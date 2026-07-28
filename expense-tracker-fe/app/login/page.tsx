"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

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
            const { token } = await api.login(username, password);
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="w-full max-w-sm animate-scale-in">
                <div className="border border-[var(--color-line)] rounded-2xl p-8 bg-white">
                    <h1 className="text-xl font-bold text-[var(--color-ink)] mb-6">
                        Sign in
                    </h1>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-[var(--color-ink)]/60">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-[var(--color-ink)]/60">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-[var(--color-rust)] animate-shake">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-[var(--color-forest)] text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}