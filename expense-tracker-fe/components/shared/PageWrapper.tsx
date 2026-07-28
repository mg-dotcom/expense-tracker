import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
}

export default function PageWrapper({ children, title }: Props) {
  return (
    <div className="min-h-screen animate-fade-in">
      {title && (
        <div className="max-w-4xl mx-auto px-6 py-8 animate-slide-down">
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
        </div>
      )}
      <div className="animate-slide-up">{children}</div>
    </div>
  );
}