import type { ReactElement } from "react";

export function Hero(): ReactElement {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 heading-gradient">
        PrepMate
      </h1>
      <p className="text-crisc-primary text-2xl sm:text-3xl font-semibold mb-4">(Demo Version)</p>
      <p className="text-xl text-crisc-text-light/90 max-w-2xl mx-auto leading-relaxed">
        Practice multiple-choice questions across four different CRISC domains. Try our demo quiz - no sign-up required!
      </p>
    </div>
  );
}