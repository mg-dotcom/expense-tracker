import axios, { isAxiosError } from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// inject token ทุก request อัตโนมัติ
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// handle 401 อัตโนมัติ
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (isAxiosError(err) && err.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export function getErrorMessage(err: unknown): string {
    if (isAxiosError(err)) return err.response?.data?.message ?? "Something went wrong";
    return "Something went wrong";
}

export async function downloadCsv() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/export`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Could not export CSV");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
}