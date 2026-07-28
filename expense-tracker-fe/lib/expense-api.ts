import { api } from "./api";
import type { Expense, ExpenseInput, ExpenseFilters, ExpenseSummary } from "../types/types";

interface ApiEnvelope<T> {
    data: T;
}

export async function getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const { data } = await api.get<ApiEnvelope<Expense[]>>("/expenses", { params: filters });
    return data.data;
}

export async function addExpense(input: ExpenseInput): Promise<void> {
    await api.post("/expenses", input);
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<void> {
    await api.put(`/expenses/${id}`, input);
}

export async function deleteExpense(id: number): Promise<void> {
    await api.delete(`/expenses/${id}`);
}

export async function getSummary(): Promise<ExpenseSummary> {
    const { data } = await api.get<ApiEnvelope<ExpenseSummary>>("/expenses/summary");
    return data.data;
}

export async function setBudget(monthlyBudget: number): Promise<void> {
    await api.put("/expenses/budget", { monthlyBudget });
}

export async function analyze(): Promise<string> {
    const { data } = await api.get<ApiEnvelope<string>>("/expenses/analyze");
    return data.data;
}

export async function login(username: string, password: string): Promise<string> {
    const { data } = await api.post<ApiEnvelope<{ token: string }>>("/auth/login", { username, password });
    return data.data.token;
}