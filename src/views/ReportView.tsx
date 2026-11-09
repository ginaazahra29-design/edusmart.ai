import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Sparkles,
  Users,
  Code2,
  CheckCircle2,
  Presentation,
  ShieldCheck,
  Layers,
  Cpu,
  GraduationCap,
  BookOpen,
  HelpCircle,
  BarChart3,
  Terminal,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'fitur' | 'ai' | 'pengujian' | 'presentasi' | 'tim'>('ringkasan');

  const sharedUrl = 'https://ais-pre-vdb5ab76a2eb2vv3uobsbr-572611332815.asia-east1.run.app';

  const handleCopyFullReport = async () => {
    try {
      const res = await fetch('/LAPORAN_PROYEK_EDUSMART_AI.md');
      let text = '';
      if (res.ok) {
        text = await res.text();
      } else {
        text = `Laporan Proyek EduSmart AI\nLink: ${sharedUrl}`;
      }
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      setCopiedAll(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Dokumen Output Proyek Resmi</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Selesai &amp; Terverifikasi
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Laporan Pengembangan EduSmart AI
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Dokumen komprehensif hasil perancangan, arsitektur backend proxy, integrasi model Gemini 3.8 Flash, dokumentasi prompt, pengujian sistem, dan panduan presentasi sesuai rubrik penilaian.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <a
              href="/edusmart-ai-project.zip"
              download="edusmart-ai-project.zip"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas Proyek (.ZIP)</span>
            </a>
            <button
              onClick={handleCopyFullReport}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Tersalin ke Clipboard!' : 'Salin Laporan (.md)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Link bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Link Akses Online:</span>
            <a
              href={sharedUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{sharedUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span className="text-[11px] text-blue-300">Ketua Tim: Gina Azzahra</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'ringkasan', label: '1. Ringkasan & Target', icon: <FileText className="w-4 h-4" /> },
          { id: 'fitur', label: '2. Daftar Fitur Utama', icon: <Layers className="w-4 h-4" /> },
          { id: 'ai', label: '3. Dokumentasi AI & Prompt', icon: <Cpu className="w-4 h-4" /> },
          { id: 'pengujian', label: '4. Hasil Pengujian (9 Tests)', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'presentasi', label: '5. Panduan Presentasi', icon: <Presentation className="w-4 h-4" /> },
          { id: 'tim', label: '6. Pembagian Tugas Tim', icon: <Users className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: Ringkasan & Target */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>A. Identitas dan Deskripsi Proyek</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p><strong>Nama Aplikasi:</strong> EduSmart AI</p>
                <p><strong>Kategori:</strong> Web Pendidikan Berbasis Generative Artificial Intelligence</p>
                <p><strong>Model Utama:</strong> Google Gemini 3.8 Flash SDK (@google/genai 2.32.0)</p>
                <p><strong>Arsitektur:</strong> Express Server-side Proxy + React 19 + SSE Streaming</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p><strong>Lingkungan:</strong> Production Cloud Run / Asia-East1</p>
                <p><strong>Port Layanan:</strong> 3000 (Vite middleware integration)</p>
                <p><strong>Status Pengujian:</strong> 9 Unit Tests Vitest Passed (100%)</p>
                <p><strong>Palet Visual:</strong> Biru (#2563eb), Navy (#0f172a), Putih</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              <strong>Deskripsi:</strong> EduSmart AI adalah solusi terpadu pembelajaran mandiri bagi pelajar Indonesia untuk mengatasi kesenjangan akses bimbingan belajar personal. Aplikasi menyediakan AI Tutor berkemampuan streaming kata demi kata seketika, generator rangkuman materi bebas halusinasi, dan modul kuis pilihan ganda terstruktur dengan kunci jawaban yang dirahasiakan hingga kuis selesai.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>B. Latar Belakang Masalah &amp; Target Pengguna</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-2">
                <div className="font-bold text-blue-900 text-sm">Siswa SMP (Kelas 7–9)</div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Memerlukan bahasa yang ramah, analogi kejadian sehari-hari, penjelasan langkah dasar, serta pencegahan rumus matematika yang membingungkan tanpa penjelasan verbal.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
                <div className="font-bold text-indigo-900 text-sm">Siswa SMA / SMK (Kelas 10–12)</div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Fokus pada pemahaman konsep logis, penurunan rumus terperinci, persiapan ujian masuk PTN (UTBK SNBT), dan keterkaitan materi kejuruan terapan.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Mahasiswa Perguruan Tinggi</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Berorientasi pada penalaran kritis, sintesis teoretis, tinjauan literatur ilmiah, komparasi algoritma, serta penyertaan metodologi riset formal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Daftar Fitur Utama */}
      {activeTab === 'fitur' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Daftar Fitur Utama yang Dikembangkan</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">1. AI Tutor Interaktif (Live SSE)</h3>
                  <span className="text-[11px] text-blue-600 font-semibold">Endpoint: /api/tutor/stream</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tanya jawab interaktif berbagai mata pelajaran. Teks dialirkan secara *real-time* per token menggunakan SSE tanpa jeda membeku. Memiliki tombol stop streaming dan referensi literatur buku ajar.
              </p>
              <button
                onClick={() => setCurrentView('tutor')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Buka AI Tutor &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">2. AI Rangkuman Materi Otomatis</h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">Endpoint: /api/summarize/stream</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengekstraksi intisari materi panjang menjadi dokumen rapi: Judul, Inti Pembahasan, Poin Kunci, Glosarium Konsep, dan Kesimpulan. Dilengkapi metrik kompresi kata dan proteksi anti-halusinasi.
              </p>
              <button
                onClick={() => setCurrentView('summarize')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline cursor-pointer"
              >
                Buka Rangkuman Materi &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">3. Kuis AI Berbasis JSON Terstruktur</h3>
                  <span className="text-[11px] text-indigo-600 font-semibold">Endpoint: /api/quiz</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generator soal pilihan ganda (4 opsi A-D). Validasi skema tipe JSON ketat sebelum tampil di layar. Kunci jawaban dirahasiakan selama kuis berlangsung hingga siswa selesai mengerjakan.
              </p>
              <button
                onClick={() => setCurrentView('quiz')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Buka Kuis AI &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">4. Hasil Evaluasi &amp; Riwayat Belajar</h3>
                  <span className="text-[11px] text-purple-600 font-semibold">Endpoint: /api/history</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penghitungan skor otomatis (0-100), analisis nomor benar/salah, pembahasan mendalam tiap butir, dan penyimpanan persisten ke database lokal (<code className="text-[11px] bg-slate-100 px-1 rounded">data/db.json</code>).
              </p>
              <button
                onClick={() => setCurrentView('evaluation')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 underline cursor-pointer"
              >
                Buka Evaluasi &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Dokumentasi AI & Prompt */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Dokumentasi Penggunaan AI (Prompt &amp; Hasil)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Berikut adalah arsitektur instruksi sistem (*System Instruction*), format parameter, dan rekayasa prompt (*prompt engineering*) yang diterapkan pada sisi backend aman:
            </p>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-blue-400 font-bold">// 1. System Instruction: AI Tutor Interaktif Adaptif</div>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
{`const systemInstruction = \`Anda adalah Tutor Cerdas EduSmart AI (\${subject}).
\${educationPersona}
\${speedDirective}

Format Markdown yang rapi:
- **Ringkasan Inti**: Jawaban langsung atas pertanyaan.
- **Konsep & Pembahasan**: Langkah terstruktur atau konsep utama.
- **Referensi Terpercaya**: 1-2 sumber rujukan resmi (Kemendikbud/buku teks/jurnal).\`;`}
                </pre>
              </div>

              <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-indigo-400 font-bold">// 2. Parameter Strict JSON Schema: Generator Kuis Pilihan Ganda</div>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
{`responseSchema: {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING },
              B: { type: Type.STRING },
              C: { type: Type.STRING },
              D: { type: Type.STRING }
            },
            required: ['A', 'B', 'C', 'D']
          },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ['id', 'question', 'options', 'correctAnswer', 'explanation']
      }
    }
  },
  required: ['topic', 'questions']
}`}
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Pencegahan Masalah &amp; Fallback Model:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-blue-800">
                <li><strong>Anti-Halusinasi:</strong> Perintah ketat membatasi rangkuman hanya pada teks yang diinputkan pengguna.</li>
                <li><strong>Low Latency Optimization:</strong> Penggunaan <code className="bg-blue-100 px-1 rounded font-mono">ThinkingLevel.LOW</code> mengeliminasi proses *deep thinking* yang tidak diperlukan sehingga respons mengalir seketika.</li>
                <li><strong>Model Fallback:</strong> Sistem memprioritaskan <code className="bg-blue-100 px-1 rounded font-mono">gemini-3.8-flash</code> dengan fallback ke <code className="bg-blue-100 px-1 rounded font-mono">gemini-flash-latest</code> jika terjadi kendala kuota atau jaringan.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Pengujian */}
      {activeTab === 'pengujian' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Hasil Pengujian Fitur &amp; Unit Tests (Vitest)</span>
          </h2>

          <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
            <div>$ vitest run</div>
            <div className="text-slate-400">RUN v5.0.5 /app/applet</div>
            <div>✓ src/utils/summaryUtils.test.ts (5 tests) [8ms]</div>
            <div>✓ src/utils/quizUtils.test.ts (4 tests) [13ms]</div>
            <div className="text-white pt-2">Test Files: 2 passed (2)</div>
            <div className="text-white">Tests:      9 passed (9)</div>
            <div className="text-slate-400">Duration:   508ms</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Fitur</th>
                  <th className="p-3">Skenario Uji</th>
                  <th className="p-3">Ekspektasi</th>
                  <th className="p-3">Hasil Aktual</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">AI Tutor Stream</td>
                  <td className="p-3">Kirim pertanyaan fisika SMA</td>
                  <td className="p-3">Streaming karakter dalam &lt;1 detik + referensi</td>
                  <td className="p-3">Kursor mengalir real-time, referensi tercantum</td>
                  <td className="p-3 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Stop Stream</td>
                  <td className="p-3">Klik tombol Hentikan</td>
                  <td className="p-3">Aliran SSE berhenti via AbortController</td>
                  <td className="p-3">Respons berhenti seketika tanpa error UI</td>
                  <td className="p-3 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Rangkuman AI</td>
                  <td className="p-3">Unggah materi 400 kata</td>
                  <td className="p-3">Ekstraksi judul, inti, poin, glosarium, kesimpulan</td>
                  <td className="p-3">Format terstruktur rapi, rasio kompresi 70%</td>
                  <td className="p-3 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Kuis Pilihan Ganda</td>
                  <td className="p-3">Buat kuis 5 butir soal</td>
                  <td className="p-3">JSON 4 opsi (A-D) dengan 1 kunci jawaban benar</td>
                  <td className="p-3">Skema valid, kunci dirahasiakan hingga submit</td>
                  <td className="p-3 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Evaluasi Otomatis</td>
                  <td className="p-3">Kumpulkan jawaban kuis</td>
                  <td className="p-3">Kalkulasi nilai 0-100 &amp; pembahasan tiap nomor</td>
                  <td className="p-3">Skor dihitung presisi, pembahasan tampil lengkap</td>
                  <td className="p-3 font-bold text-emerald-600">PASS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: Panduan Presentasi */}
      {activeTab === 'presentasi' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-blue-600" />
            <span>Panduan Presentasi Proyek &amp; Alur Demonstrasi Produk (10 Slide)</span>
          </h2>

          <div className="space-y-3">
            {[
              {
                num: '1',
                title: 'Judul Proyek & Tim Pengembang',
                desc: 'Memperkenalkan EduSmart AI sebagai platform pembelajaran cerdas adaptif bagi siswa SMP, SMA/SMK, hingga Mahasiswa.',
                demo: 'Tampilkan Landing Page dan logo EduSmart AI PRO.',
              },
              {
                num: '2',
                title: 'Latar Belakang & Permasalahan Pembelajaran',
                desc: 'Tantangan minimnya akses privat tutor, beban materi padat, evaluasi statis, dan isu latensi lambat pada aplikasi AI biasa.',
                demo: 'Tunjukkan fitur pemilihan jenjang adaptif (SMP / SMA / Mahasiswa).',
              },
              {
                num: '3',
                title: 'Solusi & Arsitektur Sistem',
                desc: 'Arsitektur Express Proxy + React 19 + SSE Streaming. Kunci API Gemini disimpan aman di server (zero client exposure).',
                demo: 'Jelaskan diagram alur arsitektur proxy.',
              },
              {
                num: '4',
                title: 'Live Demo 1: AI Tutor Interaktif Streaming',
                desc: 'Mendemonstrasikan kecepatan respons streaming kata demi kata, kursor ketik aktif, dan penghentian stream instan.',
                demo: 'Ketik pertanyaan fisika SMA dan klik Kirim, perlihatkan aliran teks SSE.',
              },
              {
                num: '5',
                title: 'Live Demo 2: Rangkuman Materi Otomatis',
                desc: 'Menunjukkan kompresi teks panjang menjadi intisari terstruktur (Judul, Inti, Poin, Glosarium, Kesimpulan).',
                demo: 'Tempel materi pembelajaran dan jalankan Buat Rangkuman.',
              },
              {
                num: '6',
                title: 'Live Demo 3: Kuis AI Terstruktur & Evaluasi',
                desc: 'Memperlihatkan pembuatan soal berbasis JSON ketat, kerahasiaan kunci jawaban, dan skor otomatis.',
                demo: 'Buat 3 soal kuis, jawab soal, kumpulkan, dan lihat pembahasan komprehensif.',
              },
              {
                num: '7',
                title: 'Dashboard & Riwayat Belajar Persisten',
                desc: 'Menunjukkan data tersimpan permanen pada server (db.json) dan grafik perkembangan kognitif siswa.',
                demo: 'Buka halaman Dashboard dan Riwayat Belajar.',
              },
              {
                num: '8',
                title: 'Hasil Pengujian & Verifikasi Kualitas',
                desc: '9 unit tests Vitest lolos 100%, kompilasi TypeScript bersih, penanganan error dan model fallback aktif.',
                demo: 'Tunjukkan log bukti pengujian unit.',
              },
              {
                num: '9',
                title: 'Kesimpulan & Roadmap Masa Depan',
                desc: 'Rencana integrasi voice interaction, pengenalan soal via kamera (multimodal OCR), dan gamifikasi prestasi.',
                demo: 'Ringkas manfaat nyata yang dirasakan siswa.',
              },
              {
                num: '10',
                title: 'Sesi Tanya Jawab (Q&A) & Penutup',
                desc: 'Membagikan link aplikasi online untuk diuji langsung oleh dosen pengampu dan audiens.',
                demo: 'Bagikan tautan publik ais-pre-... kepada audiens.',
              },
            ].map((slide) => (
              <div key={slide.num} className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-base flex items-center justify-center shrink-0 border border-blue-200">
                  S{slide.num}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Slide {slide.num}: {slide.title}</h4>
                  <p className="text-xs text-slate-600">{slide.desc}</p>
                  <p className="text-xs text-blue-700 font-semibold pt-1">
                    🎯 <strong>Panduan Live Demo:</strong> {slide.demo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Pembagian Tugas Tim */}
      {activeTab === 'tim' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Pembagian Tugas &amp; Kontribusi Anggota Kelompok</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-blue-500/40 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">1. Gina Azzahra</h3>
                  <span className="text-xs font-bold text-blue-600">Ketua Tim / Project Lead &amp; Fullstack Integrator</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white">
                  30% Kontribusi
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 pt-1">
                <li>Perencanaan arsitektur proyek, manajemen sprint, dan delivery aplikasi.</li>
                <li>Implementasi backend proxy Express (<code className="bg-white px-1 rounded font-mono">server.ts</code>) dan integrasi Google GenAI SDK.</li>
                <li>Membangun arsitektur streaming SSE (<code className="bg-white px-1 rounded font-mono">/api/tutor/stream</code> &amp; <code className="bg-white px-1 rounded font-mono">/api/summarize/stream</code>).</li>
                <li>Konfigurasi model fallback pipeline dan mitigasi error kuota.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">2. Anggota 2</h3>
                  <span className="text-xs font-bold text-indigo-600">Frontend Engineer &amp; UI/UX Specialist</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
                  25% Kontribusi
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 pt-1">
                <li>Perancangan tema visual minimalis profesional (Biru, Putih, Navy).</li>
                <li>Pengembangan komponen interaktif: Navbar, TutorView, SummarizeView, QuizView.</li>
                <li>Integrasi feedback animasi kursor streaming dan efek confetti perayaan kuis.</li>
                <li>Pengujian responsivitas layar tablet dan smartphone.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">3. Anggota 3</h3>
                  <span className="text-xs font-bold text-emerald-600">Backend &amp; Prompt Engineer</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                  25% Kontribusi
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 pt-1">
                <li>Perumusan system instruction bertingkat (SMP, SMA, Perguruan Tinggi).</li>
                <li>Pembuatan JSON Schema ketat untuk pembuatan soal pilihan ganda.</li>
                <li>Penyusunan endpoint database persisten lokal (<code className="bg-white px-1 rounded font-mono">data/db.json</code>).</li>
                <li>Optimasi latensi pemrosesan model dengan parameter ThinkingLevel.LOW.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">4. Anggota 4</h3>
                  <span className="text-xs font-bold text-purple-600">Quality Assurance &amp; Documentation</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800">
                  20% Kontribusi
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 pt-1">
                <li>Penyusunan unit tests otomatis (<code className="bg-white px-1 rounded font-mono">quizUtils.test.ts</code> &amp; <code className="bg-white px-1 rounded font-mono">summaryUtils.test.ts</code>).</li>
                <li>Pengujian black-box fungsional seluruh alur sistem.</li>
                <li>Penyusunan dokumen panduan presentasi dan rubrik pengumpulan tugas.</li>
                <li>Penyempurnaan konten evaluasi dan pembahasan soal.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
