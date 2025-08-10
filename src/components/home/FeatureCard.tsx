import type { ReactElement } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  iconPath: string;
}

export function FeatureCard({ title, description, iconPath }: FeatureCardProps): ReactElement {
  return (
    <div className="rounded-xl shadow-lg p-6 bg-crisc-card-dark">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-crisc-primary">
        <svg className="w-6 h-6 text-crisc-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-crisc-text-light mb-2">{title}</h3>
      <p className="text-crisc-text-light">{description}</p>
    </div>
  );
}