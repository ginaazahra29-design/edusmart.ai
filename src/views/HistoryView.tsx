import React, { useState } from 'react';
import {
  History,
  Layers,
  BookOpen,
  HelpCircle,
  Search,
  Trash2,
  Calendar,
  ExternalLink,
  Award,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HistoryItem, HistoryItemType, QuizResult, SummaryResult } from '../types';

export const HistoryView: React.FC = () => {
  const {
    history,
    removeHistoryItem,
    clearHistory,
    setCurrentQuizResult,
    setCurrentView,
    setTargetTutorQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | HistoryItemType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLevel = item.educationLevel.toLowerCase().includes(q);
      return matchTitle || matchLevel;
    }
    return true;
  });

  const handleOpenItem = (item: HistoryItem) => {
    if (item.type === 'quiz') {
      setCurrentQuizResult(item.data as QuizResult);
      setCurrentView('evaluation');
    } else {
      setPreviewItem(item);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Hapus seluruh riwayat aktivitas belajar Anda? Tindakan ini tidak dapat dibatalkan.')) {
      clearHistory();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Riwayat Belajar &amp; Aktivitas</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                Tersimpan Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Catatan lengkap kuis, materi yang telah dirangkum, serta sesi tanya-jawab bersama AI Tutor.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Riwayat</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          {(
            [
              { id: 'all', label: 'Semua', count: history.length },
              { id: 'quiz', label: 'Kuis AI', count: history.filter((h) => h.type === 'quiz').length },
              { id: 'summary', label: 'Rangkuman', count: history.filter((h) => h.type === 'summary').length },
              { id: 'tutor', label: 'AI Tutor', count: history.filter((h) => h.type === 'tutor').length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi atau topik..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <History className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada riwayat aktivitas ditemukan.</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Coba gunakan kata kunci pencarian lain.' : 'Mulai belajar dengan Kuis, Rangkuman, atau AI Tutor!'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isQuiz = item.type === 'quiz';
            const isSummary = item.type === 'summary';
            const isTutor = item.type === 'tutor';

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isQuiz
                        ? 'bg-indigo-100 text-indigo-700'
                        : isSummary
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isQuiz ? (
                      <Layers className="w-5 h-5" />
                    ) : isSummary ? (
                      <BookOpen className="w-5 h-5" />
                    ) : (
                      <HelpCircle className="w-5 h-5" />
                    )}
                  </div>

                  {/* Title & metadata */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isQuiz
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : isSummary
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {isQuiz ? 'Kuis AI' : isSummary ? 'Rangkuman' : 'AI Tutor'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.educationLevel}
                      </span>
                      {typeof item.score === 'number' && (
                        <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Skor {item.score}/100
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(item.timestamp).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isQuiz ? 'Hasil Evaluasi' : 'Buka Detail'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus riwayat ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Preview for Rangkuman or Tutor */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Detail {previewItem.type === 'summary' ? 'Rangkuman' : 'Sesi Tutor'}
                </span>
                <h3 className="text-base font-bold text-slate-900">{previewItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {previewItem.type === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1">Inti Pembahasan:</p>
                    <p>{(previewItem.data as SummaryResult)?.overview}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">Poin Penting:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {(previewItem.data as SummaryResult)?.keyPoints?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50/60 rounded-xl text-blue-950">
                    <p className="font-bold mb-1">Kesimpulan:</p>
                    <p>{(previewItem.data as SummaryResult)?.takeaway}</p>
                  </div>
                </div>
              )}

              {previewItem.type === 'tutor' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-900">
                    <span className="font-bold block text-xs text-blue-600 mb-1">Pertanyaan Siswa:</span>
                    <p>{(previewItem.data as any)?.question}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap">
                    <span className="font-bold block text-xs text-slate-600 mb-2">Jawaban Tutor AI:</span>
                    <p>{(previewItem.data as any)?.answer}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
