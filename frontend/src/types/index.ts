export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  translation: string;
  sourceUrl?: string;
  sourceText?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed: Date | null;
  reviewCount: number;
  correctCount: number;
}

export interface TestQuestion {
  id: string;
  word: Word;
  type: 'multiple_choice' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface TestResult {
  id: string;
  questionId: string;
  wordId: string;
  isCorrect: boolean;
  userAnswer: string;
  timeSpent: number;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  createdAt: Date;
}