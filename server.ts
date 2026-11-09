import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// CORS middleware so external browsers, shared preview links, and mobile devices can connect smoothly
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Local persistent database file storage
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface DatabaseSchema {
  history: Array<{
    id: string;
    type: 'quiz' | 'summary' | 'tutor';
    title: string;
    timestamp: string;
    educationLevel: string;
    score?: number;
    badge?: string;
    data: any;
  }>;
  profile: {
    name: string;
    educationLevel: string;
    institution: string;
    majorOrGrade: string;
    targetDailyQuestions: number;
    targetDailyMinutes: number;
    streakDays: number;
    avatarSeed: string;
  };
}

const defaultDb: DatabaseSchema = {
  history: [
    {
      id: 'demo-1',
      type: 'quiz',
      title: 'Kuis Fotosintesis & Reaksi Terang',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      educationLevel: 'SMA/SMK',
      score: 90,
      badge: 'Nilai A',
      data: {
        id: 'demo-1',
        topic: 'Fotosintesis & Reaksi Terang',
        educationLevel: 'SMA/SMK',
        difficulty: 'Sedang',
        totalQuestions: 5,
        correctAnswersCount: 4,
        score: 80,
        timeSpentSeconds: 145,
        userAnswers: { 1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'A' },
        questions: [
          {
            id: 1,
            question: 'Di organel sel tumbuhan manakah proses fotosintesis berlangsung?',
            options: {
              A: 'Kloroplas',
              B: 'Mitokondria',
              C: 'Ribosom',
              D: 'Badan Golgi',
            },
            correctAnswer: 'A',
            explanation:
              'Kloroplas mengandung pigmen klorofil yang menyerap foton cahaya matahari untuk menggerakkan fotolisis air dan sintesis ATP.',
          },
        ],
        completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    },
    {
      id: 'demo-2',
      type: 'summary',
      title: 'Rangkuman: Hukum Gerak Newton I, II, dan III',
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      educationLevel: 'SMP',
      badge: 'Ringkasan',
      data: {
        id: 'demo-2',
        title: 'Rangkuman: Hukum Gerak Newton I, II, dan III',
        overview:
          'Hukum Newton menjelaskan hubungan antara gaya yang bekerja pada suatu benda dan gerak yang disebabkannya.',
        keyPoints: [
          'Hukum I (Kelembaman): Benda diam tetap diam, benda bergerak lurus beraturan tetap bergerak jika resultan gaya = 0.',
          'Hukum II (F = m × a): Percepatan benda berbanding lurus dengan resultan gaya dan berbanding terbalik dengan massa.',
          'Hukum III (Aksi-Reaksi): Setiap gaya aksi memicu gaya reaksi yang sama besar tetapi berlawanan arah.',
        ],
        keyConcepts: [
          { term: 'Inersia', definition: 'Kecenderungan benda mempertahankan keadaan geraknya.' },
          { term: 'Gaya (Force)', definition: 'Tarikan atau dorongan yang diukur dalam satuan Newton (N).' },
        ],
        takeaway:
          'Ketiga hukum ini adalah fondasi mekanika klasik yang mendasari perhitungan gerak benda sehari-hari.',
        originalWordCount: 420,
        summaryWordCount: 120,
        educationLevel: 'SMP',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    },
  ],
  profile: {
    name: 'Pelajar Cerdas EduSmart',
    educationLevel: 'SMA/SMK',
    institution: 'SMA Negeri 1 Prestasi',
    majorOrGrade: 'Kelas 11 IPA / MIPA',
    targetDailyQuestions: 10,
    targetDailyMinutes: 45,
    streakDays: 4,
    avatarSeed: 'Felix',
  },
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Gemini AI Client factory
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Model priority list: gemini-3.8-flash is the official standard text model with gemini-flash-latest as fallback
const MODEL_PRIORITY = ['gemini-3.8-flash', 'gemini-flash-latest'];

async function generateContentFast(ai: GoogleGenAI, params: any) {
  let lastError: any = null;
  for (const model of MODEL_PRIORITY) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 404 || err?.status === 503 || err?.status === 500) {
        // Fallback to next supported model
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function generateContentStreamFast(ai: GoogleGenAI, params: any) {
  let lastError: any = null;
  for (const model of MODEL_PRIORITY) {
    try {
      return await ai.models.generateContentStream({
        ...params,
        model,
      });
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 404 || err?.status === 503 || err?.status === 500) {
        // Fallback to next supported model
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// ----------------- API ENDPOINTS -----------------

// Status check endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey,
    app: 'EduSmart AI',
    timestamp: new Date().toISOString(),
  });
});

// Download Project ZIP endpoint
app.get('/api/download-project', (_req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'edusmart-ai-project.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="edusmart-ai-project.zip"');
    return res.sendFile(zipPath);
  }
  return res.status(404).json({ error: 'Berkas ZIP proyek tidak ditemukan.' });
});

// Profile endpoints
app.get('/api/profile', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const db = readDb();
  db.profile = { ...db.profile, ...req.body };
  writeDb(db);
  res.json(db.profile);
});

