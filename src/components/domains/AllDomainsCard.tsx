import type { ReactElement } from "react";
import { ButtonLink } from "@/components/ui/Button";

export function AllDomainsCard(): ReactElement {
  return (
    <div className="text-center">
      <div className="rounded-xl shadow-lg p-8 max-w-2xl mx-auto bg-crisc-card-dark">
        <h3 className="text-2xl font-bold text-crisc-text-light mb-4">Practice All Domains</h3>
        <p className="text-crisc-text-light mb-6">
          Challenge yourself with questions from all four CRISC domains in a mixed format.
        </p>
        <ButtonLink href="/quiz?domain=all">Start Mixed Quiz (32 Questions)</ButtonLink>
      </div>
    </div>
  );
}