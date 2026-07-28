import type { Expense, ExpenseInput, ExpenseFilters, ExpenseSummary } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ApiEnvelope<T> {
    status: number;
    message: string;
    data: T;
}

export class ApiError extends Error { }

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new ApiError("Session expired, please log in again");
    }

    const body: ApiEnvelope<T> | null = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(body?.message || "Something went wrong");
    }

    return body!.data;
}

function buildQuery(filters?: ExpenseFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export const api = {
    login: (username: string, password: string) =>
        request<{ token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        }),

    getExpenses: (filters?: ExpenseFilters) =>
        request<Expense[]>(`/expenses${buildQuery(filters)}`),

    addExpense: (expense: ExpenseInput) =>
        request<string>("/expenses", {
            method: "POST",
            body: JSON.stringify(expense),
        }),

    updateExpense: (id: number, expense: ExpenseInput) =>
        request<Expense>(`/expenses/${id}`, {
            method: "PUT",
            body: JSON.stringify(expense),
        }),

    deleteExpense: (id: number) =>
        request<void>(`/expenses/${id}`, { method: "DELETE" }),

    getSummary: () => request<ExpenseSummary>("/expenses/summary"),

    setBudget: (monthlyBudget: number) =>
        request<void>("/expenses/budget", {
            method: "PUT",
            body: JSON.stringify({ monthlyBudget }),
        }),

    analyze: () => request<string>("/expenses/analyze"),
};

export async function downloadCsv() {
    const token = getToken();
    const res = await fetch(`${API_URL}/expenses/export`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError("Could not export CSV");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    window.URL.revokeObjectURL(url);
}