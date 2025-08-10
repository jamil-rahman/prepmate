import type { ReactElement } from "react";
import type { QuestionCardProps } from "@/types";
import { Progress } from "@/components/quiz/Progress";


export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  isCorrect,
  questionNumber,
  totalQuestions,
}: QuestionCardProps): ReactElement {
  const options = [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
  ];

  const getOptionStyle = (optionKey: string): string => {
    const baseStyle = "quiz-option hover-lift";
    
    if (!selectedAnswer) {
      return `${baseStyle} text-crisc-text-light bg-crisc-card-dark border-crisc-border`;
    }
    
    if (selectedAnswer === optionKey) {
      if (showExplanation) {
        // Show correct/incorrect after selection
        return isCorrect 
          ? `${baseStyle} quiz-option-correct`
          : `${baseStyle} quiz-option-incorrect`;
      } else {
        // Selected but not yet revealed - use orange theme
        return `${baseStyle} quiz-option-selected`;
      }
    }
    
    if (showExplanation && optionKey === question.correctAnswer) {
      // Highlight correct answer
      return `${baseStyle} quiz-option-correct`;
    }
    
    // Unselected options
    return `${baseStyle} text-gray-400 cursor-not-allowed bg-gray-800 border-gray-600`;
  };



  return (
    <div className="w-full max-w-4xl mx-auto">
      <Progress index={questionNumber} total={totalQuestions} domain={question.domainType} />

      <div className="quiz-card premium-shadow glass-effect">
        {/* Question Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-crisc-primary">Question {questionNumber} of {totalQuestions}</span>
            <span className="text-sm font-medium text-crisc-text-muted">{question.domainType}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-crisc-text-light leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answer Options - Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {options.map((option, index) => (
            <button
              key={option.key}
              onClick={() => !selectedAnswer && onAnswerSelect(option.key)}
              disabled={!!selectedAnswer}
              className={getOptionStyle(option.key)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <span className="quiz-option-letter">
                  {option.key}
                </span>
                <span className="text-base md:text-lg font-medium flex-1 text-left">
                  {option.text}
                </span>
                {showExplanation && (
                  <span className="ml-2">
                    {option.key === question.correctAnswer && (
                      <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selectedAnswer === option.key && option.key !== question.correctAnswer && (
                      <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-8">
            <div className="quiz-explanation">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-crisc-primary">
                  <svg className="w-5 h-5 text-crisc-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-crisc-text-light">Explanation</h3>
              </div>
              <p className="text-crisc-text-light leading-relaxed mb-4">{question.explanation}</p>
              <div className="text-sm text-crisc-text-muted flex items-center gap-2">
                <span className="font-semibold">Correct Answer:</span>
                <span className="px-2 py-1 rounded-md bg-success-dark text-crisc-text-light">
                  {question.correctAnswer} - {options.find(opt => opt.key === question.correctAnswer)?.text}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}