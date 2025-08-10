"use client";

import type { ReactElement } from "react";
import { memo, useMemo } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";

function CTABase(): ReactElement {
  const { user, loading } = useAuth();

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crisc-primary mr-3" />
          <span className="text-crisc-text-light">Loading...</span>
        </div>
      );
    }

    if (user) {
      return (
        <>
          <ButtonLink href="/domains">Start Quiz</ButtonLink>
          <div className="flex items-center justify-center text-crisc-text-light">
            Welcome back, {user.displayName || user.email?.split("@")[0]}!
          </div>
        </>
      );
    }

    return (
      <>
        <ButtonLink href="/domains">Try Demo Quiz</ButtonLink>
        <ButtonLink href="/auth" variant="outline">Sign In for More Features</ButtonLink>
      </>
    );
  }, [loading, user]);

  return (
    <div className="text-center">
      <div className="rounded-2xl shadow-xl p-8 max-w-2xl mx-auto bg-crisc-card-dark">
        <h2 className="text-2xl font-bold text-crisc-text-light mb-4">Ready to Start Practicing?</h2>
        <p className="text-crisc-text-light mb-8">
          Jump right into our demo quiz or sign in to track your progress across multiple attempts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">{content}</div>
      </div>
    </div>
  );
}

export const CTA = memo(CTABase);