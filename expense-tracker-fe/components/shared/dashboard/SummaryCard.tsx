import SummaryCard from "./SummaryCard";
import type { ExpenseSummary } from "@/types/types";

interface Props {
    summary: ExpenseSummary;
}

export default function SummaryCards({ summary }: Props) {
    const { totalThisMonth, monthlyBudget, isOverBudget } = summary;

    const budgetLeft = monthlyBudget != null ? monthlyBudget - totalThisMonth : null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-down">
            <SummaryCard
                title="This Month"
                value={`฿${totalThisMonth.toLocaleString()}`}
                color="ink"
            />
            <SummaryCard
                title="Budget"
                value={monthlyBudget != null ? `฿${monthlyBudget.toLocaleString()}` : "—"}
                color="forest"
            />
            <SummaryCard
                title="Remaining"
                value={budgetLeft != null ? `฿${Math.abs(budgetLeft).toLocaleString()}` : "—"}
                sub={isOverBudget ? "Over budget" : undefined}
                color={isOverBudget ? "rust" : "forest"}
            />
        </div>
    );
}