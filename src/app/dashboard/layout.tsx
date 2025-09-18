import type { ReactElement, ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): ReactElement {
  return (
    <div className="min-h-screen bg-primary">
      {children}
    </div>
  );
}
