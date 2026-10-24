import React, { useState } from 'react';
import { 
  ChatMessage, 
  LearningMode, 
  LanguageCode 
} from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DiagramViewer } from './DiagramViewer';
import { QuizCard } from './QuizCard';
import { SpeechService } from '../utils/speech';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  HelpCircle,
  Share2,
  FileText,
  AlertCircle
} from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onFollowUpClick: (question: string) => void;
  onRequestDiagram: (topic: string, context: string) => void;
  onRequestQuiz: (topic: string, context: string) => void;
  onSwitchMode: (mode: LearningMode, originalText: string) => void;
  onTranslate: (lang: LanguageCode, originalText: string) => void;
  isGeneratingDiagram?: boolean;
  isGeneratingQuiz?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onFollowUpClick,
  onRequestDiagram,
  onRequestQuiz,
  onSwitchMode,
  onTranslate,
  isGeneratingDiagram = false,
  isGeneratingQuiz = false,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      const started = SpeechService.speak(
        message.content,
        message.languageUsed || 'en',
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      if (started) {
        setIsSpeaking(true);
      }
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-2xl bg-indigo-600 text-white rounded-3xl rounded-tr-xs px-5 py-3.5 shadow-md shadow-indigo-600/10">
          {/* User image attachment if present */}
          {message.imageAttachment && (
            <div className="mb-3">
              <img
                src={message.imageAttachment.base64}
                alt="Uploaded by user"
                onClick={() => setImageModalOpen(true)}
                className="max-h-60 rounded-2xl object-cover border border-white/20 cursor-pointer hover:opacity-95 transition-opacity"
              />
              <span className="text-[10px] text-indigo-200 mt-1 block">
                Click to view full image
              </span>
            </div>
          )}

          <p className="text-sm sm:text-base font-normal leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          <div className="text-[10px] text-indigo-200 text-right mt-1.5 opacity-80">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Modal for full image view */}
        {imageModalOpen && message.imageAttachment && (
          <div 
            onClick={() => setImageModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div className="relative max-w-3xl max-h-[90vh]">
              <img 
                src={message.imageAttachment.base64} 
                alt="Full preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl" 
              />
              <button 
                onClick={() => setImageModalOpen(false)}
                className="absolute top-2 right-2 bg-slate-900/80 text-white p-2 rounded-full text-xs"
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex gap-3 sm:gap-4 mb-8">
      {/* Gaja Avatar */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 p-0.5 shrink-0 shadow-md shadow-indigo-500/20">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
          <span className="text-base select-none">🐘</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 max-w-3xl bg-white rounded-3xl rounded-tl-xs border border-slate-200/90 p-4 sm:p-6 shadow-sm">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Gaja AI Teacher</span>
            {message.modeUsed && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60 text-[11px] capitalize">
                {message.modeUsed} Mode
              </span>
            )}
            {message.languageUsed && message.languageUsed !== 'en' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 text-[11px] uppercase">
                {message.languageUsed}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Read Aloud Button */}
            <button
              onClick={handleSpeechToggle}
              title={isSpeaking ? 'Stop reading' : 'Read aloud with AI teacher voice'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                isSpeaking 
                  ? 'bg-amber-100 text-amber-800 animate-pulse font-semibold' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy explanation"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Body */}
        <MarkdownRenderer 
          content={message.content} 
          onFollowUpClick={onFollowUpClick} 
        />

        {/* Render Generated Diagram if available */}
        {message.diagramSvg && (
          <DiagramViewer 
            svgContent={message.diagramSvg} 
            topic="Visual Concept Breakdown" 
          />
        )}

        {/* Render Interactive Comprehension Quiz if available */}
        {message.quiz && message.quiz.length > 0 && (
          <QuizCard questions={message.quiz} />
        )}

        {/* Accuracy & Grounding Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Scientific & Educational Sources</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-xl px-2.5 py-1 flex items-center gap-1.5 transition-colors group"
                >
                  <span className="truncate max-w-[220px]">{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400 group-hover:text-indigo-700" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Multi-tool Action Bar: Show Diagram, Active Recall Quiz, Re-explain in Telugu/Hindi/etc. */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Show Diagram trigger */}
            <button
              type="button"
              disabled={isGeneratingDiagram}
              onClick={() => onRequestDiagram('Concept Diagram', message.content.slice(0, 300))}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isGeneratingDiagram ? 'Drawing diagram...' : 'Show Diagram'}</span>
            </button>

            {/* Quiz Me trigger */}
            <button
              type="button"
              disabled={isGeneratingQuiz}
              onClick={() => onRequestQuiz('Comprehension Quiz', message.content.slice(0, 300))}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{isGeneratingQuiz ? 'Building quiz...' : 'Quiz Me!'}</span>
            </button>
          </div>

          {/* Quick Language Switchers */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Re-explain in:</span>
            <button
              onClick={() => onTranslate('te', message.content)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-medium transition-colors cursor-pointer"
            >
              తెలుగు
            </button>
            <button
              onClick={() => onTranslate('hi', message.content)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-medium transition-colors cursor-pointer"
            >
              हिंदी
            </button>
            <button
              onClick={() => onTranslate('en', message.content)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 font-medium transition-colors cursor-pointer"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
