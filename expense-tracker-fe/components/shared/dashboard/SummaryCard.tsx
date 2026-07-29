import type { CardColor } from "@/lib/types/expense"

interface Props {
    title: string;
    value: string;
    sub?: string;
    color?: CardColor;
}

export default function SummaryCard({ title, value, sub, color = "ink" }: Props) {
    const colors = {
        forest: "border-[var(--color-forest)]/20 bg-[var(--color-forest-light)]",
        rust: "border-[var(--color-rust)]/20 bg-[var(--color-rust-light)]",
        ink: "border-[var(--color-line)] bg-white",
    };

    const textColors = {
        forest: "text-[var(--color-forest)]",
        rust: "text-[var(--color-rust)]",
        ink: "text-[var(--color-ink)]",
    };

    return (
        <div className={`border rounded-xl p-5 transition-all duration-300 hover:scale-105 ${colors[color]}`}>
            <p className="text-sm text-[var(--color-ink)]/60">{title}</p>
            <p className={`text-3xl font-bold mt-2 tabular ${textColors[color]}`}>{value}</p>
            {sub && <p className="text-xs text-[var(--color-rust)] mt-1">{sub}</p>}
        </div>
    );
}