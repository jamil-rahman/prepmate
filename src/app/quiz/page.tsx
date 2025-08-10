"use client";

import { useReducer } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import QuestionCard from "@/components/QuestionCard";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { Button } from "@/components/ui/Button";
import { QuizComplete } from "@/components/quiz/QuizComplete";
import type { ReactElement } from "react";
import { useQuestions } from "@/components/quiz/useQuestions";
import { initialQuizState, quizReducer } from "@/components/quiz/reducer";

export default function QuizPage(): ReactElement {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get("domain");
  const { questions, loading, error } = useQuestions(domain, user);
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  const handleAnswerSelect = (answer: string): void => {
    const correct = questions[state.currentIndex].correctAnswer;
    dispatch({ type: "SELECT", answer, correctAnswer: correct });
  };

  const handleNextQuestion = (): void => {
    dispatch({ type: "NEXT", total: questions.length });
  };

  const handleRestartQuiz = (): void => {
    dispatch({ type: "RESTART" });
  };

  const handleBackToDomains = (): void => {
    router.push("/domains");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crisc-bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-crisc-primary mx-auto mb-4" />
          <p className="text-crisc-text-light text-xl">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crisc-bg-dark">
        <div className="rounded-xl p-8 max-w-md mx-auto text-center bg-crisc-card-dark">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-crisc-text-light mb-4">Error Loading Quiz</h2>
          <p className="text-crisc-text-light mb-6">{error}</p>
          <button
            onClick={handleBackToDomains}
            className="text-crisc-text-light hover:opacity-80 px-6 py-3 rounded-lg font-medium bg-crisc-primary"
          >
            Back to Domains
          </button>
        </div>
      </div>
    );
  }

  if (state.complete) {
    const percentage = Math.round((state.score / questions.length) * 100);
    return (
      <QuizComplete
        percentage={percentage}
        score={state.score}
        total={questions.length}
        domainLabel={domain === "all" ? "Mixed Quiz" : (domain ?? "Quiz")}
        onRestart={handleRestartQuiz}
        onBack={handleBackToDomains}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[state.currentIndex];
  const isCorrect = state.selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen p-4 bg-crisc-bg-dark">
      <div className="max-w-6xl mx-auto py-8">
        {/* Optional Sign-up Banner for Anonymous Users */}
        {!user && (
          <div className="mb-6">
            <div className="rounded-xl p-4 text-center bg-crisc-card-dark">
              <p className="text-crisc-text-light text-sm mb-2">
                📊 Want to track your progress? Sign in to save your quiz attempts and see performance analytics!
              </p>
              <a 
                href="/auth"
                className="inline-flex items-center text-sm font-medium underline underline-offset-2 hover:opacity-80 text-crisc-primary"
              >
                Sign In for Progress Tracking →
              </a>
            </div>
          </div>
        )}

        <QuizHeader
          title={domain === "all" ? "Mixed Quiz" : (domain ?? "Quiz")}
          subtitle={user ? "Track your progress as you learn" : "Test your CRISC knowledge with practice questions"}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={state.selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showExplanation={state.showExplanation}
          isCorrect={isCorrect}
          questionNumber={state.currentIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Navigation */}
        {state.showExplanation && (
          <div className="text-center mt-8">
            <Button onClick={handleNextQuestion} className="px-8 py-4 rounded-xl font-semibold text-lg shadow-lg cursor-pointer">
              {state.currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}