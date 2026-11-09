import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  BookmarkCheck,
  BookOpen,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Download,
  Share2,
  Zap,
  Square,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askAiTutor, askAiTutorStream } from '../api/client';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ChatMessage, EducationLevel, SubjectCategory } from '../types';

export const TutorView: React.FC = () => {
  const {
    profile,
    updateUserProfile,
    addHistory,
    setCurrentView,
    targetTutorQuery,
    setTargetTutorQuery,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('Semua');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(profile.educationLevel);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [speedMode, setSpeedMode] = useState<'turbo' | 'standard'>('turbo');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const subjects: SubjectCategory[] = [
    'Semua',
    'Matematika',
    'IPA & Sains',
    'Fisika',
    'Kimia',
    'Biologi',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Teknologi & IT',
    'Sejarah & Sosial',
    'Ekonomi & Akuntansi',
  ];

  // Starter prompts by education level
  const starterPrompts: Record<EducationLevel, Array<{ text: string; subject: SubjectCategory }>> = {
    SMP: [
      { text: 'Bagaimana cara mudah menghitung keliling dan luas lingkaran jika diketahui jari-jarinya?', subject: 'Matematika' },
      { text: 'Mengapa langit pada siang hari berwarna biru sedangkan saat senja berwarna jingga kemerahan?', subject: 'IPA & Sains' },
      { text: 'Apa perbedaan antara sel tumbuhan dan sel hewan beserta fungsinya?', subject: 'IPA & Sains' },
      { text: 'Jelaskan perbedaan kalimat aktif transitif dan intransitif beserta contoh kalimatnya.', subject: 'Bahasa Indonesia' },
    ],
    'SMA/SMK': [
      { text: 'Bantu saya menyelesaikan turunan f(x) = (3x^2 + 2x)(4x - 1) menggunakan aturan perkalian.', subject: 'Matematika' },
      { text: 'Jelaskan prinsip kerja Siklus Carnot dan rumus efisiensi mesin kalor termodinamika.', subject: 'Fisika' },
      { text: 'Bagaimana mekanisme transkripsi dan translasi DNA dalam pembentukan protein?', subject: 'Biologi' },
      { text: 'Apa perbedaan mendasar antara pasar persaingan sempurna dan pasar monopoli?', subject: 'Ekonomi & Akuntansi' },
    ],
    Mahasiswa: [
      { text: 'Bandingkan efisiensi algoritma Dijkstra vs algoritma A* dalam pencarian lintasan terpendek.', subject: 'Teknologi & IT' },
      { text: 'Jelaskan konsep heteroskedastisitas pada model regresi linear dan bagaimana cara mengatasinya.', subject: 'Ekonomi & Akuntansi' },
      { text: 'Bagaimana persamaan Schrödinger bebas waktu memodelkan partikel dalam kotak potensial 1D?', subject: 'Fisika' },
      { text: 'Uraikan perbedaan paradigma penelitian kuantitatif positivistik dan kualitatif fenomenologis.', subject: 'Sejarah & Sosial' },
    ],
  };

  const currentPrompts = starterPrompts[selectedLevel] || starterPrompts['SMA/SMK'];

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle external query passed from other views
  useEffect(() => {
    if (targetTutorQuery) {
      setInputText(targetTutorQuery.question);
      if (targetTutorQuery.subject) {
        setSelectedSubject(targetTutorQuery.subject as SubjectCategory);
      }
      setTargetTutorQuery(null);
    }
  }, [targetTutorQuery, setTargetTutorQuery]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend) {
      setErrorMessage('Pertanyaan tidak boleh kosong. Silakan ketik soal atau materi Anda.');
      return;
    }

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
      educationLevel: selectedLevel,
      subject: selectedSubject !== 'Semua' ? selectedSubject : undefined,
    };

    const aiMsgId = 'msg_ai_' + Date.now();
    const aiMsgPlaceholder: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toISOString(),
      educationLevel: selectedLevel,
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMsg, aiMsgPlaceholder]);
    setInputText('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history format
      const historyContext = messages.slice(-4).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      let accumulated = '';
      try {
        accumulated = await askAiTutorStream(
          {
            question: textToSend,
            educationLevel: selectedLevel,
            subject: selectedSubject !== 'Semua' ? selectedSubject : 'Materi Umum Pelajar',
            history: historyContext,
            speedMode,
          },
          (chunk) => {
            accumulated += chunk;
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, text: accumulated } : m))
            );
          },
          controller.signal
        );
      } catch (streamErr: any) {
        if (controller.signal.aborted) {
          return;
        }
        console.warn('Streaming error, falling back to standard response:', streamErr);
        const res = await askAiTutor({
          question: textToSend,
          educationLevel: selectedLevel,
          subject: selectedSubject !== 'Semua' ? selectedSubject : 'Materi Umum Pelajar',
          history: historyContext,
          speedMode,
        });
        accumulated = res.answer;
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: res.answer } : m))
        );
      }

      // Save automatically to history
      if (accumulated.trim()) {
        await addHistory({
          type: 'tutor',
          title: textToSend.slice(0, 60) + (textToSend.length > 60 ? '...' : ''),
          educationLevel: selectedLevel,
          data: {
            question: textToSend,
            answer: accumulated,
            subject: selectedSubject,
          },
        });
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        console.error(err);
        setErrorMessage(
          err.message || 'Terjadi kesalahan saat memproses jawaban AI. Pastikan server terhubung dengan benar.'
        );
        // Remove placeholder on fatal failure
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId || m.text.length > 0));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualSave = async (msg: ChatMessage) => {
    await addHistory({
      type: 'tutor',
      title: msg.text.slice(0, 50) + '...',
      educationLevel: selectedLevel,
      data: {
        question: 'Tanya Tutor AI',
        answer: msg.text,
        subject: selectedSubject,
      },
    });
    setSavedId(msg.id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const handleClearChat = () => {
    if (window.confirm('Bersihkan percakapan tutor ini?')) {
      setMessages([]);
      setErrorMessage(null);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const content = messages
      .map(
        (m) =>
          `[${m.sender === 'user' ? 'Siswa' : 'EduSmart AI Tutor'} - ${new Date(m.timestamp).toLocaleTimeString()}]\n${m.text}\n\n`
      )
      .join('---\n\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduSmart-Tutor-${selectedLevel}-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">AI Tutor Interaktif</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                Faktual &amp; Referensi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tanyakan materi apa saja. Jawaban disesuaikan dengan kurikulum dan tingkat pemahaman Anda.
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedSubject === sub
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col min-h-[500px] max-h-[680px]">
        {/* Chat Header Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">EduSmart Tutor AI ({selectedLevel})</span>
            {selectedSubject !== 'Semua' && (
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                {selectedSubject}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setSpeedMode('turbo')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  speedMode === 'turbo'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kecepatan respons instan & to-the-point"
              >
                <Zap className="w-3 h-3 text-yellow-200" />
                <span>Turbo (Cepat)</span>
              </button>
              <button
                onClick={() => setSpeedMode('standard')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  speedMode === 'standard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Penjelasan komprehensif mendalam"
              >
                <span>Detail</span>
              </button>
            </div>

            {messages.length > 0 && (
              <>
                <button
                  onClick={handleExportChat}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                  title="Unduh percakapan (.md)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ekspor</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                  title="Bersihkan layar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bersihkan</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.length === 0 ? (
            <div className="py-8 max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-900">
                  Mulai Konsultasi Belajar ({selectedLevel})
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ketikkan pertanyaan akademik Anda di bawah, atau pilih salah satu contoh pertanyaan kurikulum berikut:
                </p>
              </div>

              {/* Starter prompts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {currentPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-xs text-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <span className="text-[10px] font-bold text-blue-600 mb-1">{p.subject}</span>
                    <p className="font-medium group-hover:text-blue-900">{p.text}</p>
                    <span className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-blue-600">
                      <span>Tanyakan ini</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      isAi
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isAi ? <Sparkles className="w-4 h-4" /> : profile.name.charAt(0)}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                      isAi
                        ? 'bg-white border border-slate-200/80 text-slate-900'
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}
                  >
                    {/* Message Header */}
                    <div
                      className={`flex items-center justify-between gap-3 text-[11px] mb-2 pb-1 border-b ${
                        isAi ? 'border-slate-100 text-slate-400' : 'border-blue-500/40 text-blue-100'
                      }`}
                    >
                      <span className="font-semibold">
                        {isAi ? 'EduSmart AI Tutor' : profile.name}
                      </span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Message Body */}
                    {isAi ? (
                      msg.text ? (
                        <div className="prose-edusmart">
                          <MarkdownRenderer content={msg.text} />
                          {isLoading && idx === messages.length - 1 && (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 font-mono font-bold animate-pulse">
                              <span>▋</span>
                              <span className="text-[10px] tracking-wide bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                Streaming live...
                              </span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold py-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                          <span>EduSmart AI sedang mengetik jawaban...</span>
                        </div>
                      )
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* AI Message Action Footer */}
                    {isAi && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-50"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 font-semibold">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Jawaban</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleManualSave(msg)}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-50"
                          >
                            {savedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 font-semibold">Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5" />
                                <span>Simpan Riwayat</span>
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setCurrentView('quiz');
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <span>Uji dengan Kuis AI</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-5 mb-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Input Form Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-2">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading) {
                      handleSendMessage();
                    }
                  }
                }}
                placeholder={`Tanyakan materi ${selectedSubject !== 'Semua' ? selectedSubject : 'apapun'} untuk jenjang ${selectedLevel}... (Tekan Enter untuk kirim)`}
                rows={2}
                disabled={isLoading}
                className="w-full text-xs sm:text-sm bg-transparent border-0 resize-none focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  <span>Target: {selectedLevel}</span>
                </span>
                <span>Shift + Enter untuk baris baru</span>
              </div>
            </div>

            {isLoading ? (
              <button
                type="button"
                onClick={handleStopStreaming}
                className="h-14 px-4 sm:px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                title="Hentikan respons AI sekarang"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Hentikan</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-14 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
