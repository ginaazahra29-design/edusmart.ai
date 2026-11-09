import React from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Check,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizResult } from '../types';

export const EvaluationView: React.FC = () => {
  const {
    currentQuizResult,
    setCurrentQuizResult,
    setCurrentView,
    history,
    setTargetTutorQuery,
  } = useApp();

  const handleAskTutorAboutQuestion = (questionText: string, explanation: string) => {
    setTargetTutorQuery({
      question: `Saya belum paham dengan soal kuis ini: "${questionText}". Pembahasannya menyebutkan: "${explanation}". Bisakah Anda jelaskan lebih rinci dengan analogi atau contoh langkah pengerjaannya?`,
      subject: 'Kuis & Evaluasi',
    });
    setCurrentView('tutor');
  };

  const handleRetakeQuiz = () => {
    if (!currentQuizResult) return;
    // Switch to quiz view
    setCurrentView('quiz');
  };

  // If no quiz has been taken yet in the current session
  if (!currentQuizResult) {
    const pastQuizzes = history.filter((item) => item.type === 'quiz');

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Belum Ada Hasil Evaluasi Aktif</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Selesaikan sebuah Kuis AI untuk melihat kalkulasi nilai otomatis, analisis kelemahan, dan pembahasan lengkap tiap butir soal.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('quiz')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Mulai Kuis AI Sekarang</span>
        </button>

        {/* List of past quizzes from database history if available */}
        {pastQuizzes.length > 0 && (
          <div className="pt-8 border-t border-slate-200 text-left max-w-xl mx-auto space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Atau Buka Kembali Hasil Kuis Sebelumnya:
            </h3>
            <div className="space-y-2">
              {pastQuizzes.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentQuizResult(item.data as QuizResult);
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {item.educationLevel}
                    </span>
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-indigo-700">{item.score} / 100</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const {
    topic,
    educationLevel,
    difficulty,
    totalQuestions,
    correctAnswersCount,
    score,
    timeSpentSeconds,
    userAnswers,
    questions,
    completedAt,
  } = currentQuizResult;

  const wrongCount = totalQuestions - correctAnswersCount;

  const getScoreBadge = (sc: number) => {
    if (sc >= 85) {
      return {
        grade: 'A',
        label: 'Sangat Memuaskan! 🌟',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        summary: 'Pemahaman konsep Anda sangat mendalam dan matang. Pertahankan konsistensi ini!',
      };
    }
    if (sc >= 70) {
      return {
        grade: 'B',
        label: 'Bagus Sekali! 👍',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        barColor: 'bg-blue-600',
        summary: 'Anda menguasai sebagian besar materi dengan baik. Pelajari beberapa catatan evaluasi di bawah.',
      };
    }
    if (sc >= 50) {
      return {
        grade: 'C',
        label: 'Cukup Baik 📚',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        summary: 'Pondasi sudah ada, tetapi perlu memperdalam pemahaman detail konsep dengan AI Tutor.',
      };
    }
    return {
      grade: 'D',
      label: 'Perlu Latihan Tambahan 💡',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      summary: 'Jangan berkecil hati! Baca pembahasan mendalam di bawah dan ulangi kembali kuis ini.',
    };
  };

  const badgeInfo = getScoreBadge(score);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Score Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                Jenjang: {educationLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                Tingkat: {difficulty}
              </span>
              <span className="text-[11px] text-slate-400">
                {new Date(completedAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hasil Evaluasi: {topic}
            </h1>
            <p className="text-xs text-slate-500">{badgeInfo.summary}</p>
          </div>

          {/* Big Score Card */}
          <div className={`px-8 py-5 rounded-2xl border text-center shrink-0 ${badgeInfo.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider">Nilai Akhir</p>
            <div className="text-4xl sm:text-5xl font-black my-1">{score}</div>
            <p className="text-xs font-extrabold">Predikat: {badgeInfo.grade} ({badgeInfo.label})</p>
          </div>
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Jawaban Benar</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {correctAnswersCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Jawaban Keliru</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {wrongCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Waktu Pengerjaan</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Akurasi Soal</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">{score}%</div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentView('quiz')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Buat Kuis Baru</span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Lihat Riwayat Belajar</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTargetTutorQuery({
                question: `Tolong jelaskan secara mendalam konsep materi ini untuk persiapan evaluasi: ${topic}`,
                subject: 'Pembahasan Evaluasi',
              });
              setCurrentView('tutor');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span>Bimbingan dengan AI Tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question by Question Detailed Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Pembahasan &amp; Kunci Jawaban Lengkap</h2>
          <span className="text-xs text-slate-500">
            {totalQuestions} Soal Disertai Pembahasan Edukatif
          </span>
        </div>

        <div className="space-y-5">
          {questions.map((q, idx) => {
            const userChoice = userAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;
            const isUnanswered = userChoice === undefined;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all space-y-4 shadow-xs ${
                  isCorrect
                    ? 'border-emerald-200'
                    : isUnanswered
                    ? 'border-slate-200'
                    : 'border-rose-200'
                }`}
              >
                {/* Question title and result tag */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Soal Nomor {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Benar (+20)</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        <span>Tidak Dijawab</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Keliru</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 4 Choices with visual statuses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const isKeyCorrect = q.correctAnswer === optKey;
                    const isUserChoice = userChoice === optKey;

                    let choiceStyle = 'border-slate-200 bg-slate-50/50 text-slate-700';
                    let badgeStyle = 'bg-slate-200 text-slate-700';

                    if (isKeyCorrect) {
                      choiceStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isUserChoice && !isCorrect) {
                      choiceStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                      badgeStyle = 'bg-rose-500 text-white';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${choiceStyle}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${badgeStyle}`}>
                            {optKey}
                          </span>
                          <span className="truncate">{q.options[optKey]}</span>
                        </div>

                        {isKeyCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 shrink-0 uppercase tracking-wider">
                            Kunci Benar
                          </span>
                        )}
                        {isUserChoice && !isCorrect && (
                          <span className="text-[10px] font-bold text-rose-600 shrink-0">
                            Jawaban Anda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pembahasan Lengkap Box */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Pembahasan Lengkap:</span>
                    </span>

                    <button
                      onClick={() => handleAskTutorAboutQuestion(q.question, q.explanation)}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Tanyakan Soal Ini ke AI Tutor</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
