"use client";

import type { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import type { QuizCompleteProps } from "@/types";
import dynamic from "next/dynamic";

// Load confetti only on client when needed
const Confetti = dynamic(() => import("react-confetti"), { ssr: false, loading: () => null });

export function QuizComplete({ percentage, score, total, domainLabel, onRestart, onBack }: QuizCompleteProps): ReactElement {
  const passed = percentage >= 70;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-crisc-bg-dark">
      {passed && (
        <Confetti numberOfPieces={180} recycle={false} gravity={0.2} tweenDuration={4000} />
      )}
      <div className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center bg-crisc-card-dark">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-crisc-primary">
            <svg className="w-12 h-12 text-crisc-text-light" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-crisc-text-light mb-2">Quiz Complete!</h1>
          <p className="text-crisc-text-light">{domainLabel} • {total} Questions</p>
        </div>

        <div className="mb-8">
          <div className={`text-6xl font-bold mb-2 ${percentage >= 80 ? "text-green-600" : percentage >= 60 ? "text-yellow-600" : "text-red-600"}`}>
            {percentage}%
          </div>
          <p className="text-xl text-crisc-text-light mb-4">
            {score} out of {total} correct
          </p>
          <div className="w-full rounded-full h-3 bg-gray-800">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${percentage >= 80 ? "bg-success" : percentage >= 60 ? "bg-warning" : "bg-error"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRestart}>Retake Quiz</Button>
          <Button onClick={onBack} variant="outline">Choose Different Domain</Button>
        </div>
      </div>
    </div>
  );
}