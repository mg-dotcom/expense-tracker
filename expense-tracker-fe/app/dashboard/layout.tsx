import Navigation from "@/components/shared/Navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            {children}
        </>
    );
}