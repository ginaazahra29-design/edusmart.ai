import React from 'react';
import {
  Sparkles,
  HelpCircle,
  BookOpen,
  Layers,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Clock,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationLevel } from '../types';

export const HomeView: React.FC = () => {
  const { setCurrentView, profile, updateUserProfile, setTargetTutorQuery, setTargetSummaryText } = useApp();

  const handleSelectLevel = (level: EducationLevel) => {
    updateUserProfile({ educationLevel: level });
  };

  const sampleTutor = (query: string, subject: string) => {
    setTargetTutorQuery({ question: query, subject });
    setCurrentView('tutor');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI Bimbingan Belajar Generasi Baru Terintegrasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Belajar Lebih Cepat, Paham Lebih Dalam dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              EduSmart AI
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Platform edukasi pintar untuk seluruh pelajar Indonesia — dari <span className="text-white font-semibold">SMP</span>,{' '}
            <span className="text-white font-semibold">SMA/SMK</span>, hingga <span className="text-white font-semibold">Mahasiswa</span>.
            Dapatkan tutor 24/7, rangkuman materi instan bebas halusinasi, dan kuis adaptif dengan pembahasan mendalam.
          </p>

          {/* Jenjang Selector Tabs in Hero */}
          <div className="pt-2 pb-2">
            <p className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-3">
              Pilih Jenjang Belajar Anda Sekarang:
            </p>
            <div className="inline-flex p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              {(['SMP', 'SMA/SMK', 'Mahasiswa'] as EducationLevel[]).map((lvl) => {
                const isActive = profile.educationLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => handleSelectLevel(lvl)}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-105'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('tutor')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Mulai Tanya Tutor AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Coba Kuis AI Interaktif</span>
            </button>
            <button
              onClick={() => setCurrentView('summarize')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Rangkum Catatan / Diktat</span>
            </button>
          </div>

          {/* Quick stats banner */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">100% Respons AI</p>
                <p className="text-[11px] text-slate-400">Bukan jawaban statis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Sertakan Referensi</p>
                <p className="text-[11px] text-slate-400">Validasi sumber terpercaya</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Adaptif 3 Jenjang</p>
                <p className="text-[11px] text-slate-400">SMP, SMA/SMK, Kuliah</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Evaluasi Real-time</p>
                <p className="text-[11px] text-slate-400">Tersimpan otomatis ke DB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Fitur Unggulan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tiga Pilar Pembelajaran Berbasis AI
          </h2>
          <p className="text-sm text-slate-600">
            Didesain khusus untuk meningkatkan pemahaman konsep, daya ingat materi, dan kesiapan ujian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Tutor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Tutor Interaktif &amp; Referensi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tanyakan soal hitungan, konsep sains, kaidah bahasa, hingga logika coding. AI memberikan penjelasan
                sistematis bertahap lengkap dengan <strong>referensi sumber belajar terpercaya</strong>.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">Coba Pertanyaan Cepat:</p>
                <button
                  onClick={() => sampleTutor('Jelaskan proses osmosis dan contohnya dalam kehidupan sehari-hari', 'Biologi')}
                  className="w-full text-left text-blue-600 hover:text-blue-800 hover:underline truncate block"
                >
                  &quot;Jelaskan proses osmosis dan contohnya...&quot;
                </button>
                <button
                  onClick={() => sampleTutor('Bagaimana cara mencari turunan pertama dari f(x) = 3x^2 + 5x - 7?', 'Matematika')}
                  className="w-full text-left text-blue-600 hover:text-blue-800 hover:underline truncate block"
                >
                  &quot;Cara mencari turunan f(x) = 3x^2 + 5x - 7...&quot;
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('tutor')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Buka AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: AI Summarize */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rangkuman Materi Terstruktur</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tempel bab buku, catatan guru/dosen, atau diktat kuliah. AI menyaringnya menjadi judul utama, overview
                padat, poin-poin kunci, serta glosarium istilah tanpa menambah informasi palsu.
              </p>
              <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Jaminan Faktual Teks Sumber</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Model divalidasi ketat untuk tidak mengarang fakta di luar bahan ajar yang Anda masukkan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('summarize')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Buat Rangkuman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: AI Quiz */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kuis AI &amp; Pembahasan Lengkap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tentukan materi, pilih tingkat kesulitan (Mudah, Sedang, Sulit), dan jumlah soal. Dapatkan soal pilihan ganda
                otentik dengan penilaian otomatis dan pembahasan logis tiap opsi.
              </p>
              <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-800">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Kunci Dirahasiakan Saat Mengerjakan</span>
                </div>
                <p className="text-[11px] text-indigo-700">
                  Jawaban & pembahasan baru dibuka setelah selesai untuk simulasi ujian yang objektif.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('quiz')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Mulai Kuis Cerdas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Target Audiences: SMP, SMA/SMK, Mahasiswa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Kurikulum &amp; Personalisasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Disesuaikan untuk Setiap Tingkat Pendidikan
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Bahasa, kedalaman rumus, dan contoh kasus secara dinamis berubah mengikuti jenjang yang Anda pilih.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SMP */}
              <div
                onClick={() => handleSelectLevel('SMP')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  profile.educationLevel === 'SMP'
                    ? 'bg-blue-600/30 border-blue-500 shadow-lg ring-2 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/30 text-blue-300">
                    Siswa SMP
                  </span>
                  {profile.educationLevel === 'SMP' && (
                    <span className="text-[11px] text-emerald-400 font-bold">Aktif Sekarang</span>
                  )}
                </div>
                <h4 className="font-bold text-base text-white mb-2">Pondasi Konsep &amp; Analogi Sederhana</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Penjelasan bersahabat, analogi dunia nyata yang menyenangkan, serta persiapan menghadapi asesmen sekolah
                  tanpa rumus yang membingungkan.
                </p>
              </div>

              {/* SMA/SMK */}
              <div
                onClick={() => handleSelectLevel('SMA/SMK')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  profile.educationLevel === 'SMA/SMK'
                    ? 'bg-blue-600/30 border-blue-500 shadow-lg ring-2 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/30 text-indigo-300">
                    SMA / SMK
                  </span>
                  {profile.educationLevel === 'SMA/SMK' && (
                    <span className="text-[11px] text-emerald-400 font-bold">Aktif Sekarang</span>
                  )}
                </div>
                <h4 className="font-bold text-base text-white mb-2">Penalaran Logis &amp; Persiapan UTBK</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Langkah penyelesaian sistematis rumus sains, matematika terapan, tes skolastik UTBK SNBT, dan penerapan
                  kejuruan praktis.
                </p>
              </div>

              {/* Mahasiswa */}
              <div
                onClick={() => handleSelectLevel('Mahasiswa')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  profile.educationLevel === 'Mahasiswa'
                    ? 'bg-blue-600/30 border-blue-500 shadow-lg ring-2 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/30 text-teal-300">
                    Mahasiswa
                  </span>
                  {profile.educationLevel === 'Mahasiswa' && (
                    <span className="text-[11px] text-emerald-400 font-bold">Aktif Sekarang</span>
                  )}
                </div>
                <h4 className="font-bold text-base text-white mb-2">Analisis Akademis &amp; Kajian Literatur</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pembahasan mendalam setara jurnal, metodologi penelitian, sintesis teori komprehensif, dan studi kasus
                  perkuliahan tingkat lanjut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold">Siap Menguasai Materi Pelajaran Hari Ini?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Coba langsung fitur AI Tutor, buat kuis latihan mandiri, atau rangkum materi ujian Anda sekarang secara gratis.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Buka Dashboard Belajar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
