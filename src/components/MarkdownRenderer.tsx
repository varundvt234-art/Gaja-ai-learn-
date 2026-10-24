import React from 'react';
import { Lightbulb, AlertTriangle, Sparkles, HelpCircle, Compass, CheckCircle2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  onFollowUpClick?: (question: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onFollowUpClick }) => {
  if (!content) return null;

  // Split into lines/blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inNextQuestions = false;
  const followUpQuestions: string[] = [];

  const flushList = (key: number) => {
    if (!currentList) return null;
    const isUl = currentList.type === 'ul';
    const listElement = isUl ? (
      <ul key={`list-${key}`} className="my-2.5 space-y-1.5 pl-5 list-disc marker:text-emerald-500 text-slate-700 leading-relaxed text-[15px]">
        {currentList.items.map((item, idx) => (
          <li key={idx}>{renderInline(item)}</li>
        ))}
      </ul>
    ) : (
      <ol key={`list-${key}`} className="my-2.5 space-y-1.5 pl-5 list-decimal marker:font-semibold marker:text-indigo-600 text-slate-700 leading-relaxed text-[15px]">
        {currentList.items.map((item, idx) => (
          <li key={idx}>{renderInline(item)}</li>
        ))}
      </ol>
    );
    currentList = null;
    return listElement;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Regex for bold **text**, code `text`, and italic *text*
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Replace bold **...**
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    const matches = Array.from(remaining.matchAll(tokenRegex));

    if (matches.length === 0) {
      return remaining;
    }

    let lastIndex = 0;
    matches.forEach((match) => {
      const matchIndex = match.index || 0;
      if (matchIndex > lastIndex) {
        parts.push(remaining.substring(lastIndex, matchIndex));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-slate-900 bg-amber-50/60 px-1 py-0.5 rounded text-[15px]">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        parts.push(
          <code key={keyIdx++} className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded border border-slate-200">
            {matchText.slice(1, -1)}
          </code>
        );
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-800">
            {matchText.slice(1, -1)}
          </em>
        );
      }

      lastIndex = matchIndex + matchText.length;
    });

    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    return parts;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check if line indicates Next Questions section
    if (trimmed.toLowerCase().includes('next questions') || trimmed.toLowerCase().includes('curious next questions')) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      inNextQuestions = true;
      return;
    }

    if (inNextQuestions) {
      // Collect follow-up questions
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        const questionText = trimmed.replace(/^[-*•]|\d+\./, '').replace(/^[ "']|[ "']$/g, '').trim();
        if (questionText && questionText.length > 5) {
          followUpQuestions.push(questionText);
        }
        return;
      }
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      const text = trimmed.slice(4);
      elements.push(
        <h4 key={index} className="text-base font-bold text-slate-800 mt-4 mb-1.5 flex items-center gap-2">
          {text}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      const text = trimmed.slice(3);

      // Stylize based on section topic
      let icon = <Sparkles className="w-4 h-4 text-indigo-600 inline" />;
      let headerBg = 'text-slate-900 border-b border-slate-100 pb-1';

      if (text.includes('🌟') || text.toLowerCase().includes('summary') || text.toLowerCase().includes('definition')) {
        icon = <Sparkles className="w-4 h-4 text-amber-500 inline" />;
      } else if (text.includes('🔬') || text.toLowerCase().includes('works') || text.toLowerCase().includes('mechanism')) {
        icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />;
      } else if (text.includes('💡') || text.toLowerCase().includes('everyday') || text.toLowerCase().includes('applications')) {
        icon = <Lightbulb className="w-4 h-4 text-amber-600 inline" />;
      } else if (text.includes('⚠️') || text.toLowerCase().includes('safety') || text.toLowerCase().includes('uncertainty')) {
        icon = <AlertTriangle className="w-4 h-4 text-rose-500 inline" />;
        headerBg = 'text-rose-900 bg-rose-50/70 px-3 py-1.5 rounded-lg border border-rose-200 mt-3';
      } else if (text.includes('❓') || text.toLowerCase().includes('misconceptions')) {
        icon = <HelpCircle className="w-4 h-4 text-sky-600 inline" />;
      }

      elements.push(
        <h3 key={index} className={`text-base font-bold mt-5 mb-2 flex items-center gap-2 ${headerBg}`}>
          {icon}
          <span>{text.replace(/^[🌟🔬💡⚠️❓\s]+/, '')}</span>
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      elements.push(
        <h2 key={index} className="text-lg font-extrabold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200">
          {trimmed.slice(2)}
        </h2>
      );
      return;
    }

    // Callout alert box for Safety or Caution
    if (trimmed.startsWith('> ⚠️') || (trimmed.startsWith('>') && trimmed.toLowerCase().includes('safety'))) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      elements.push(
        <div key={index} className="my-3 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-rose-900 text-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{renderInline(trimmed.replace(/^>\s*/, ''))}</div>
          </div>
        </div>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      elements.push(
        <blockquote key={index} className="my-2.5 pl-4 border-l-3 border-indigo-400 italic text-slate-600 text-sm bg-indigo-50/30 py-1.5 rounded-r">
          {renderInline(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Bullet list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        const listEl = flushList(index);
        if (listEl) elements.push(listEl);
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Numbered list items
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const itemText = numMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        const listEl = flushList(index);
        if (listEl) elements.push(listEl);
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
      elements.push(
        <p key={index} className="my-2 text-[15px] text-slate-700 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    } else {
      const listEl = flushList(index);
      if (listEl) elements.push(listEl);
    }
  });

  const finalListEl = flushList(99999);
  if (finalListEl) elements.push(finalListEl);

  return (
    <div className="prose-gaja text-slate-800">
      {elements}

      {/* Render interactive Curious Next Questions if available */}
      {followUpQuestions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Curious Next Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onFollowUpClick && onFollowUpClick(q)}
                className="text-left text-xs sm:text-sm bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-900 border border-indigo-200/80 rounded-full px-3.5 py-1.5 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>💡</span>
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
