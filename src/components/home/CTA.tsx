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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-3" />
          <span className="text-primary font-medium">Loading...</span>
        </div>
      );
    }

    if (user) {
      return (
        <>
          <ButtonLink href="/domains">Start Quiz</ButtonLink>
          <div className="flex items-center justify-center text-primary font-medium">
            Welcome back, {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}!
          </div>
        </>
      );
    }

    return (
      <>
        <ButtonLink href="/domains">Try Demo Quiz</ButtonLink>
        <ButtonLink href="/auth" variant="outline"><span className="text-primary font-medium">Sign In for More Features</span> </ButtonLink>
      </>
    );
  }, [loading, user]);

  return (
    <div className="text-center">
      <div className="rounded-2xl card-shadow p-8 max-w-2xl mx-auto bg-primary-dark border border-default">
        <h2 className="text-2xl font-bold text-primary mb-4">Ready to Start Practicing?</h2>
        <p className="text-primary mb-8 font-medium">
          Jump right into our demo quiz or sign in to track your progress across multiple attempts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">{content}</div>
      </div>
    </div>
  );
}

export const CTA = memo(CTABase);