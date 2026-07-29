export interface Expense {
  id: number;
  name: string;
  category: string;
  cost: number;
  date: string;
}

export interface ExpenseInput {
  name: string;
  category: string;
  cost: number;
}

export interface ExpenseSummary {
  byCategory: Record<string, number>;
  totalThisMonth: number;
  monthlyBudget: number | null;
  isOverBudget: boolean;
}

export interface ExpenseFilters {
  category?: string;
  from?: string;
  to?: string;
}

export type CardColor = "forest" | "rust" | "ink";