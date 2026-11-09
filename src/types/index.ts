export type EducationLevel = 'SMP' | 'SMA/SMK' | 'Mahasiswa';

export type SubjectCategory =
  | 'Semua'
  | 'Matematika'
  | 'IPA & Sains'
  | 'Fisika'
  | 'Kimia'
  | 'Biologi'
  | 'Bahasa Indonesia'
  | 'Bahasa Inggris'
  | 'Teknologi & IT'
  | 'Sejarah & Sosial'
  | 'Ekonomi & Akuntansi';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  educationLevel?: EducationLevel;
  subject?: string;
  sources?: string[];
  error?: boolean;
}

export interface SummaryResult {
  id: string;
  title: string;
  overview: string;
  keyPoints: string[];
  keyConcepts: Array<{ term: string; definition: string }>;
  takeaway: string;
  originalWordCount: number;
  summaryWordCount: number;
  educationLevel: EducationLevel;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizResult {
  id: string;
  topic: string;
  educationLevel: EducationLevel;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  totalQuestions: number;
  correctAnswersCount: number;
  score: number; // 0 - 100
  timeSpentSeconds: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  questions: QuizQuestion[];
  completedAt: string;
  feedback?: string;
}

export type HistoryItemType = 'quiz' | 'summary' | 'tutor';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  title: string;
  timestamp: string;
  educationLevel: EducationLevel;
  badge?: string;
  score?: number;
  data: QuizResult | SummaryResult | { question: string; answer: string; subject?: string };
}

export interface UserProfile {
  name: string;
  educationLevel: EducationLevel;
  institution: string;
  majorOrGrade: string;
  targetDailyQuestions: number;
  targetDailyMinutes: number;
  streakDays: number;
  avatarSeed: string;
}
