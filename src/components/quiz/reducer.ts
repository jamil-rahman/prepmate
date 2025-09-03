import type { QuizState, QuizAction } from "@/types";

export const initialQuizState: QuizState = {
  currentIndex: 0,
  selectedAnswer: null,
  showExplanation: false,
  score: 0,
  answers: [],
  complete: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT": {
      const isCorrect = action.answer === action.correctAnswer;
      
      // Create answer record
      const answerRecord = {
        questionId: action.questionId,
        selectedAnswer: action.answer,
        isCorrect,
      };
      
      // Check if we already have an answer for this question (in case user changes their mind)
      const existingAnswerIndex = state.answers.findIndex(a => a.questionId === action.questionId);
      let updatedAnswers;
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        updatedAnswers = [...state.answers];
        updatedAnswers[existingAnswerIndex] = answerRecord;
      } else {
        // Add new answer
        updatedAnswers = [...state.answers, answerRecord];
      }
      
      // Calculate score from all answers
      const newScore = updatedAnswers.filter(a => a.isCorrect).length;
      
      return {
        ...state,
        selectedAnswer: action.answer,
        showExplanation: true,
        score: newScore,
        answers: updatedAnswers,
      };
    }
    case "NEXT": {
      const last = state.currentIndex >= action.total - 1;
      return last
        ? { ...state, complete: true }
        : { ...state, currentIndex: state.currentIndex + 1, selectedAnswer: null, showExplanation: false };
    }
    case "RESTART":
      return { ...initialQuizState };
    default:
      return state;
  }
}