// Learning History endpoints
app.get('/api/history', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.history || []);
});

app.post('/api/history', (req: Request, res: Response) => {
  const db = readDb();
  const newItem = {
    id: req.body.id || 'hist_' + Date.now(),
    type: req.body.type,
    title: req.body.title,
    timestamp: req.body.timestamp || new Date().toISOString(),
    educationLevel: req.body.educationLevel || db.profile.educationLevel,
    score: req.body.score,
    badge: req.body.badge,
    data: req.body.data,
  };
  db.history.unshift(newItem);
  // Keep last 100 entries
  if (db.history.length > 100) {
    db.history = db.history.slice(0, 100);
  }
  writeDb(db);
  res.status(201).json(newItem);
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.history = db.history.filter((item) => item.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/history', (_req: Request, res: Response) => {
  const db = readDb();
  db.history = [];
  writeDb(db);
  res.json({ success: true, message: 'Riwayat berhasil dibersihkan' });
});

// ----------------- AI TUTOR STREAMING ENDPOINT (SUPER CEPAT / LOW LATENCY) -----------------
app.post('/api/tutor/stream', async (req: Request, res: Response) => {
  try {
    const { question, educationLevel = 'SMA/SMK', subject = 'Umum', history = [], speedMode = 'turbo' } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return res.status(503).json({
        error: 'Kunci API Gemini belum terkonfigurasi. Harap atur GEMINI_API_KEY di panel Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    const educationPersona =
      educationLevel === 'SMP'
        ? 'Target: Siswa SMP. Gunakan bahasa ramah, analogi mudah dipahami, hindari rumus rumit tanpa penjelasan.'
        : educationLevel === 'Mahasiswa'
        ? 'Target: Mahasiswa. Gunakan bahasa akademis, kritis, analitis, sajikan metodologi & landasan teoretis.'
        : 'Target: Siswa SMA/SMK. Gunakan penjelasan logis, rumus lengkap dengan langkah pengerjaan jelas.';

    const speedDirective =
      speedMode === 'turbo'
        ? 'Jawab secara responsif dan to-the-point tanpa basa-basi pembuka yang panjang. Langsung ke inti jawaban, poin kunci, dan referensi ringkas.'
        : 'Jawab secara sistematis dan komprehensif.';

    const systemInstruction = `Anda adalah Tutor Cerdas EduSmart AI (${subject}).
${educationPersona}
${speedDirective}

Format Markdown yang rapi:
- **Ringkasan Inti**: Jawaban langsung.
- **Konsep & Pembahasan**: Langkah terstruktur atau poin penting.
- **Referensi Terpercaya**: 1-2 sumber rujukan resmi (Kemendikbud/buku teks/jurnal).`;

    const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-4)) {
        if (item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({ role: item.role, parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [
        { text: `[Jenjang: ${educationLevel}] [Mapel: ${subject}]\nPertanyaan: ${question.trim()}` },
      ],
    });

    const responseStream = await generateContentStreamFast(ai, {
      contents,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction,
      },
    });

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Tutor Streaming Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Gagal memproses streaming AI' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error?.message || 'Terjadi gangguan stream' })}\n\n`);
      res.end();
    }
  }
});

// Standard non-streaming endpoint with ThinkingLevel.LOW optimization
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const { question, educationLevel = 'SMA/SMK', subject = 'Umum', history = [], speedMode = 'turbo' } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Pertanyaan tidak boleh kosong. Silakan tuliskan materi atau soal yang ingin dipelajari.',
      });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return res.status(503).json({
        error:
          'Kunci API Gemini belum terkonfigurasi pada server. Harap pastikan GEMINI_API_KEY telah diatur di Settings > Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    const educationPersona =
      educationLevel === 'SMP'
        ? 'Target audiens: Siswa SMP. Gunakan bahasa ramah, santun, lugas, analogi sederhana, hindari istilah rumit tanpa penjelasan.'
        : educationLevel === 'Mahasiswa'
        ? 'Target audiens: Mahasiswa Perguruan Tinggi. Gunakan bahasa akademis, kritis, analitis, sajikan metodologi & landasan teoretis.'
        : 'Target audiens: Siswa SMA/SMK. Berikan penjelasan logis sistematis, rumus lengkap dengan langkah pengerjaan teratur.';

    const systemInstruction = `Anda adalah Tutor Cerdas AI EduSmart AI (${subject}).
${educationPersona}
Jawab secara cepat, padat, dan to-the-point tanpa basa-basi pembuka.

Format jawaban dengan Markdown yang jelas:
- **Ringkasan Inti**: Jawaban langsung atas pertanyaan.
- **Penjelasan & Langkah**: Penjelasan sistematis langkah demi langkah atau konsep utama.
- **Referensi Terpercaya**: Sebutkan 1-2 sumber literatur resmi/buku ajar untuk validasi.`;

    const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-4)) {
        if (item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({ role: item.role, parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [
        { text: `[Tingkat Pendidikan: ${educationLevel}] [Mata Pelajaran: ${subject}]\nPertanyaan: ${question.trim()}` },
      ],
    });

    const response = await generateContentFast(ai, {
      contents,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction,
      },
    });

    const answer = response.text;
    if (!answer) {
      return res.status(502).json({
        error: 'Model AI menghasilkan respon kosong. Silakan ulangi pertanyaan Anda dengan kalimat yang lebih spesifik.',
      });
    }

    return res.json({
      answer,
      educationLevel,
      subject,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Tutor AI Error:', error);
    const message = error?.message || 'Terjadi kesalahan sistem saat memproses pertanyaan Anda.';
    return res.status(500).json({
      error: `Gagal memproses pertanyaan AI: ${message}`,
      details: error?.status || error?.name,
    });
  }
});

