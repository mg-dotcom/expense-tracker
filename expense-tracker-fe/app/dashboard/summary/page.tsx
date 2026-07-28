"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { ExpenseSummary } from "@/types/types";
import PageWrapper from "@/components/shared/PageWrapper";

export default function SummaryPage() {
    const router = useRouter();
    const [summary, setSummary] = useState<ExpenseSummary | null>(null);
    const [budget, setBudget] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await api.getSummary();
            setSummary(data);
            if (data.monthlyBudget) setBudget(data.monthlyBudget.toString());
        } catch (err) {
            if (err instanceof ApiError) router.push("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { load(); }, [load]);

    async function handleBudgetSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await api.setBudget(Number(budget));
            await load();
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-[var(--color-ink)]/40">
                Loading...
            </div>
        );
    }

    if (!summary) return null;

    const categories = Object.entries(summary.byCategory).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...categories.map(([, v]) => v), 1);

    return (
        <PageWrapper title="Summary">
            <div className="max-w-4xl mx-auto px-6 pb-12 flex flex-col gap-8">

                {/* Budget Setting */}
                <div className="border border-[var(--color-line)] rounded-xl p-5 bg-white animate-slide-down">
                    <h2 className="text-sm font-medium text-[var(--color-ink)] mb-4">
                        Monthly Budget
                    </h2>
                    <form onSubmit={handleBudgetSave} className="flex gap-2">
                        <input
                            type="number"
                            min="0"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. 10000"
                            className="flex-1 border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors tabular"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-[var(--color-forest)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </form>

                    {summary.monthlyBudget != null && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-[var(--color-ink)]/40 mb-1">
                                <span>฿{summary.totalThisMonth.toLocaleString()} spent</span>
                                <span>฿{summary.monthlyBudget.toLocaleString()} budget</span>
                            </div>
                            <div className="h-2 bg-[var(--color-line)] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min((summary.totalThisMonth / summary.monthlyBudget) * 100, 100)}%`,
                                        backgroundColor: summary.isOverBudget
                                            ? "var(--color-rust)"
                                            : "var(--color-forest)",
                                    }}
                                />
                            </div>
                            {summary.isOverBudget && (
                                <p className="text-xs text-[var(--color-rust)] mt-1">
                                    Over budget by ฿{(summary.totalThisMonth - summary.monthlyBudget).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Chart by Category */}
                <div className="border border-[var(--color-line)] rounded-xl p-5 bg-white animate-slide-up">
                    <h2 className="text-sm font-medium text-[var(--color-ink)] mb-5">
                        By Category
                    </h2>

                    {categories.length === 0 ? (
                        <p className="text-sm text-[var(--color-ink)]/40 text-center py-8">
                            No data yet
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {categories.map(([category, amount], i) => (
                                <div key={category} className="flex flex-col gap-1 animate-slide-up"
                                    style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-ink)]">{category}</span>
                                        <span className="tabular text-[var(--color-ink)]/60">
                                            ฿{amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-line)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-forest)] rounded-full transition-all duration-700"
                                            style={{
                                                width: `${(amount / max) * 100}%`,
                                                transitionDelay: `${i * 60}ms`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </PageWrapper>
    );
}