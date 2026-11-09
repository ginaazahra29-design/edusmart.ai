import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Layers,
  Sparkles,
  HelpCircle,
  Timer,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Check,
  Send,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateAiQuiz } from '../api/client';
import { EducationLevel, QuizQuestion, QuizResult } from '../types';

export const QuizView: React.FC = () => {
  const {
    profile,
    updateUserProfile,
    addHistory,
    setCurrentView,
    setCurrentQuizResult,
  } = useApp();

  // Generator form state
  const [topic, setTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(profile.educationLevel);
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationStageIndex, setGenerationStageIndex] = useState(0);

  const generationStages = [
    'Menganalisis kurikulum & materi pembelajaran...',
    'Menyusun pilihan ganda dengan 4 opsi distraktor...',
    'Memvalidasi kunci jawaban & tingkat kesulitan...',
    'Menyusun pembahasan logis untuk setiap nomor...',
    'Finalisasi paket soal kuis EduSmart AI...',
  ];

  useEffect(() => {
    let timer: any = null;
    if (isGenerating) {
      setGenerationStageIndex(0);
      timer = setInterval(() => {
        setGenerationStageIndex((prev) => (prev + 1) % generationStages.length);
      }, 1300);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating]);

  // Active quiz session state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer interval during active quiz
  useEffect(() => {
    let interval: any = null;
    if (isQuizActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuizActive]);

  // Topic suggestion presets
  const presetTopics: Record<EducationLevel, string[]> = {
    SMP: [
      'Sistem Pencernaan Manusia',
      'Hukum Gerak Newton I, II, dan III',
      'Aljabar Dasar & Persamaan Linear',
      'Teks Eksplanasi & Kaidah Bahasa',
    ],
    'SMA/SMK': [
      'Termodinamika & Efisiensi Mesin Carnot',
      'Turunan Fungsi Aljabar & Nilai Maksimum',
      'Fotosintesis & Reaksi Kimia Kloroplas',
      'Stoikiometri & Konsentrasi Larutan',
      'Logika Penalaran Umum UTBK SNBT',
    ],
    Mahasiswa: [
      'Kompleksitas Algoritma Notasi Big-O',
      'Arsitektur Model MVC vs Microservices',
      'Uji Signifikansi & Regresi Linear Berganda',
      'Prinsip Mekanika Kuantum & Persamaan Schrödinger',
    ],
  };

  const handleSelectPreset = (t: string) => {
    setTopic(t);
    setErrorMessage(null);
  };

  const handleStartGeneration = async () => {
    if (!topic.trim()) {
      setErrorMessage('Topik kuis tidak boleh kosong. Masukkan nama bab atau materi yang ingin diuji.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const generated = await generateAiQuiz({
        topic: topic.trim(),
        educationLevel: selectedLevel,
        difficulty,
        questionCount,
      });

      if (!generated.questions || generated.questions.length === 0) {
        throw new Error('AI tidak berhasil menyusun soal kuis. Coba topik lain.');
      }

      setActiveQuestions(generated.questions);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setElapsedSeconds(0);
      setIsQuizActive(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menghasilkan kuis AI. Pastikan server terhubung.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = activeQuestions.length > 0 && answeredCount === activeQuestions.length;

  const handleSubmitQuiz = async () => {
    setShowSubmitConfirm(false);
    setIsQuizActive(false);

    // Calculate score
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuestions.length) * 100);

    const quizResult: QuizResult = {
      id: 'quiz_' + Date.now(),
      topic,
      educationLevel: selectedLevel,
      difficulty,
      totalQuestions: activeQuestions.length,
      correctAnswersCount: correctCount,
      score,
      timeSpentSeconds: elapsedSeconds,
      userAnswers,
      questions: activeQuestions,
      completedAt: new Date().toISOString(),
    };

    // Save to real-time database
    await addHistory({
      type: 'quiz',
      title: `Kuis ${topic}`,
      educationLevel: selectedLevel,
      score,
      badge: score >= 80 ? 'Nilai A' : score >= 60 ? 'Nilai B' : 'Latihan',
      data: quizResult,
    });

    // Confetti celebration if score >= 60
    if (score >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }

    setCurrentQuizResult(quizResult);
    setCurrentView('evaluation');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------- RENDER: QUIZ TAKER MODE -----------------
  if (isQuizActive && activeQuestions.length > 0) {
    const currentQ = activeQuestions[currentQuestionIndex];
    const currentAns = userAnswers[currentQ?.id];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Active Quiz Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {selectedLevel}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                Kesulitan: {difficulty}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 truncate max-w-md">{topic}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold">
              <Timer className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Answered progress */}
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900">{answeredCount}</span>
              <span className="text-slate-400">/{activeQuestions.length} Terjawab</span>
            </div>
          </div>
        </div>

        {/* Question Progress bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Navigator Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {activeQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-md'
                    : isAnswered
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main Question Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Soal Nomor {currentQuestionIndex + 1} dari {activeQuestions.length}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* 4 Choices (A, B, C, D) */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
              const isSelected = currentAns === optKey;
              return (
                <div
                  key={optKey}
                  onClick={() => handleSelectAnswer(optKey)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold transition-colors shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {optKey}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {currentQ.options[optKey]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Selesai &amp; Kumpulkan Kuis</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Kumpulkan Jawaban Kuis?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda telah menjawab <strong>{answeredCount}</strong> dari{' '}
                <strong>{activeQuestions.length}</strong> soal.{' '}
                {!isAllAnswered && (
                  <span className="text-amber-600 font-semibold block mt-1">
                    Peringatan: Masih ada {activeQuestions.length - answeredCount} soal yang belum dijawab.
                  </span>
                )}
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Ya, Kumpulkan Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------- RENDER: QUIZ GENERATOR MODE -----------------
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Kuis AI &amp; Pembahasan</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                JSON Structured
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Buat paket latihan pilihan ganda berkualitas tinggi. Kunci dirahasiakan hingga Anda selesai mengerjakan.
            </p>
          </div>
        </div>

        {/* Education Level Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 pl-2">Jenjang:</span>
          {(['SMP', 'SMA/SMK', 'Mahasiswa'] as EducationLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                updateUserProfile({ educationLevel: lvl });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Materi atau Topik Pelajaran:</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Contoh: Fotosintesis & Reaksi Terang, Aljabar Linear, Revolusi Industri, atau Hukum Archimedes..."
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium transition-all"
          />

          {/* Quick Preset Pills */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              Pilihan Cepat Materi Kurikulum ({selectedLevel}):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(presetTopics[selectedLevel] || presetTopics['SMA/SMK']).map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(t)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tingkat Kesulitan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mudah', 'Sedang', 'Sulit'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Jumlah Soal:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    questionCount === num
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {num} Soal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold hover:underline">
              Tutup
            </button>
          </div>
        )}

        {/* Progressive Loading Status Card */}
        {isGenerating && (
          <div className="p-4 rounded-xl bg-indigo-50/90 border border-indigo-200 text-indigo-900 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>EduSmart AI Sedang Memproses Kuis</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded">
                Flash Model Speed
              </span>
            </div>
            <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(95, (generationStageIndex + 1) * 20)}%` }}
              />
            </div>
            <p className="text-xs text-indigo-800 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>{generationStages[generationStageIndex]}</span>
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format 4 opsi (A-D) • Evaluasi otomatis • Pembahasan lengkap</span>
          </div>

          <button
            onClick={handleStartGeneration}
            disabled={isGenerating || !topic.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-indigo-600/20 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Menyusun Soal AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buat &amp; Mulai Kuis Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
