"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";
import { DashboardFullTracking } from "@/components/dashboard/DashboardFullTracking";
import { DashboardProgressTracking } from "@/components/dashboard/DashboardProgressTracking";

type DashboardView = "profile" | "full-tracking" | "progress-tracking";

export default function DashboardPage(): ReactElement {
  const [currentView, setCurrentView] = useState<DashboardView>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = (): ReactElement => {
    switch (currentView) {
      case "profile":
        return <DashboardProfile />;
      case "full-tracking":
        return <DashboardFullTracking />;
      case "progress-tracking":
        return <DashboardProgressTracking />;
      default:
        return <DashboardProfile />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Content Area */}
          <main className="p-4 lg:p-8">
            {/* Mobile sidebar toggle - integrated into content */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 p-2 rounded-md text-primary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Menu</span>
              </button>
            </div>
            
            {renderContent()}
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-secondary bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
