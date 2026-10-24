import React, { useState, useRef, useEffect } from 'react';
import { 
  ConversationSession, 
  LearningMode, 
  LearnerLevel, 
  LanguageCode 
} from '../types';
import { MessageBubble } from './MessageBubble';
import { VoiceRecognitionService } from '../utils/speech';
import { 
  Send, 
  Camera, 
  UploadCloud, 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ArrowLeft,
  RotateCcw,
  Loader2,
  FileImage
} from 'lucide-react';

interface ChatContainerProps {
  session: ConversationSession;
  onSendMessage: (text: string, newImage?: { base64: string; mimeType: string; fileName: string }) => void;
  onRequestDiagram: (topic: string, context: string) => void;
  onRequestQuiz: (topic: string, context: string) => void;
  onSwitchMode: (mode: LearningMode, originalText: string) => void;
  onTranslate: (lang: LanguageCode, originalText: string) => void;
  onModeChange: (mode: LearningMode) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenCamera: () => void;
  onBackToHome: () => void;
  isLoading: boolean;
  isGeneratingDiagram: boolean;
  isGeneratingQuiz: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  session,
  onSendMessage,
  onRequestDiagram,
  onRequestQuiz,
  onSwitchMode,
  onTranslate,
  onModeChange,
  onLanguageChange,
  onOpenCamera,
  onBackToHome,
  isLoading,
  isGeneratingDiagram,
  isGeneratingQuiz,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [attachedImage, setAttachedImage] = useState<{ base64: string; mimeType: string; fileName: string } | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedImage({
        base64,
        mimeType: file.type,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionInstance) recognitionInstance.stop();
      setIsListening(false);
    } else {
      const rec = VoiceRecognitionService.startListening(
        session.language,
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (rec) {
        setRecognitionInstance(rec);
        setIsListening(true);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    onSendMessage(inputText.trim(), attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
  };

  const modeLabels: Record<LearningMode, { label: string; icon: string }> = {
    quick: { label: 'Quick', icon: '⚡' },
    easy: { label: 'Easy', icon: '🐣' },
    detailed: { label: 'Detailed', icon: '🔬' },
    visual: { label: 'Visual', icon: '🎨' },
    'step-by-step': { label: 'Step-by-Step', icon: '🪜' },
    student: { label: 'Student', icon: '🎓' },
    expert: { label: 'Expert', icon: '🧠' },
  };

  const quickPrompts = [
    { label: 'Explain more simply', prompt: 'Could you explain that more simply with an easy everyday analogy?' },
    { label: 'Give a real-life example', prompt: 'Can you give 2 practical everyday life examples of this?' },
    { label: 'Show a diagram', action: 'diagram' },
    { label: 'Quiz me on this!', action: 'quiz' },
    { label: 'Explain in Telugu (తెలుగు)', lang: 'te' as LanguageCode },
    { label: 'Explain in Hindi (हिंदी)', lang: 'hi' as LanguageCode },
  ];

  const handleQuickPromptClick = (item: any) => {
    if (item.action === 'diagram') {
      const lastMsg = [...session.messages].reverse().find((m) => m.role === 'assistant');
      onRequestDiagram(session.title || 'Concept Diagram', lastMsg?.content.slice(0, 300) || '');
    } else if (item.action === 'quiz') {
      const lastMsg = [...session.messages].reverse().find((m) => m.role === 'assistant');
      onRequestQuiz(session.title || 'Comprehension Quiz', lastMsg?.content.slice(0, 300) || '');
    } else if (item.lang) {
      const lastMsg = [...session.messages].reverse().find((m) => m.role === 'assistant');
      onTranslate(item.lang, lastMsg?.content || session.title);
    } else if (item.prompt) {
      onSendMessage(item.prompt);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2 sm:px-4">
      {/* Top Session Header Bar */}
      <div className="py-2.5 px-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 my-2 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Back to home overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {session.currentImage && (
            <div className="relative group shrink-0">
              <img
                src={session.currentImage.base64}
                alt="Session photo"
                className="w-8 h-8 rounded-lg object-cover border border-indigo-200 cursor-pointer"
              />
              <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-50 p-1 bg-white rounded-xl shadow-xl border border-slate-200">
                <img
                  src={session.currentImage.base64}
                  alt="Expanded"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {session.title || 'Doubt Clearing Conversation'}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>{session.messages.length} messages</span>
              <span>•</span>
              <span className="capitalize">{session.mode} mode</span>
            </div>
          </div>
        </div>

        {/* Mode Switcher pill on chat */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
              <span>{modeLabels[session.mode].icon}</span>
              <span className="hidden sm:inline">{modeLabels[session.mode].label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Change Mode
              </div>
              {(Object.keys(modeLabels) as LearningMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className={`w-full text-left px-3 py-1 text-xs flex items-center gap-2 hover:bg-indigo-50 cursor-pointer ${
                    session.mode === m ? 'font-bold text-indigo-700 bg-indigo-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{modeLabels[m].icon}</span>
                  <span>{modeLabels[m].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-4 space-y-4">
        {session.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onFollowUpClick={(q) => onSendMessage(q)}
            onRequestDiagram={onRequestDiagram}
            onRequestQuiz={onRequestQuiz}
            onSwitchMode={onSwitchMode}
            onTranslate={onTranslate}
            isGeneratingDiagram={isGeneratingDiagram}
            isGeneratingQuiz={isGeneratingQuiz}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center mb-6 animate-pulse">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-600">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Gaja AI is thinking, analyzing evidence, and consulting verified sources...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions Row */}
      <div className="py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPromptClick(item)}
            className="px-3 py-1 rounded-full text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200/80 hover:border-indigo-200 whitespace-nowrap transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            {item.action === 'diagram' && <Layers className="w-3 h-3 text-indigo-600" />}
            {item.action === 'quiz' && <HelpCircle className="w-3 h-3 text-amber-600" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Input Box */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-lg p-2.5 sm:p-3 mb-3">
        {/* Attached image preview banner */}
        {attachedImage && (
          <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={attachedImage.base64}
                alt="Attached"
                className="w-10 h-10 object-cover rounded-lg border border-slate-300"
              />
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px] block">
                  {attachedImage.fileName}
                </span>
                <span className="text-[10px] text-emerald-600">Attached to follow-up</span>
              </div>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
          </button>

          {/* Take photo button */}
          <button
            type="button"
            onClick={onOpenCamera}
            title="Take a live photo"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Main follow-up text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a follow-up doubt or question about this..."
            disabled={isLoading}
            className="flex-1 py-2 px-1 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm bg-transparent focus:outline-none"
          />

          {/* Speech input */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            title={isListening ? 'Stop listening' : 'Voice input'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !attachedImage) || isLoading}
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
