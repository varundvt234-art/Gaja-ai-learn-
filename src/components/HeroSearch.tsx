import React, { useRef, useState } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Search, 
  Compass, 
  Mic, 
  MicOff, 
  ArrowRight, 
  X, 
  Sparkles,
  Zap,
  Leaf,
  Heart,
  Orbit,
  Sun,
  Flower2
} from 'lucide-react';
import { STARTER_QUESTIONS } from '../data/topics';
import { LearningMode, LanguageCode } from '../types';
import { VoiceRecognitionService } from '../utils/speech';

interface HeroSearchProps {
  onSearchSubmit: (text: string, image?: { base64: string; mimeType: string; fileName: string }) => void;
  onOpenCamera: () => void;
  onOpenTopics: () => void;
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onPreviewShowcase?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearchSubmit,
  onOpenCamera,
  onOpenTopics,
  currentMode,
  onModeChange,
  currentLanguage,
  onLanguageChange,
  onPreviewShowcase,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; fileName: string } | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setSelectedImage({
        base64,
        mimeType: file.type,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage({
          base64,
          mimeType: file.type,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setIsListening(false);
    } else {
      const rec = VoiceRecognitionService.startListening(
        currentLanguage,
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        },
        (err) => {
          console.warn('Voice recognition error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      if (rec) {
        setRecognitionInstance(rec);
        setIsListening(true);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    onSearchSubmit(inputText.trim(), selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const getStarterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Flower2': return <Flower2 className="w-5 h-5 text-pink-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Orbit': return <Orbit className="w-5 h-5 text-purple-500" />;
      case 'Sun': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-14 px-4 text-center">
      {/* Brand Hero Heading */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-semibold mb-5 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>Multimodal AI Vision & Scientific Explanations</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
        See Anything.{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
          Understand Everything.
        </span>
      </h1>

      <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Your patient, friendly AI teacher. Snap a photo of any flower, circuit, rock, organ, or machine — or ask any curious question to get crystal clear explanations with diagrams and real sources.
      </p>

      {/* Main Search & Upload Central Box */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative bg-white rounded-3xl border-2 border-indigo-200/90 shadow-xl shadow-indigo-500/10 p-3 sm:p-4 mb-6 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
      >
        {/* Attached image preview banner if user uploaded an image */}
        {selectedImage && (
          <div className="mb-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage.base64}
                alt="Selected"
                className="w-12 h-12 object-cover rounded-xl border border-slate-300 shadow-xs"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {selectedImage.fileName || 'Attached Photo'}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span>Ready for AI Vision Analysis</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Upload a photo or ask me anything..."
              className="w-full py-3.5 pr-10 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base bg-transparent focus:outline-none"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice input button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2 rounded-xl mr-2 transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Ask Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !selectedImage}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Ask Gaja</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Action Buttons row (Upload Image, Take a Photo, Ask a Question, Explore Topics) */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={onOpenCamera}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Take a Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
              inputEl?.focus();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Ask a Question</span>
          </button>

          <button
            type="button"
            onClick={onOpenTopics}
            className="px-3.5 py-2 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 text-xs font-semibold flex items-center gap-2 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Explore Topics</span>
          </button>
        </div>

        {/* Live Interface Review Showcase Banner */}
        {onPreviewShowcase && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 p-3 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-2 text-slate-700 text-xs text-left">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Review Full Interface:</span>
                <p className="text-[11px] text-slate-500">Inspect the structured teacher explanation, vector SVG diagram, quiz & chat layout</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onPreviewShowcase}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Preview Teacher View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Example Question Cards Grid from User Requirements */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Try An Example Question</span>
            </h3>
            <p className="text-xs text-slate-500">Click any card to start learning instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
          {STARTER_QUESTIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSearchSubmit(item.prompt)}
              className="group p-4 bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-indigo-100/60 transition-colors">
                  {getStarterIcon(item.icon)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                  {item.badge}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 text-sm mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {item.subject}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Explore explanation</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
