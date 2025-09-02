import type { ReactElement } from "react";
import { memo } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { DomainCardProps } from "@/types";

function DomainCardBase({ domain, accent = "primary" }: DomainCardProps): ReactElement {
  const accentColor =
    accent === "blue" ? "bg-mint" : accent === "green" ? "bg-mint" : accent === "pink" ? "bg-pink" : "bg-accent";

  return (
    <div className="card-shadow hover-lift overflow-hidden min-h-[260px] flex flex-col bg-primary-dark border border-default rounded-2xl">
      <div className={`h-1 ${accentColor}`} />
      <div className="p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary mb-2">{domain.title}</h2>
          <p className="text-secondary leading-relaxed">{domain.description}</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="inline-flex items-center text-sm text-muted rounded-md px-3 py-1 border border-default bg-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {domain.questionCount} Questions Available
          </div>
          <ButtonLink href={`/quiz?domain=${encodeURIComponent(domain.id)}`}>Start Quiz</ButtonLink>
        </div>
      </div>
    </div>
  );
}

export const DomainCard = memo(DomainCardBase);