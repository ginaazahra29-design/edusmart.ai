import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Download,
  Layers,
  ArrowRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Clock,
  BookmarkCheck,
  CheckCircle2,
  Trash2,
  Zap,
  Square,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { summarizeMaterial, summarizeMaterialStream } from '../api/client';
import { parseMarkdownToSummary } from '../utils/summaryUtils';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { EducationLevel, SummaryResult } from '../types';

export const SummarizeView: React.FC = () => {
  const {
    profile,
    updateUserProfile,
    addHistory,
    setCurrentView,
    targetSummaryText,
    setTargetSummaryText,
    setTargetTutorQuery,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(profile.educationLevel);
  const [detailLevel, setDetailLevel] = useState<'singkat' | 'sedang' | 'mendalam'>('sedang');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sample presets for different educational levels
  const samples: Record<EducationLevel, { title: string; text: string }> = {
    SMP: {
      title: 'Materi SMP: Sistem Pencernaan Makanan pada Manusia',
      text: `Sistem pencernaan manusia adalah serangkaian organ yang berfungsi mengolah makanan menjadi nutrisi yang dapat diserap oleh tubuh untuk menghasilkan energi. Proses pencernaan terbagi menjadi dua, yaitu pencernaan mekanik (penghancuran makanan secara fisik menggunakan gigi dan gerakan peristaltik lambung) dan pencernaan kimiawi (pemecahan senyawa kompleks menjadi sederhana menggunakan enzim pencernaan).

Alur saluran pencernaan dimulai dari rongga mulut, di mana gigi memotong makanan dan kelenjar saliva mengeluarkan enzim ptialin (amilase) yang mengubah amilum menjadi maltosa. Setelah dikunyah, makanan membentuk bolus dan melewati faring menuju kerongkongan (esofagus). Di kerongkongan, gerakan peristaltik meremas dan mendorong makanan menuju lambung.

Di lambung, makanan dicerna secara mekanik oleh dinding otot lambung dan secara kimiawi oleh getah lambung yang mengandung Asam Klorida (HCl), enzim pepsin (memecah protein menjadi pepton), dan enzim renin (mengendapkan protein susu atau kasein). Asam lambung berfungsi membunuh kuman penyakit dan mengaktifkan pepsinogen menjadi pepsin.

Makanan kemudian masuk ke usus halus yang terdiri dari tiga bagian: duodenum (usus 12 jari), jejunum (usus kosong), dan ileum (usus penyerapan). Di duodenum, makanan bercampur dengan getah empedu dari hati untuk mengemulsikan lemak, serta enzim dari pankreas (amilase, tripsin, lipase). Pada bagian ileum, terdapat jutaan jonjot usus (vili) yang memperluas bidang penyerapan sari-sari makanan ke dalam pembuluh darah.

Sisa makanan yang tidak dapat diserap akan diteruskan ke usus besar (kolon). Usus besar berfungsi menyerap kelebihan air dan garam mineral, serta tempat pembusukan sisa makanan oleh bakteri menguntungkan Escherichia coli. Terakhir, sisa makanan berbentuk feses disimpan sementara di rektum sebelum dikeluarkan melalui anus.`,
    },
    'SMA/SMK': {
      title: 'Materi SMA: Hukum Termodinamika & Siklus Mesin Carnot',
      text: `Termodinamika merupakan cabang ilmu fisika yang mempelajari hubungan antara kalor (panas), kerja mekanik, temperatur, dan energi. Konsep dasar termodinamika dirumuskan dalam beberapa hukum utama.

Hukum Pertama Termodinamika merupakan prinsip kekekalan energi untuk sistem termodinamika. Hukum ini menyatakan bahwa kalor yang diserap oleh sistem (Q) sama dengan perubahan energi dalam sistem (ΔU) ditambah dengan usaha atau kerja (W) yang dilakukan oleh sistem terhadap lingkungannya, dirumuskan: Q = ΔU + W. Pada proses isotermal (suhu konstan), ΔU = 0 sehingga Q = W. Pada proses isokhorik (volume konstan), W = 0 sehingga Q = ΔU. Pada proses adiabatik, tidak ada pertukaran kalor antara sistem dan lingkungan (Q = 0), sehingga W = -ΔU.

Hukum Kedua Termodinamika membatasi arah aliran kalor secara spontan. Menurut pernyataan Clausius, kalor tidak dapat mengalir secara spontan dari benda dingin ke benda panas tanpa adanya usaha eksternal. Menurut Kelvin-Planck, tidak mungkin membangun suatu mesin kalor yang bekerja dalam satu siklus dan mengubah seluruh kalor yang diserap seluruhnya menjadi kerja tanpa membuang sebagian kalor ke reservoir berpendingin.

Sadi Carnot pada tahun 1824 mengusulkan siklus mesin kalor ideal yang beroperasi di antara dua reservoir temperatur (Thot dan Tcold). Siklus Carnot terdiri dari empat proses bolak-balik (reversibel):
1. Ekspansi isotermal pada suhu tinggi Thot, sistem menyerap kalor Qhot.
2. Ekspansi adiabatik, temperatur gas turun dari Thot ke Tcold.
3. Kompresi isotermal pada suhu rendah Tcold, sistem melepaskan kalor Qcold.
4. Kompresi adiabatik, gas kembali ke keadaan awal pada temperatur Thot.

Efisiensi termal maksimum dari mesin Carnot dirumuskan dengan rumus:
η = 1 - (Tcold / Thot) = 1 - (Qcold / Qhot)
di mana temperatur harus dinyatakan dalam skala Kelvin. Tidak ada mesin nyata yang dapat memiliki efisiensi melebihi efisiensi mesin Carnot ideal yang beroperasi pada batas temperatur yang sama karena adanya gesekan dan kehilangan energi.`,
    },
    Mahasiswa: {
      title: 'Materi Kuliah: Analisis Kompleksitas Waktu & Notasi Big-O',
      text: `Dalam ilmu komputer dan rekayasa perangkat lunak, efisiensi algoritma diukur secara teoritis menggunakan analisis asimtotik terhadap penggunaan sumber daya, terutama waktu eksekusi (Time Complexity) dan memori (Space Complexity), seiring dengan pertumbuhan ukuran masukan n menuju tak hingga (asymptotics).

Notasi Big-O (O) merepresentasikan batas atas (upper bound) asimtotik dari fungsi waktu eksekusi f(n). Secara formal, f(n) = O(g(n)) jika dan hanya jika terdapat konstanta positif c dan n0 sedemikian hingga f(n) <= c * g(n) untuk setiap n >= n0. Notasi ini mengabaikan faktor konstanta pengali dan suku-suku berderajat rendah karena tidak berpengaruh signifikan saat ukuran masukan n sangat besar.

Kelas-kelas kompleksitas waktu standar meliputi:
1. O(1) - Waktu Konstan (Constant Time): Waktu eksekusi tidak bergantung pada ukuran data n. Contoh: Mengakses elemen array berdasarkan indeks, operasi push/pop pada stack implementasi array.
2. O(log n) - Waktu Logaritmik: Algoritma yang membagi ruang pencarian menjadi setengah pada setiap langkah iterasi. Contoh klasik: Binary Search pada array yang telah terurut.
3. O(n) - Waktu Linear: Waktu eksekusi berbanding lurus secara linier dengan jumlah elemen data. Contoh: Linear search, traversal single linked-list.
4. O(n log n) - Waktu Linearitmik: Karakteristik algoritma pengurutan berbasis perbandingan yang optimal (comparison-based sorting). Contoh: Merge Sort dan Heap Sort (worst-case), serta Quick Sort (average-case).
5. O(n^2) - Waktu Kuadratik: Umumnya terjadi pada algoritma dengan loop bersarang (nested loops). Contoh: Bubble Sort, Selection Sort, Insertion Sort.
6. O(2^n) - Waktu Eksponensial: Pertumbuhan sangat cepat, umumnya pada algoritma rekursif brute-force tanpa memoization. Contoh: Penyelesaian Traveling Salesperson Problem (TSP) secara naive atau menghitung bilangan Fibonacci naif.

Analisis kompleksitas membantu perekayasa perangkat lunak memilih struktur data dan algoritma yang skalabel untuk menangani data skala masif (Big Data), di mana perbedaan antara algoritma O(n log n) dan O(n^2) menentukan kelangsungan operasional sistem produksi.`,
    },
  };

  useEffect(() => {
    if (targetSummaryText) {
      setInputText(targetSummaryText);
      setTargetSummaryText(null);
    }
  }, [targetSummaryText, setTargetSummaryText]);

  const handleApplySample = (level: EducationLevel) => {
    setSelectedLevel(level);
    setInputText(samples[level].text);
    setErrorMessage(null);
  };

  const handleStopSummarize = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSummarize = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorMessage('Teks materi pembelajaran belum dimasukkan. Silakan ketik atau tempelkan materi ajar Anda.');
      return;
    }

    if (trimmed.length < 25) {
      setErrorMessage('Materi terlalu pendek (minimal 25 karakter). Mohon masukkan materi ajar yang lebih lengkap.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setResult(null);
    setStreamedText('');
    setIsSaved(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let accumulated = '';
      try {
        accumulated = await summarizeMaterialStream(
          {
            text: trimmed,
            educationLevel: selectedLevel,
            detailLevel,
          },
          (chunk) => {
            accumulated += chunk;
            setStreamedText(accumulated);
          },
          controller.signal
        );
      } catch (streamErr: any) {
        if (controller.signal.aborted) {
          return;
        }
        console.warn('Summarize stream fallback to standard:', streamErr);
        const standardSummary = await summarizeMaterial({
          text: trimmed,
          educationLevel: selectedLevel,
          detailLevel,
        });
        setResult(standardSummary);
        await addHistory({
          type: 'summary',
          title: standardSummary.title,
          educationLevel: selectedLevel,
          badge: 'Rangkuman',
          data: standardSummary,
        });
        setIsSaved(true);
        setIsLoading(false);
        return;
      }

      if (accumulated.trim()) {
        const parsedSummary = parseMarkdownToSummary(accumulated, trimmed, selectedLevel);
        setResult(parsedSummary);

        // Save to real-time history
        await addHistory({
          type: 'summary',
          title: parsedSummary.title,
          educationLevel: selectedLevel,
          badge: 'Rangkuman',
          data: parsedSummary,
        });
        setIsSaved(true);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        console.error(err);
        setErrorMessage(err.message || 'Gagal memproses rangkuman materi. Silakan coba beberapa saat lagi.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const textToCopy = `# ${result.title}
Jenjang: ${result.educationLevel}

## Inti Pembahasan
${result.overview}

## Poin-Poin Penting
${result.keyPoints.map((p) => `- ${p}`).join('\n')}

## Konsep & Glosarium Kunci
${result.keyConcepts.map((c) => `- **${c.term}**: ${c.definition}`).join('\n')}

## Kesimpulan Akhir
${result.takeaway}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const textToCopy = `# ${result.title}\nJenjang: ${result.educationLevel}\n\n## Inti Pembahasan\n${result.overview}\n\n## Poin-Poin Penting\n${result.keyPoints.map((p) => `- ${p}`).join('\n')}\n\n## Konsep & Glosarium Kunci\n${result.keyConcepts.map((c) => `- **${c.term}**: ${c.definition}`).join('\n')}\n\n## Kesimpulan Akhir\n${result.takeaway}\n`;

    const blob = new Blob([textToCopy], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rangkuman-${result.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateQuizFromSummary = () => {
    if (!result) return;
    // Set view to quiz with suggested topic
    setCurrentView('quiz');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">AI Rangkuman Materi</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Bebas Halusinasi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tempelkan catatan belajar, diktat, atau artikel pembelajaran. Ekstrak judul, inti, poin penting &amp; glosarium.
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
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        {/* Sample Load Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Masukkan Teks Materi Pembelajaran:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px]">Coba Contoh Materi:</span>
            {(['SMP', 'SMA/SMK', 'Mahasiswa'] as EducationLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleApplySample(lvl)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Contoh {lvl}
              </button>
            ))}
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setResult(null);
                }}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Hapus Teks"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ketik atau tempelkan materi ajar di sini (misal: Bab Buku Kurikulum Merdeka, rangkuman guru, materi presentasi, atau artikel ilmiah)..."
            rows={8}
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 leading-relaxed transition-all resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mt-1">
            <span>
              Jumlah kata: <strong>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</strong> kata
            </span>
            <span>Minimal 25 karakter</span>
          </div>
        </div>

        {/* Configuration Bar & Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Detail Level Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Gaya Rangkuman:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              {(
                [
                  { id: 'singkat', label: 'Ringkas' },
                  { id: 'sedang', label: 'Sedang' },
                  { id: 'mendalam', label: 'Mendalam' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setDetailLevel(lvl.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    detailLevel === lvl.id
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Memproses Rangkuman Faktual...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>Buat Rangkuman AI</span>
              </>
            )}
          </button>
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
      </div>

      {/* Live Streaming Progress Panel */}
      {isLoading && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Zap className="w-4 h-4 animate-bounce text-emerald-600" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Streaming Rangkuman AI Secara Langsung</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                    LIVE
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Model sedang menyusun teks secara real-time. Anda dapat langsung membaca rangkuman saat sedang diketik:
                </p>
              </div>
            </div>

            <button
              onClick={handleStopSummarize}
              className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Hentikan proses streaming"
            >
              <Square className="w-3.5 h-3.5 fill-rose-600" />
              <span>Hentikan Stream</span>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 min-h-[140px] text-slate-800 text-sm leading-relaxed max-h-[420px] overflow-y-auto">
            {streamedText ? (
              <div className="prose-edusmart">
                <MarkdownRenderer content={streamedText} />
                <span className="inline-block w-2 h-4 bg-emerald-600 ml-1 animate-pulse align-middle" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs text-emerald-700 font-semibold py-6 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Menghubungkan ke Gemini Streaming Engine &amp; membaca materi...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Header of summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {result.educationLevel}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(result.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {isSaved && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersimpan di Riwayat</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{result.title}</h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Salin Rangkuman"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Hasil</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Unduh Markdown"
              >
                <Download className="w-4 h-4" />
                <span>Unduh .md</span>
              </button>

              <button
                onClick={handleCreateQuizFromSummary}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Jadikan Kuis</span>
              </button>
            </div>
          </div>

          {/* Compression Metrics badge */}
          <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Efisiensi Baca:{' '}
                <strong>
                  {result.originalWordCount} kata asli → {result.summaryWordCount} kata rangkuman
                </strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-200/60 font-bold text-emerald-800 text-[11px]">
              Hemat waktu baca{' '}
              {Math.max(
                0,
                Math.round(((result.originalWordCount - result.summaryWordCount) / (result.originalWordCount || 1)) * 100)
              )}
              %
            </span>
          </div>

          {/* 1. Inti Pembahasan (Overview) */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              1. Inti Pembahasan (Overview)
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm leading-relaxed">
              {result.overview}
            </div>
          </div>

          {/* 2. Poin-Poin Penting */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              2. Poin-Poin Penting &amp; Fakta Utama
            </h3>
            <ul className="space-y-2.5">
              {result.keyPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-200 flex items-start gap-3 text-sm text-slate-800 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Konsep & Glosarium Kunci */}
          {result.keyConcepts && result.keyConcepts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                3. Glosarium Konsep Kunci
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.keyConcepts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 hover:border-emerald-300 transition-colors"
                  >
                    <span className="text-xs font-bold text-emerald-800 block">{item.term}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Kesimpulan Akhir */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white space-y-2 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">
              4. Kesimpulan Akhir (Key Takeaway)
            </h3>
            <p className="text-sm leading-relaxed text-blue-100">{result.takeaway}</p>
          </div>
        </div>
      )}
    </div>
  );
};
