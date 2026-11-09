import { EducationLevel, SummaryResult } from '../types';

export function validateSummaryInput(text: string): { isValid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Teks materi tidak boleh kosong.' };
  }
  const trimmed = text.trim();
  if (trimmed.length < 25) {
    return { isValid: false, error: 'Materi terlalu pendek (minimal 25 karakter).' };
  }
  return { isValid: true };
}

export function calculateCompressionRatio(originalCount: number, summaryCount: number): number {
  if (!originalCount || originalCount <= 0) return 0;
  if (summaryCount >= originalCount) return 0;
  return Math.round(((originalCount - summaryCount) / originalCount) * 100);
}

export function parseMarkdownToSummary(
  markdown: string,
  originalText: string,
  educationLevel: EducationLevel
): SummaryResult {
  const lines = markdown.split('\n');
  let title = 'Rangkuman Materi EduSmart';
  let overview = '';
  const keyPoints: string[] = [];
  const keyConcepts: Array<{ term: string; definition: string }> = [];
  let takeaway = '';

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      title = trimmed.replace('# ', '').replace(/\*/g, '').trim();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const headerText = trimmed.replace('## ', '').toLowerCase();
      if (headerText.includes('inti') || headerText.includes('overview') || headerText.includes('pengantar')) {
        currentSection = 'overview';
      } else if (headerText.includes('poin') || headerText.includes('penting')) {
        currentSection = 'keyPoints';
      } else if (headerText.includes('konsep') || headerText.includes('glosarium') || headerText.includes('istilah')) {
        currentSection = 'keyConcepts';
      } else if (headerText.includes('kesimpulan') || headerText.includes('takeaway')) {
        currentSection = 'takeaway';
      } else {
        currentSection = '';
      }
      continue;
    }

    if (!trimmed) continue;

    if (currentSection === 'overview') {
      overview += (overview ? ' ' : '') + trimmed;
    } else if (currentSection === 'keyPoints') {
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const pointText = trimmed.replace(/^[-*]\s+|\d+\.\s+/, '').replace(/\*\*/g, '').trim();
        if (pointText) keyPoints.push(pointText);
      }
    } else if (currentSection === 'keyConcepts') {
      // Look for format: - **Term**: Definition or Term: Definition
      const conceptMatch = trimmed.match(/^[-*]?\s*\*\*?(.*?)\*\*?:\s*(.*)/);
      if (conceptMatch) {
        keyConcepts.push({
          term: conceptMatch[1].trim(),
          definition: conceptMatch[2].trim(),
        });
      }
    } else if (currentSection === 'takeaway') {
      takeaway += (takeaway ? ' ' : '') + trimmed;
    }
  }

  // Fallbacks if section was sparse
  if (!overview) overview = 'Rangkuman materi penting berdasarkan teks pembelajaran yang dimasukkan.';
  if (keyPoints.length === 0) keyPoints.push('Memuat poin-poin utama dari bahan ajar.');
  if (!takeaway) takeaway = 'Materi ini memberikan wawasan kunci untuk meningkatkan pemahaman akademik.';

  const originalWordCount = originalText.trim().split(/\s+/).filter(Boolean).length;
  const summaryWordCount = `${title} ${overview} ${keyPoints.join(' ')} ${takeaway}`
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    id: 'sum_' + Date.now(),
    title,
    overview,
    keyPoints,
    keyConcepts,
    takeaway,
    originalWordCount,
    summaryWordCount,
    educationLevel,
    createdAt: new Date().toISOString(),
  };
}
