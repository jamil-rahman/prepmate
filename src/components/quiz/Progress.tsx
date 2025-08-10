import type { ReactElement } from "react";
import type { ProgressProps } from "@/types";


export function Progress({ index, total, domain }: ProgressProps): ReactElement {
  const percent = Math.round(((index) / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-crisc-text-light">
          Question {index} of {total}
        </span>
        <span className="text-sm font-medium text-crisc-text-light">{domain}</span>
      </div>
      <div className="w-full rounded-full h-2 bg-gray-800">
        <div className="h-2 rounded-full transition-all duration-300 bg-crisc-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}