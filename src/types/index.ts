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
  onRestart: () => void;
  onBack: () => void;
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
}

export type QuizAction =
  | { type: "SELECT"; answer: string; correctAnswer: string }
  | { type: "NEXT"; total: number }
  | { type: "RESTART" };