"use client";

import type { ReactElement } from "react";
import { useAuth } from "@/lib/auth-context";

type DashboardView = "profile" | "full-tracking" | "progress-tracking";

interface DashboardSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface SidebarItemProps {
  view: DashboardView;
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  icon: ReactElement;
  label: string;
  description: string;
}

function SidebarItem({ view, currentView, onViewChange, icon, label, description }: SidebarItemProps): ReactElement {
  const isActive = currentView === view;

  return (
    <button
      onClick={() => onViewChange(view)}
      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-accent text-white shadow-md"
          : "text-primary hover:bg-accent-light hover:text-accent"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${isActive ? "text-white" : "text-accent"}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${isActive ? "text-white" : "text-primary"}`}>
            {label}
          </div>
          <div className={`text-sm mt-1 ${isActive ? "text-white text-opacity-90" : "text-secondary"}`}>
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}

export function DashboardSidebar({ currentView, onViewChange, isOpen, onToggle }: DashboardSidebarProps): ReactElement {
  const { user, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-primary-dark lg:border-r lg:border-default">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="p-6 border-b border-default">
            <div className="flex items-center gap-3 mb-4">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={`${user.displayName || user.email}'s profile`}
                  className="w-10 h-10 rounded-full border-2 border-accent"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-primary truncate">
                  {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0]}
                </h2>
                <p className="text-sm text-secondary truncate">Dashboard</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem
              view="profile"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Profile"
              description="Account overview & upgrade options"
            />
            <SidebarItem
              view="full-tracking"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              label="Full Tracking"
              description="Last 4 attempts with detailed answers"
            />
            <SidebarItem
              view="progress-tracking"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Progress Tracking"
              description="Last 10 attempts with scores & dates"
            />
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-default">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-4 rounded-lg text-primary hover:bg-coral-light hover:text-coral transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-primary-dark border-r border-default transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="p-6 border-b border-default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={`${user.displayName || user.email}'s profile`}
                    className="w-10 h-10 rounded-full border-2 border-accent"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-primary truncate">
                    {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0]}
                  </h2>
                  <p className="text-sm text-secondary truncate">Dashboard</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-md text-primary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem
              view="profile"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Profile"
              description="Account overview & upgrade options"
            />
            <SidebarItem
              view="full-tracking"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              label="Full Tracking"
              description="Last 4 attempts with detailed answers"
            />
            <SidebarItem
              view="progress-tracking"
              currentView={currentView}
              onViewChange={onViewChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Progress Tracking"
              description="Last 10 attempts with scores & dates"
            />
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-default">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-4 rounded-lg text-primary hover:bg-coral-light hover:text-coral transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
