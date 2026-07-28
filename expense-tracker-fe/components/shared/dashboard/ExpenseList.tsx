"use client";

import type { Expense } from "@/lib/types";

interface Props {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
    if (expenses.length === 0) {
        return (
            <div className="text-center py-16 text-[var(--color-ink)]/40 animate-fade-in">
                No expenses yet
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 animate-slide-up">
            {expenses.map((expense, i) => (
                <div
                    key={expense.id}
                    className="flex items-center justify-between border border-[var(--color-line)] rounded-xl px-4 py-3 bg-white hover:border-[var(--color-forest)]/30 transition-all duration-200"
                    style={{ animationDelay: `${i * 30}ms` }}
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[var(--color-ink)]">
                            {expense.name}
                        </span>
                        <span className="text-xs text-[var(--color-ink)]/40">
                            {expense.category} · {new Date(expense.date).toLocaleDateString("th-TH")}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular text-[var(--color-ink)]">
                            ฿{expense.cost.toLocaleString()}
                        </span>
                        <button
                            onClick={() => onEdit(expense)}
                            className="text-xs text-[var(--color-ink)]/40 hover:text-[var(--color-forest)] transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(expense.id)}
                            className="text-xs text-[var(--color-ink)]/40 hover:text-[var(--color-rust)] transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}