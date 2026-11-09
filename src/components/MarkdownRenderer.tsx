import React, { useState } from 'react';
import { Check, Copy, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split into lines/blocks
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeIndex = 0;
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ul') {
        renderedElements.push(
          <ul key={`list-${renderedElements.length}`} className="my-3 space-y-1.5 pl-5 list-disc text-slate-700">
            {listItems}
          </ul>
        );
      } else {
        renderedElements.push(
          <ol key={`list-${renderedElements.length}`} className="my-3 space-y-1.5 pl-5 list-decimal text-slate-700">
            {listItems}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const parseInline = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-xs border border-blue-100">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const codeText = codeBuffer.join('\n');
        const currentIndex = codeIndex++;
        renderedElements.push(
          <div key={`code-${currentIndex}`} className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 text-xs text-slate-400">
              <span className="font-mono">Snippet / Rumus</span>
              <button
                onClick={() => handleCopyCode(codeText, currentIndex)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
                title="Salin kode"
              >
                {copiedIndex === currentIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 font-mono text-sm overflow-x-auto text-blue-200">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Check Headers
    if (line.startsWith('### ')) {
      flushList();
      const title = line.replace('### ', '');
      const isSourceSection = title.toLowerCase().includes('referensi') || title.toLowerCase().includes('sumber');
      renderedElements.push(
        <h3
          key={`h3-${i}`}
          className={`text-base font-bold mt-4 mb-2 flex items-center gap-2 ${
            isSourceSection ? 'text-blue-700 bg-blue-50/70 p-2 rounded-lg border border-blue-200' : 'text-slate-900'
          }`}
        >
          {isSourceSection && <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />}
          {title}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      const title = line.replace('## ', '');
      const isSourceSection = title.toLowerCase().includes('referensi') || title.toLowerCase().includes('sumber');
      renderedElements.push(
        <h2
          key={`h2-${i}`}
          className={`text-lg font-bold mt-5 mb-2 pb-1 border-b flex items-center gap-2 ${
            isSourceSection ? 'text-blue-800 border-blue-200 bg-blue-50 p-2.5 rounded-lg' : 'text-slate-900 border-slate-200'
          }`}
        >
          {isSourceSection ? <BookOpen className="w-5 h-5 text-blue-600" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
          {title}
        </h2>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h1 key={`h1-${i}`} className="text-xl font-extrabold text-slate-900 mt-5 mb-3">
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      renderedElements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 pl-4 border-l-4 border-blue-500 bg-blue-50/40 py-2 pr-3 rounded-r-lg italic text-slate-700 text-sm"
        >
          {parseInline(line.replace('> ', ''))}
        </blockquote>
      );
      continue;
    }

    // Unordered List (- or *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      const itemContent = line.slice(2);
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {parseInline(itemContent)}
        </li>
      );
      continue;
    }

    // Ordered List (1. 2. etc.)
    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {parseInline(olMatch[2])}
        </li>
      );
      continue;
    }

    // Empty line
    if (line === '') {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    renderedElements.push(
      <p key={`p-${i}`} className="my-2 text-slate-700 leading-relaxed text-sm md:text-base">
        {parseInline(rawLine)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
};
