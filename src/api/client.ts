import { EducationLevel, HistoryItem, QuizQuestion, QuizResult, SummaryResult, UserProfile } from '../types';

export interface ApiStatus {
  status: string;
  hasApiKey: boolean;
  app: string;
}

export async function checkApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status request failed');
    return await res.json();
  } catch (err) {
    console.warn('API status check error:', err);
    return { status: 'error', hasApiKey: false, app: 'EduSmart AI' };
  }
}

export async function askAiTutor(params: {
  question: string;
  educationLevel: EducationLevel;
  subject?: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
  speedMode?: 'turbo' | 'standard';
}): Promise<{ answer: string; educationLevel: EducationLevel; subject: string }> {
  const res = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal menghubungi Tutor AI');
  }

  return data;
}

export async function askAiTutorStream(
  params: {
    question: string;
    educationLevel: EducationLevel;
    subject?: string;
    history?: Array<{ role: 'user' | 'model'; text: string }>;
    speedMode?: 'turbo' | 'standard';
  },
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch('/api/tutor/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  if (!res.ok) {
    let errorMsg = 'Gagal menghubungi Tutor AI';
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  if (!res.body) {
    throw new Error('Streaming tidak didukung oleh browser');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const block of lines) {
      const line = block.trim();
      if (line.startsWith('data: ')) {
        const payload = line.slice(6);
        if (payload === '[DONE]') {
          break;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e: any) {
          if (e.message && e.message !== 'Unexpected end of JSON input') {
            throw e;
          }
        }
      }
    }
  }

  return fullText;
}

export async function summarizeMaterial(params: {
  text: string;
  educationLevel: EducationLevel;
  detailLevel?: 'singkat' | 'sedang' | 'mendalam';
}): Promise<SummaryResult> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal merangkum materi');
  }

  return data;
}

export async function summarizeMaterialStream(
  params: {
    text: string;
    educationLevel: EducationLevel;
    detailLevel?: 'singkat' | 'sedang' | 'mendalam';
  },
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch('/api/summarize/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  if (!res.ok) {
    let errorMsg = 'Gagal merangkum materi';
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  if (!res.body) {
    throw new Error('Streaming tidak didukung oleh browser');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const block of lines) {
      const line = block.trim();
      if (line.startsWith('data: ')) {
        const payload = line.slice(6);
        if (payload === '[DONE]') {
          break;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e: any) {
          if (e.message && e.message !== 'Unexpected end of JSON input') {
            throw e;
          }
        }
      }
    }
  }

  return fullText;
}

export async function generateAiQuiz(params: {
  topic: string;
  educationLevel: EducationLevel;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  questionCount: number;
}): Promise<{
  topic: string;
  educationLevel: EducationLevel;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  questionCount: number;
  questions: QuizQuestion[];
}> {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal menghasilkan kuis AI');
  }

  return data;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  try {
    const res = await fetch('/api/history');
    if (!res.ok) throw new Error('Gagal mengambil riwayat');
    return await res.json();
  } catch (err) {
    console.error('Fetch history error:', err);
    return [];
  }
}

export async function saveHistoryItem(item: Partial<HistoryItem>): Promise<HistoryItem> {
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Gagal menyimpan riwayat');
  return await res.json();
}

export async function deleteHistoryItem(id: string): Promise<boolean> {
  const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function clearAllHistory(): Promise<boolean> {
  const res = await fetch('/api/history', { method: 'DELETE' });
  return res.ok;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('Gagal memuat profil');
  return await res.json();
}

export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Gagal memperbarui profil');
  return await res.json();
}
