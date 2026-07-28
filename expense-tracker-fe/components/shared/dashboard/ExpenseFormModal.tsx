"use client";

import { useState, useEffect } from "react";
import type { Expense, ExpenseInput } from "@/lib/types";

interface Props {
    expense?: Expense;
    onClose: () => void;
    onSave: (data: ExpenseInput) => Promise<void>;
}

const CATEGORIES = ["อาหาร", "เดินทาง", "ช้อปปิ้ง", "บันเทิง", "สุขภาพ", "อื่นๆ"];

export default function ExpenseFormModal({ expense, onClose, onSave }: Props) {
    const [name, setName] = useState(expense?.name ?? "");
    const [category, setCategory] = useState(expense?.category ?? CATEGORIES[0]);
    const [cost, setCost] = useState(expense?.cost?.toString() ?? "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (Number(cost) <= 0) {
            setError("Amount must be greater than 0");
            return;
        }
        setLoading(true);
        try {
            await onSave({ name, category, cost: Number(cost) });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[var(--color-line)] animate-scale-in">
                <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-5">
                    {expense ? "Edit Expense" : "Add Expense"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-[var(--color-ink)]/60">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-[var(--color-ink)]/60">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors bg-white"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-[var(--color-ink)]/60">Amount (฿)</label>
                        <input
                            type="number"
                            min="0"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-forest)] transition-colors tabular"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-[var(--color-rust)] animate-shake">{error}</p>
                    )}

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--color-line)] rounded-lg py-2 text-sm hover:bg-[var(--color-line)]/30 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[var(--color-forest)] text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}