import { QuizQuestion } from '../types';

export function calculateQuizScore(
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  questions: QuizQuestion[]
): {
  score: number;
  correctCount: number;
  wrongCount: number;
  total: number;
} {
  if (!questions || questions.length === 0) {
    return { score: 0, correctCount: 0, wrongCount: 0, total: 0 };
  }

  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const total = questions.length;
  const wrongCount = total - correctCount;
  const score = Math.round((correctCount / total) * 100);

  return { score, correctCount, wrongCount, total };
}

export function getGradePredicate(score: number): {
  grade: 'A' | 'B' | 'C' | 'D';
  label: string;
} {
  if (score >= 85) {
    return { grade: 'A', label: 'Sangat Memuaskan' };
  }
  if (score >= 70) {
    return { grade: 'B', label: 'Bagus Sekali' };
  }
  if (score >= 50) {
    return { grade: 'C', label: 'Cukup Baik' };
  }
  return { grade: 'D', label: 'Perlu Latihan Tambahan' };
}
