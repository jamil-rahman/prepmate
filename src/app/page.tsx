import type { ReactElement } from "react";
import { Hero } from "@/components/home/Hero";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { CTA } from "@/components/home/CTA";

export default function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-crisc-bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Hero />
        <FeaturesGrid />
        <CTA />
      </div>
    </div>
  );
}