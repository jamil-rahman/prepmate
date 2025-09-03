export type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string | Date;
};

export type Question = {
  id: number;
  domainType: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
};

export interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showExplanation: boolean;
  isCorrect: boolean | null;
  questionNumber: number;
  totalQuestions: number;
}

export interface DomainInfo {
  id: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface DomainCardProps {
  domain: DomainInfo;
  accent?: "primary" | "blue" | "green" | "pink";
}

export interface QuizHeaderProps {
  title: string;
  subtitle: string;
}

export interface ProgressProps {
  index: number;
  total: number;
  domain: string;
}

export interface QuizCompleteProps {
  percentage: number;
  score: number;
  total: number;
  domainLabel: string;
  domainType: string;
  answers: QuizAnswer[];
  onRestart: () => void;
  onBack: () => void;
  onSave?: (saved: boolean) => void;
}

// Stats row types
export interface StatConfig {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
}

export interface StatCardProps {
  stat: StatConfig;
}


export interface QuizState {
  currentIndex: number;
  selectedAnswer: string | null;
  showExplanation: boolean;
  score: number;
  complete: boolean;
  answers: QuizAnswer[]; // Track individual answers for persistence
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export type QuizAction =
  | { type: "SELECT"; answer: string; correctAnswer: string; questionId: number }
  | { type: "NEXT"; total: number }
  | { type: "RESTART" };

// New types for quiz attempts and dashboard
export interface QuizAttempt {
  id: number;
  userId: string;
  domainType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string | Date;
  answers?: UserAnswer[];
}

export interface UserAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
  question?: Question;
}

export interface DashboardData {
  recentAttempts: QuizAttempt[];
  recentScores: {
    id: number;
    domainType: string;
    score: number;
    completedAt: string | Date;
  }[];
}

// API request/response types
export interface QuizSubmitRequest {
  domainType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface QuizSubmitResponse {
  success: boolean;
  data?: {
    attemptId: number;
    answersCreated: number;
  };
  error?: string;
  message?: string;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}


export type ButtonVariant = "primary" | "outline";

