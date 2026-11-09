import React from 'react';
import {
  HelpCircle,
  BookOpen,
  Layers,
  BarChart3,
  Flame,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationLevel } from '../types';

export const DashboardView: React.FC = () => {
  const {
    profile,
    setCurrentView,
    stats,
    history,
    setCurrentQuizResult,
    setTargetTutorQuery,
    setTargetSummaryText,
  } = useApp();

  const handleOpenQuizReview = (quizData: any) => {
    setCurrentQuizResult(quizData);
    setCurrentView('evaluation');
  };

  // Recommended topics based on education level
  const recommendedTopics: Record<EducationLevel, Array<{ topic: string; subject: string; difficulty: 'Mudah' | 'Sedang' | 'Sulit' }>> = {
    SMP: [
      { topic: 'Sistem Pencernaan Manusia & Fungsinya', subject: 'IPA & Sains', difficulty: 'Mudah' },
      { topic: 'Aljabar Dasar & Persamaan Linier Satu Variabel', subject: 'Matematika', difficulty: 'Sedang' },
      { topic: 'Struktur Teks Eksplanasi & Ciri Bahasa', subject: 'Bahasa Indonesia', difficulty: 'Mudah' },
      { topic: 'Tata Surya, Karakteristik Planet & Gerak Bulan', subject: 'IPA & Sains', difficulty: 'Sedang' },
    ],
    'SMA/SMK': [
      { topic: 'Hukum Termodinamika & Siklus Mesin Carnot', subject: 'Fisika', difficulty: 'Sedang' },
      { topic: 'Turunan Fungsi Aljabar & Nilai Maksimum/Minimum', subject: 'Matematika', difficulty: 'Sulit' },
      { topic: 'Sintesis Protein: Transkripsi & Translasi DNA', subject: 'Biologi', difficulty: 'Sedang' },
      { topic: 'Stoikiometri & Perhitungan Larutan Kimia', subject: 'Kimia', difficulty: 'Sedang' },
    ],
    Mahasiswa: [
      { topic: 'Analisis Kompleksitas Waktu Algoritma (Big-O Notation)', subject: 'Teknologi & IT', difficulty: 'Sulit' },
      { topic: 'Metodologi Penelitian: Regresi Linear Berganda & Uji Asumsi', subject: 'Ekonomi & Akuntansi', difficulty: 'Sulit' },
      { topic: 'Desain Pola Arsitektur Microservices & REST API', subject: 'Teknologi & IT', difficulty: 'Sedang' },
      { topic: 'Termodinamika Statistik & Distribusi Maxwell-Boltzmann', subject: 'Fisika', difficulty: 'Sulit' },
    ],
  };

  const levelRecommendations = recommendedTopics[profile.educationLevel] || recommendedTopics['SMA/SMK'];

  const quickStartTutor = (topic: string, subject: string) => {
    setTargetTutorQuery({ question: `Jelaskan secara komprehensif materi tentang: ${topic}`, subject });
    setCurrentView('tutor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Jenjang Aktif: {profile.educationLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Semangat Belajar, {profile.name}! 👋
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm max-w-xl">
              {profile.institution} • {profile.majorOrGrade}. Terus pertahankan ritme belajar cerdas bersama EduSmart AI.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15">
            <div className="p-2 rounded-lg bg-amber-500/30 text-amber-300">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-medium">Study Streak</p>
              <p className="text-lg font-extrabold text-white">{profile.streakDays} Hari Beruntun</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Kuis Diselesaikan</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalQuizzes}</div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Terdata di riwayat real-time</span>
          </p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Rata-rata Skor Kuis</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.averageQuizScore > 0 ? `${stats.averageQuizScore}/100` : '-'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats.averageQuizScore >= 80 ? 'Predikat Sangat Memuaskan' : stats.averageQuizScore > 0 ? 'Tingkatkan latihan Anda' : 'Belum ada kuis'}
          </p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Materi Dirangkum</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalSummaries}</div>
          <p className="text-[11px] text-slate-500 mt-1">Ekstraksi konsep & poin penting</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Tanya Tutor AI</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalTutorChats}</div>
          <p className="text-[11px] text-slate-500 mt-1">Jawaban + rujukan referensi</p>
        </div>
      </div>

      {/* Main Grid: Quick Action Cards + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Aksi Cepat Belajar</h2>
            <span className="text-xs text-slate-500">Pilih modul yang ingin digunakan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1 */}
            <div
              onClick={() => setCurrentView('tutor')}
              className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">Tanya Tutor AI</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Ajukan soal hitungan, konsep rumus, atau tugas sekolah Anda.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-100 group-hover:text-white">
                <span>Buka Percakapan</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 2 */}
            <div
              onClick={() => setCurrentView('summarize')}
              className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">Rangkum Materi</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Tempel teks artikel atau materi ajar untuk diringkas otomatis.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-100 group-hover:text-white">
                <span>Mulai Merangkum</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 3 */}
            <div
              onClick={() => setCurrentView('quiz')}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">Kuis AI Cerdas</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Uji pemahaman Anda dengan soal pilihan ganda &amp; pembahasan.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-100 group-hover:text-white">
                <span>Mulai Latihan</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Recommended topics for the current education level */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Rekomendasi Materi Pelajaran ({profile.educationLevel})
                </h3>
                <p className="text-xs text-slate-500">
                  Topik populer yang disesuaikan dengan kurikulum jenjang Anda saat ini
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
                Kurikulum Merdeka & PT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {levelRecommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.subject}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          item.difficulty === 'Mudah'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.difficulty === 'Sedang'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{item.topic}</p>
                  </div>
                  <button
                    onClick={() => quickStartTutor(item.topic, item.subject)}
                    className="shrink-0 p-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-colors cursor-pointer"
                    title="Pelajari dengan AI Tutor"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Riwayat Terkini</h2>
            <button
              onClick={() => setCurrentView('history')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Lihat Semua
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Belum ada riwayat aktivitas.</p>
                <button
                  onClick={() => setCurrentView('tutor')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Mulai aktivitas pertama Anda
                </button>
              </div>
            ) : (
              history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.type === 'quiz'
                            ? 'bg-indigo-100 text-indigo-700'
                            : item.type === 'summary'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.type === 'quiz' ? 'Kuis' : item.type === 'summary' ? 'Rangkuman' : 'Tutor'}
                      </span>
                      {typeof item.score === 'number' && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                          Skor {item.score}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {item.type === 'quiz' && (
                    <button
                      onClick={() => handleOpenQuizReview(item.data)}
                      className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 p-1"
                      title="Lihat Evaluasi Kuis"
                    >
                      Evaluasi
                    </button>
                  )}
                  {item.type === 'summary' && (
                    <button
                      onClick={() => {
                        setCurrentView('history');
                      }}
                      className="shrink-0 text-xs font-bold text-emerald-600 hover:text-emerald-800 p-1"
                      title="Lihat Rangkuman"
                    >
                      Buka
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Daily Goal card */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Target Harian</span>
              </span>
              <span>{stats.completedToday} / {profile.targetDailyQuestions} Selesai</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((stats.completedToday / (profile.targetDailyQuestions || 10)) * 100)
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Selesaikan kuis atau rangkum 1 materi lagi untuk mencapai target belajar harian Anda!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
