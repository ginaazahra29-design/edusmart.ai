import { describe, it, expect } from 'vitest';
import { validateSummaryInput, calculateCompressionRatio, parseMarkdownToSummary } from './summaryUtils';

describe('Summary Utilities', () => {
  it('validates empty input properly', () => {
    expect(validateSummaryInput('').isValid).toBe(false);
    expect(validateSummaryInput('   ').isValid).toBe(false);
  });

  it('validates short inputs under 25 chars', () => {
    expect(validateSummaryInput('Terlalu pendek').isValid).toBe(false);
  });

  it('accepts valid long educational texts', () => {
    const validText = 'Sistem pencernaan manusia terdiri dari mulut, kerongkongan, lambung, usus halus, usus besar, dan anus.';
    expect(validateSummaryInput(validText).isValid).toBe(true);
  });

  it('calculates word compression ratio accurately', () => {
    expect(calculateCompressionRatio(500, 100)).toBe(80);
    expect(calculateCompressionRatio(100, 50)).toBe(50);
    expect(calculateCompressionRatio(100, 100)).toBe(0);
    expect(calculateCompressionRatio(0, 10)).toBe(0);
  });

  it('parses streamed markdown into structured summary object', () => {
    const streamedMarkdown = `# Rangkuman Fotosintesis Tumbuhan

## Inti Pembahasan
Fotosintesis adalah proses pembentukan zat makanan glukosa dengan bantuan sinar matahari.

## Poin-Poin Penting
- Membutuhkan air dan CO2
- Terjadi di organel kloroplas
- Menghasilkan oksigen O2

## Glosarium Konsep Kunci
- **Kloroplas**: Organel tempat terjadinya fotosintesis
- **Klorofil**: Pigmen penyerap cahaya

## Kesimpulan Akhir
Fotosintesis adalah fondasi energi seluruh rantai makanan di bumi.`;

    const result = parseMarkdownToSummary(streamedMarkdown, 'Teks asli tentang fotosintesis', 'SMA/SMK');

    expect(result.title).toBe('Rangkuman Fotosintesis Tumbuhan');
    expect(result.overview).toContain('pembentukan zat makanan');
    expect(result.keyPoints.length).toBe(3);
    expect(result.keyConcepts.length).toBe(2);
    expect(result.keyConcepts[0].term).toBe('Kloroplas');
    expect(result.takeaway).toContain('fondasi energi');
    expect(result.educationLevel).toBe('SMA/SMK');
  });
});
