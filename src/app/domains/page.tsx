import type { ReactElement } from "react";
import { DomainCard } from "@/components/domains/DomainCard";
import { AllDomainsCard } from "@/components/domains/AllDomainsCard";
import type { DomainInfo } from "@/types";

const domains: DomainInfo[] = [
  {
    id: "Domain 1",
    title: "IT Risk Identification",
    description: "Identify and classify IT-related risks and their potential impact on business objectives.",
    questionCount: 8,
  },
  {
    id: "Domain 2", 
    title: "IT Risk Assessment",
    description: "Perform IT risk analysis to determine risk likelihood and impact.",
    questionCount: 8,
  },
  {
    id: "Domain 3",
    title: "Risk Response and Mitigation", 
    description: "Develop, implement and maintain a risk response strategy.",
    questionCount: 8,
  },
  {
    id: "Domain 4",
    title: "Risk and Control Monitoring and Reporting",
    description: "Establish and maintain risk monitoring and reporting systems.",
    questionCount: 8,
  },
];

export default function DomainsPage(): ReactElement {
  const accents: ("primary" | "blue" | "green" | "pink")[] = ["primary", "green", "pink", "blue"];
  return (
    <div className="min-h-screen bg-crisc-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 heading-gradient">Choose Your Domain</h1>
          <p className="text-xl text-crisc-text-light/90 max-w-3xl mx-auto">
            Select a CRISC domain to practice questions. Each domain focuses on specific risk management competencies.
          </p>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {domains.map((domain, idx) => (
            <DomainCard key={domain.id} domain={domain} accent={accents[idx % accents.length]} />
          ))}
        </div>

        {/* All Domains Option */}
        <AllDomainsCard />
      </div>
    </div>
  );
}