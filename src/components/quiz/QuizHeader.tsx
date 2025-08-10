import type { ReactElement } from "react";
import type { QuizHeaderProps } from "@/types";


export function QuizHeader({ title, subtitle }: QuizHeaderProps): ReactElement {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-crisc-text-light mb-2">{title}</h1>
      <p className="text-crisc-text-light">{subtitle}</p>
    </div>
  );
}