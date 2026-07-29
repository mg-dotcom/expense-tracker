"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getExpenses, getSummary, addExpense, updateExpense, deleteExpense, analyze } from "@/lib/expense-api";
import { downloadCsv } from "@/lib/api";
import type { Expense, ExpenseInput, ExpenseSummary } from "@/lib/types/expense";
import PageWrapper from "@/components/shared/PageWrapper";
import SummaryCards from "@/components/shared/dashboard/SummaryCards";
import ExpenseList from "@/components/shared/dashboard/ExpenseList";
import ExpenseFormModal from "@/components/shared/dashboard/ExpenseFormModal";

export default function DashboardPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState<ExpenseSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; expense?: Expense }>({ open: false });
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState("");

    const load = useCallback(async () => {
        try {
            const [exp, sum] = await Promise.all([getExpenses(), getSummary()]);
            setExpenses(exp);
            setSummary(sum);
        } catch {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { load(); }, [load]);

    async function handleSave(data: ExpenseInput) {
        if (modal.expense) {
            await updateExpense(modal.expense.id, data);
        } else {
            await addExpense(data);
        }
        await load();
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this expense?")) return;
        await deleteExpense(id);
        await load();
    }

    async function handleAnalyze() {
        setAnalyzing(true);
        setAnalysis("");
        try {
            const result = await analyze();
            setAnalysis(result);
        } catch {
            setAnalysis("Failed to analyze. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-[var(--color-ink)]/40">
                Loading...
            </div>
        );
    }

    return (
        <PageWrapper title="Dashboard">
            <div className="max-w-4xl mx-auto px-6 pb-12 flex flex-col gap-6">

                {/* Summary Cards */}
                {summary && <SummaryCards summary={summary} />}

                {/* Actions */}
                <div className="flex items-center justify-between animate-fade-in">
                    <h2 className="text-sm font-medium text-[var(--color-ink)]/60">
                        {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => downloadCsv()}
                            className="text-sm px-3 py-1.5 border border-[var(--color-line)] rounded-lg hover:bg-[var(--color-line)]/30 transition-colors"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="text-sm px-3 py-1.5 border border-[var(--color-forest)]/30 text-[var(--color-forest)] rounded-lg hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
                        >
                            {analyzing ? "Analyzing..." : "AI Analyze"}
                        </button>
                        <button
                            onClick={() => setModal({ open: true })}
                            className="text-sm px-3 py-1.5 bg-[var(--color-forest)] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                {/* AI Analysis Result */}
                {analysis && (
                    <div className="border border-[var(--color-forest)]/20 bg-[var(--color-forest-light)] rounded-xl p-4 text-sm text-[var(--color-ink)] animate-slide-down">
                        <p className="font-medium mb-1 text-[var(--color-forest)]">AI Analysis</p>
                        <p className="leading-relaxed">{analysis}</p>
                    </div>
                )}

                {/* Expense List */}
                <ExpenseList
                    expenses={expenses}
                    onEdit={(expense) => setModal({ open: true, expense })}
                    onDelete={handleDelete}
                />
            </div>

            {modal.open && (
                <ExpenseFormModal
                    expense={modal.expense}
                    onClose={() => setModal({ open: false })}
                    onSave={handleSave}
                />
            )}
        </PageWrapper>
    );
}