// ----------------- AI RANGKUMAN MATERI STREAMING ENDPOINT -----------------
app.post('/api/summarize/stream', async (req: Request, res: Response) => {
  try {
    const { text, educationLevel = 'SMA/SMK', detailLevel = 'sedang' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 25) {
      return res.status(400).json({
        error: 'Materi pembelajaran terlalu pendek. Harap masukkan teks materi minimal 25 karakter.',
      });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return res.status(503).json({
        error: 'Kunci API Gemini belum terkonfigurasi. Harap atur GEMINI_API_KEY di panel Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    const detailGuide =
      detailLevel === 'singkat'
        ? 'Buat rangkuman padat, to-the-point, 3-5 poin inti terpenting saja.'
        : detailLevel === 'mendalam'
        ? 'Buat rangkuman komprehensif, mencakup latar belakang, mekanisme kerja, rumus/konsep, 6-10 poin penting, dan glosarium istilah.'
        : 'Buat rangkuman berimbang (4-6 poin penting) dengan fokus pada pemahaman konsep utama.';

    const systemInstruction = `Anda adalah Spesialis Rangkuman Materi Edukatif AI EduSmart AI.
Tugas Anda: Membaca teks materi pembelajaran dan menyusun rangkuman faktual yang sangat terstruktur untuk tingkat pendidikan: ${educationLevel}.
${detailGuide}

ATURAN STRUKTUR OUTPUT:
Tuliskan langsung dengan format Markdown berikut tanpa pengantar pembuka:
# [Judul Rangkuman yang Menarik & Representatif]

## Inti Pembahasan
[Paragraf gambaran umum inti materi]

## Poin-Poin Penting
- [Poin penting 1]
- [Poin penting 2]
- [Poin penting 3]

## Glosarium Konsep Kunci
- **[Istilah/Konsep 1]**: [Definisi berdasarkan teks materi]
- **[Istilah/Konsep 2]**: [Definisi berdasarkan teks materi]

## Kesimpulan Akhir
[Kesimpulan akhir atau pesan kunci]

PENTING: HANYA gunakan informasi yang ada di dalam teks materi yang diberikan. Jangan mengarang informasi palsu di luar teks sumber.`;

    const responseStream = await generateContentStreamFast(ai, {
      contents: `Berikut teks materi yang harus dirangkum:\n\n${text.trim()}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction,
      },
    });

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    for await (const chunk of responseStream) {
      const textChunk = chunk.text;
      if (textChunk) {
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Summarize Streaming Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Gagal memproses streaming rangkuman' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error?.message || 'Gangguan streaming rangkuman' })}\n\n`);
      res.end();
    }
  }
});

// ----------------- AI RANGKUMAN MATERI ENDPOINT (STANDARD) -----------------
app.post('/api/summarize', async (req: Request, res: Response) => {
  try {
    const { text, educationLevel = 'SMA/SMK', detailLevel = 'sedang' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 25) {
      return res.status(400).json({
        error: 'Materi pembelajaran terlalu pendek. Harap masukkan teks materi minimal 25 karakter.',
      });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return res.status(503).json({
        error: 'Kunci API Gemini belum terkonfigurasi. Harap atur GEMINI_API_KEY di panel Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    const detailGuide =
      detailLevel === 'singkat'
        ? 'Buat rangkuman padat, to-the-point, 3-5 poin inti terpenting saja.'
        : detailLevel === 'mendalam'
        ? 'Buat rangkuman komprehensif, mencakup latar belakang, mekanisme kerja, rumus/konsep, 6-10 poin penting, dan glosarium istilah.'
        : 'Buat rangkuman berimbang (4-6 poin penting) dengan fokus pada pemahaman konsep utama.';

    const systemInstruction = `Anda adalah Spesialis Rangkuman Materi Edukatif AI EduSmart AI.
Tugas Anda: Membaca teks materi pembelajaran yang dimasukkan pengguna dan membuat rangkuman yang sangat jelas, terstruktur, dan mudah dipelajari untuk tingkat pendidikan: ${educationLevel}.
Pedoman Detail: ${detailGuide}.

ATURAN KETAT:
1. HANYA gunakan informasi yang TERKANDUNG dalam teks materi yang diberikan. JANGAN MENGARANG fakta, data statistik, atau klaim baru yang tidak ada dalam teks sumber.
2. Susun hasil dalam format JSON terstruktur persis sesuai skema yang diminta.
3. Buat judul yang menarik dan mencerminkan esensi materi.
4. Buat overview (inti pembahasan) yang merangkum pesan kunci teks.
5. Ekstrak poin-poin penting dalam kalimat terstruktur.
6. Ekstrak konsep/istilah kunci (term) beserta definisinya berdasarkan teks materi.
7. Buat kesimpulan akhir (takeaway) yang membekas untuk siswa.`;

    const response = await generateContentFast(ai, {
      contents: `Berikut teks materi pembelajaran yang harus dirangkum:\n\n${text.trim()}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Judul rangkuman yang representatif dan menarik',
            },
            overview: {
              type: Type.STRING,
              description: 'Inti pembahasan paragraf pengantar rangkuman materi',
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar poin-poin penting utama dari teks materi',
            },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING, description: 'Istilah atau konsep penting' },
                  definition: { type: Type.STRING, description: 'Definisi konsep berdasarkan teks materi' },
                },
                required: ['term', 'definition'],
              },
              description: 'Daftar istilah atau konsep kunci',
            },
            takeaway: {
              type: Type.STRING,
              description: 'Kesimpulan akhir yang memuat esensi penting yang harus diingat siswa',
            },
          },
          required: ['title', 'overview', 'keyPoints', 'keyConcepts', 'takeaway'],
        },
      },
    });

    const rawJson = (response.text || '').trim();
    if (!rawJson) {
      return res.status(502).json({ error: 'AI tidak menghasilkan keluaran rangkuman.' });
    }

    const parsed = JSON.parse(rawJson);
    const originalWordCount = text.trim().split(/\s+/).length;
    const summaryText = `${parsed.title} ${parsed.overview} ${parsed.keyPoints.join(' ')} ${parsed.takeaway}`;
    const summaryWordCount = summaryText.split(/\s+/).length;

    const summaryResult = {
      id: 'sum_' + Date.now(),
      title: parsed.title,
      overview: parsed.overview,
      keyPoints: parsed.keyPoints || [],
      keyConcepts: parsed.keyConcepts || [],
      takeaway: parsed.takeaway,
      originalWordCount,
      summaryWordCount,
      educationLevel,
      createdAt: new Date().toISOString(),
    };

    return res.json(summaryResult);
  } catch (error: any) {
    console.error('Summarize AI Error:', error);
    return res.status(500).json({
      error: `Gagal merangkum materi: ${error?.message || 'Terjadi kesalahan format AI.'}`,
    });
  }
});

// ----------------- AI KUIS GENERATOR ENDPOINT -----------------
app.post('/api/quiz', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      educationLevel = 'SMA/SMK',
      difficulty = 'Sedang',
      questionCount = 5,
    } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return res.status(400).json({
        error: 'Topik atau materi kuis tidak boleh kosong. Masukkan minimal 3 karakter.',
      });
    }

    const count = Math.min(Math.max(parseInt(String(questionCount), 10) || 5, 3), 10);

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return res.status(503).json({
        error: 'Kunci API Gemini belum terkonfigurasi. Harap atur GEMINI_API_KEY di panel Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    const systemInstruction = `Anda adalah Pembuat Soal Kuis Ujian Profesional EduSmart AI.
Tugas Anda: Menghasilkan persis ${count} soal pilihan ganda berkualitas tinggi tentang topik "${topic.trim()}" untuk tingkat pendidikan: ${educationLevel} dengan tingkat kesulitan: ${difficulty}.

ATURAN PEMBUATAN SOAL:
1. Buat tepat 4 pilihan jawaban untuk setiap soal (A, B, C, D).
2. Tentukan satu kunci jawaban yang mutlak benar (correctAnswer berupa huruf tunggal "A", "B", "C", atau "D").
3. Berikan pembahasan (explanation) mendalam dan edukatif yang menguraikan mengapa jawaban tersebut benar serta mengapa pilihan pengecoh lainnya keliru.
4. Bahasa Indonesia baku yang jelas, tidak ambigu, dan sesuai kurikulum pendidikan Indonesia.
5. Pastikan distribusi jawaban (A/B/C/D) bervariasi dan tidak selalu menunjuk ke opsi yang sama.
6. Format output HARUS JSON terstruktur yang valid sesuai skema yang telah ditentukan.`;

    const response = await generateContentFast(ai, {
      contents: `Buatlah paket kuis interaktif berjumlah ${count} soal pilihan ganda tentang "${topic.trim()}".`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER, description: 'Nomor urut soal 1 s.d. N' },
                  question: { type: Type.STRING, description: 'Teks pertanyaan soal pilihan ganda' },
                  options: {
                    type: Type.OBJECT,
                    properties: {
                      A: { type: Type.STRING, description: 'Pilihan jawaban A' },
                      B: { type: Type.STRING, description: 'Pilihan jawaban B' },
                      C: { type: Type.STRING, description: 'Pilihan jawaban C' },
                      D: { type: Type.STRING, description: 'Pilihan jawaban D' },
                    },
                    required: ['A', 'B', 'C', 'D'],
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: 'Kunci jawaban yang benar: A, B, C, atau D',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Pembahasan lengkap dan logis mengenai jawaban yang benar',
                  },
                },
                required: ['id', 'question', 'options', 'correctAnswer', 'explanation'],
              },
            },
          },
          required: ['topic', 'questions'],
        },
      },
    });

    const raw = (response.text || '').trim();
    if (!raw) {
      return res.status(502).json({ error: 'AI tidak menghasilkan soal kuis.' });
    }

    const parsed = JSON.parse(raw);
    const questions = parsed.questions || [];

    // Sanitize and validate questions
    const sanitizedQuestions = questions.map((q: any, idx: number) => {
      const validAnswers = ['A', 'B', 'C', 'D'];
      const rawAns = String(q.correctAnswer || 'A').toUpperCase().trim().charAt(0);
      const correctAnswer = validAnswers.includes(rawAns) ? rawAns : 'A';

      return {
        id: idx + 1,
        question: String(q.question || `Soal ${idx + 1}`),
        options: {
          A: String(q.options?.A || 'Opsi A'),
          B: String(q.options?.B || 'Opsi B'),
          C: String(q.options?.C || 'Opsi C'),
          D: String(q.options?.D || 'Opsi D'),
        },
        correctAnswer,
        explanation: String(q.explanation || 'Pembahasan kunci jawaban untuk materi ini.'),
      };
    });

    return res.json({
      topic: parsed.topic || topic,
      educationLevel,
      difficulty,
      questionCount: sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    console.error('Quiz AI Error:', error);
    return res.status(500).json({
      error: `Gagal membuat kuis: ${error?.message || 'Format kuis dari AI tidak valid.'}`,
    });
  }
});

// Vite middleware or production static files
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' && distExists) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan internal server.', message: err?.message });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSmart AI Server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
