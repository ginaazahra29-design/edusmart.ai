import { describe, it, expect } from 'vitest';
import { calculateQuizScore, getGradePredicate } from './quizUtils';
import { QuizQuestion } from '../types';

describe('Quiz Calculation Utilities', () => {
  const sampleQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Apa fungsi klorofil?',
      options: { A: 'Menyerap cahaya', B: 'Menyimpan air', C: 'Menghirup O2', D: 'Fotosintesis malam' },
      correctAnswer: 'A',
      explanation: 'Klorofil adalah pigmen hijau penangkap cahaya.',
    },
    {
      id: 2,
      question: 'Berapa hasil 5 + 7?',
      options: { A: '10', B: '11', C: '12', D: '13' },
      correctAnswer: 'C',
      explanation: '5 + 7 = 12.',
    },
    {
      id: 3,
      question: 'Ibukota Indonesia adalah?',
      options: { A: 'Bandung', B: 'Nusantara', C: 'Surabaya', D: 'Medan' },
      correctAnswer: 'B',
      explanation: 'IKN Nusantara.',
    },
    {
      id: 4,
      question: 'Satuan gaya dalam SI?',
      options: { A: 'Joule', B: 'Watt', C: 'Newton', D: 'Pascal' },
      correctAnswer: 'C',
      explanation: 'Gaya diukur dalam Newton.',
    },
  ];

  it('correctly calculates 100% score when all answers are correct', () => {
    const userAnswers = { 1: 'A' as const, 2: 'C' as const, 3: 'B' as const, 4: 'C' as const };
    const res = calculateQuizScore(userAnswers, sampleQuestions);
    expect(res.score).toBe(100);
    expect(res.correctCount).toBe(4);
    expect(res.wrongCount).toBe(0);
    expect(res.total).toBe(4);
  });

  it('correctly calculates partial score', () => {
    const userAnswers = { 1: 'A' as const, 2: 'A' as const, 3: 'B' as const, 4: 'D' as const };
    const res = calculateQuizScore(userAnswers, sampleQuestions);
    expect(res.score).toBe(50);
    expect(res.correctCount).toBe(2);
    expect(res.wrongCount).toBe(2);
  });

  it('handles unanswered questions gracefully', () => {
    const userAnswers = { 1: 'A' as const };
    const res = calculateQuizScore(userAnswers, sampleQuestions);
    expect(res.score).toBe(25);
    expect(res.correctCount).toBe(1);
    expect(res.wrongCount).toBe(3);
  });

  it('assigns correct grade predicates', () => {
    expect(getGradePredicate(100).grade).toBe('A');
    expect(getGradePredicate(85).grade).toBe('A');
    expect(getGradePredicate(75).grade).toBe('B');
    expect(getGradePredicate(60).grade).toBe('C');
    expect(getGradePredicate(40).grade).toBe('D');
  });
});
