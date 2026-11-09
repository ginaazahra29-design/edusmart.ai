import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Target,
  Flame,
  Save,
  Check,
  RotateCcw,
  BookOpen,
  Layers,
  HelpCircle,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationLevel } from '../types';

export const ProfileView: React.FC = () => {
  const { profile, updateUserProfile, stats } = useApp();

  const [formData, setFormData] = useState({
    name: profile.name,
    educationLevel: profile.educationLevel,
    institution: profile.institution,
    majorOrGrade: profile.majorOrGrade,
    targetDailyQuestions: profile.targetDailyQuestions,
    targetDailyMinutes: profile.targetDailyMinutes,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const badges = [
    {
      title: 'Pemula Berbakat',
      desc: 'Memulai perjalanan belajar di EduSmart AI',
      icon: <Award className="w-5 h-5 text-amber-500" />,
      unlocked: true,
    },
    {
      title: 'Master Kuis',
      desc: 'Menyelesaikan kuis dengan nilai sempurna',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      unlocked: stats.averageQuizScore >= 80,
    },
    {
      title: 'Pencatat Ulung',
      desc: 'Merangkum 3 atau lebih materi pembelajaran',
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      unlocked: stats.totalSummaries >= 3,
    },
    {
      title: 'Konsisten 5 Hari',
      desc: 'Mencapai study streak 5 hari berturut-turut',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      unlocked: profile.streakDays >= 5,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20 shrink-0">
          {profile.name.charAt(0)}
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
              {profile.educationLevel}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>{profile.institution} • {profile.majorOrGrade}</span>
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <strong>{profile.streakDays} Hari</strong> Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-500" />
              <strong>{stats.totalQuizzes}</strong> Kuis
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <strong>{stats.totalSummaries}</strong> Rangkuman
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Pengaturan Profil &amp; Preferensi Belajar</h2>
            <p className="text-xs text-slate-500">
              Perubahan jenjang pendidikan akan memperbarui bahasa dan kedalaman respon pada seluruh fitur AI.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs sm:text-sm">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Nama Lengkap Pelajar:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm"
              />
            </div>

            {/* Education Level Switcher */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Jenjang Pendidikan Aktif:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['SMP', 'SMA/SMK', 'Mahasiswa'] as EducationLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setFormData({ ...formData, educationLevel: lvl })}
                    className={`py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      formData.educationLevel === lvl
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Institution & Major */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Nama Sekolah / Kampus:</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Contoh: SMA Negeri 1 atau Universitas Indonesia"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Kelas / Jurusan / Program Studi:</label>
                <input
                  type="text"
                  value={formData.majorOrGrade}
                  onChange={(e) => setFormData({ ...formData, majorOrGrade: e.target.value })}
                  placeholder="Contoh: Kelas 11 MIPA atau Ilmu Komputer"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Target Daily Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Target Latihan Soal Harian:</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.targetDailyQuestions}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDailyQuestions: parseInt(e.target.value, 10) || 5 })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Target Waktu Belajar (Menit/Hari):</label>
                <input
                  type="number"
                  min={10}
                  max={240}
                  value={formData.targetDailyMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDailyMinutes: parseInt(e.target.value, 10) || 30 })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Profil Berhasil Diperbarui!</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">Data tersimpan aman di database server.</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Badges & Achievements (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Lencana Prestasi</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                Gamifikasi
              </span>
            </div>

            <div className="space-y-3">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    b.unlocked
                      ? 'border-slate-200 bg-slate-50/70'
                      : 'border-slate-100 bg-slate-50/20 opacity-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {b.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{b.title}</p>
                      {b.unlocked && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Privasi &amp; Keamanan Belajar</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Seluruh pertanyaan dan catatan pembelajaran Anda dienkripsi serta diproses secara aman melalui
              server backend tanpa pernah mengekspos kredensial API key ke sisi browser klien.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
