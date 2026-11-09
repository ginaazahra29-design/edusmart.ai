import React from 'react';
import { GraduationCap, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                EduSmart <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform bimbingan belajar cerdas berbasis Artificial Intelligence modern yang disesuaikan untuk
              siswa SMP, SMA/SMK, hingga Mahasiswa di seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Sesuai Kurikulum Merdeka & Kurikulum PT</span>
            </div>
          </div>

          {/* Quick Fitur */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Fitur Edukasi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('tutor')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  AI Tutor Interaktif &amp; Referensi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('summarize')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  AI Rangkuman Materi Otomatis
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('quiz')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Kuis AI &amp; Pembahasan Lengkap
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('evaluation')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Hasil Evaluasi &amp; Analisis Nilai
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report')}
                  className="text-blue-400 font-semibold hover:underline transition-colors text-left flex items-center gap-1"
                >
                  <span>Laporan Proyek Resmi (Output Wajib)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Jenjang Belajar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Jenjang Pelajar</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Siswa SMP (Kelas 7, 8, 9)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Siswa SMA/SMK (Kelas 10, 11, 12 & UTBK)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Mahasiswa Sarjana &amp; Diploma</span>
              </li>
            </ul>
          </div>

          {/* Standar & Nilai */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Komitmen Kualitas</h4>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Award className="w-4 h-4" />
                <span>Faktual & Terverifikasi</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Setiap respon AI dirancang merujuk pada literatur ilmiah dan buku teks resmi, tanpa halusinasi buatan.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduSmart AI. Didukung oleh Gemini AI Flash Engine.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk kemajuan pendidikan pelajar Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
