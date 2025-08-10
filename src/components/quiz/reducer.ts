import type { QuizState, QuizAction } from "@/types";

export const initialQuizState: QuizState = {
  currentIndex: 0,
  selectedAnswer: null,
  showExplanation: false,
  score: 0,
  complete: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT": {
      const isCorrect = action.answer === action.correctAnswer;
      return {
        ...state,
        selectedAnswer: action.answer,
        showExplanation: true,
        score: isCorrect ? state.score + 1 : state.score,
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