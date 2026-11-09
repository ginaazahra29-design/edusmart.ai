import React from 'react';
import { AlertTriangle, Key, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApiKeyBanner: React.FC = () => {
  const { hasApiKey, refreshApiStatus } = useApp();

  if (hasApiKey) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-amber-950">Konfigurasi API Diperlukan:</span>{' '}
            <span>
              Kunci API Gemini (<code>GEMINI_API_KEY</code>) belum terdeteksi di lingkungan server. Untuk mengaktifkan
              fitur AI Tutor, Rangkuman Materi, dan Kuis AI, pastikan API key telah terpasang di panel <strong>Settings &gt; Secrets</strong>.
            </span>
          </div>
        </div>
        <button
          onClick={() => refreshApiStatus()}
          className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs shadow-xs transition-colors cursor-pointer"
        >
          Cek Ulang Koneksi
        </button>
      </div>
    </div>
  );
};
