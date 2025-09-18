"use client";

import type { ReactElement } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function DashboardProfile(): ReactElement {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Your Dashboard</h1>
        <p className="text-secondary text-lg">Track your progress and upgrade to unlock more features</p>
      </div>

      {/* Profile Card */}
      <div className="bg-primary-dark rounded-2xl p-8 border border-default card-shadow">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={`${user.displayName || user.email}'s profile`}
              className="w-24 h-24 rounded-full border-4 border-accent"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {user?.displayName || "Quiz Enthusiast"}
            </h2>
            <p className="text-secondary mb-4">{user?.email}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-accent-light text-accent rounded-full text-sm font-medium">
                Demo User
              </span>
              <span className="px-3 py-1 bg-mint-light text-mint rounded-full text-sm font-medium">
                Active Since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Recently"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="rounded-2xl p-8 text-white text-center" style={{
        background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-coral) 100%)"
      }}>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Ready to Unlock Your Full Potential?</h3>
          <p className="text-lg mb-6 text-white text-opacity-90">
            Upgrade to the full version and get access to hundreds of questions, detailed analytics, 
            progress tracking across multiple domains, and personalized study recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30"
            >
              View Full Features
            </Button>
            <Button className="bg-white text-accent hover:bg-opacity-90">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-dark rounded-xl p-6 border border-default card-shadow text-center">
          <div className="text-3xl font-bold text-accent mb-2">Demo</div>
          <div className="text-primary font-medium mb-1">Current Plan</div>
          <div className="text-sm text-secondary">Limited access to features</div>
        </div>
        <div className="bg-primary-dark rounded-xl p-6 border border-default card-shadow text-center">
          <div className="text-3xl font-bold text-mint mb-2">∞</div>
          <div className="text-primary font-medium mb-1">Practice Sessions</div>
          <div className="text-sm text-secondary">Available in demo</div>
        </div>
        <div className="bg-primary-dark rounded-xl p-6 border border-default card-shadow text-center">
          <div className="text-3xl font-bold text-coral mb-2">32</div>
          <div className="text-primary font-medium mb-1">Demo Questions</div>
          <div className="text-sm text-secondary">Across all domains</div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-primary-dark rounded-2xl p-8 border border-default card-shadow">
        <h3 className="text-xl font-bold text-primary mb-6 text-center">Demo vs Full Version</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo Features */}
          <div>
            <h4 className="text-lg font-semibold text-accent mb-4">Demo Version (Current)</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">32 practice questions</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Basic progress tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Question explanations</span>
              </li>
            </ul>
          </div>

          {/* Full Version Features */}
          <div>
            <h4 className="text-lg font-semibold text-coral mb-4">Full Version</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">500+ comprehensive questions</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Advanced analytics & insights</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Personalized study plans</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Multiple certification domains</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mint flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-secondary">Priority support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
