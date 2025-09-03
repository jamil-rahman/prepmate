"use client";

import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { QuizCompleteProps, QuizSubmitRequest, QuizSubmitResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import dynamic from "next/dynamic";

// Load confetti only on client when needed
const Confetti = dynamic(() => import("react-confetti"), { ssr: false, loading: () => null });

export function QuizComplete({ 
  percentage, 
  score, 
  total, 
  domainLabel, 
  domainType, 
  answers, 
  onRestart, 
  onBack, 
  onSave 
}: QuizCompleteProps): ReactElement {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const passed = percentage >= 70;

  // Auto-save quiz results when component mounts (only for authenticated users)
  useEffect(() => {
    if (user && !saved && !saving) {
      saveQuizResults();
    }
  }, [user]); // Only depend on user, not saved/saving to prevent infinite loop

  const saveQuizResults = async (): Promise<void> => {
    if (!user || saving || saved) return;

    setSaving(true);
    try {
      const idToken = await user.getIdToken();
      
      const requestData: QuizSubmitRequest = {
        domainType,
        score: percentage,
        totalQuestions: total,
        correctAnswers: score,
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
        })),
      };
      
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result: QuizSubmitResponse = await response.json();
        if (result.success) {
          setSaved(true);
          onSave?.(true);
        } else {
          console.error("Failed to save quiz results:", result.error);
          onSave?.(false);
        }
      } else {
        console.error("Failed to save quiz results - HTTP", response.status);
        onSave?.(false);
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
      onSave?.(false);
    } finally {
      setSaving(false);
    }
  };
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
          {user && (
            <div className="mb-4">
              {saving ? (
                <p className="text-sm text-yellow-400 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400" />
                  Saving results...
                </p>
              ) : saved ? (
                <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Results saved to your dashboard
                </p>
              ) : null}
            </div>
          )}
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