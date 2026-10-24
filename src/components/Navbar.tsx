import React from 'react';
import { 
  Sparkles, 
  Plus, 
  History, 
  Compass, 
  Settings, 
  Flame, 
  Languages, 
  GraduationCap, 
  SlidersHorizontal,
  ChevronDown 
} from 'lucide-react';
import { LearningMode, LearnerLevel, LanguageCode } from '../types';

interface NavbarProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  currentLevel: LearnerLevel;
  onLevelChange: (level: LearnerLevel) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  onOpenTopics: () => void;
  onOpenSettings: () => void;
  streakCount: number;
  activeView?: 'home' | 'chat';
  onToggleView?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  currentLevel,
  onLevelChange,
  currentLanguage,
  onLanguageChange,
  onNewChat,
  onToggleSidebar,
  onOpenTopics,
  onOpenSettings,
  streakCount,
  activeView,
  onToggleView,
}) => {
  const modeLabels: Record<LearningMode, { label: string; icon: string }> = {
    quick: { label: 'Quick Answer', icon: '⚡' },
    easy: { label: 'Easy Learning', icon: '🐣' },
    detailed: { label: 'Detailed Learning', icon: '🔬' },
    visual: { label: 'Visual Learning', icon: '🎨' },
    'step-by-step': { label: 'Step-by-Step', icon: '🪜' },
    student: { label: 'Student Mode', icon: '🎓' },
    expert: { label: 'Expert Mode', icon: '🧠' },
  };

  const levelLabels: Record<LearnerLevel, string> = {
    elementary: 'Grade 1-5 (Elementary)',
    middle: 'Grade 6-8 (Middle)',
    high_school: 'Grade 9-12 (High School)',
    college: 'College / University',
    general: 'General Learner',
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'es', label: 'Spanish', native: 'Español' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Sidebar toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            title="Chat History & Topics"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <History className="w-5 h-5" />
          </button>

          <div 
            onClick={onNewChat}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Gaja Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <span className="text-lg select-none">🐘</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-600 bg-clip-text text-transparent">
                  Gaja AI Learn
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Smart Teacher
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium -mt-0.5">
                See Anything. Understand Everything.
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Controls (Learning Mode, Grade Level, Language) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          {/* Learning Mode */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 border border-slate-200/60 cursor-pointer transition-all">
              <span>{modeLabels[currentMode].icon}</span>
              <span>{modeLabels[currentMode].label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Learning Mode
              </div>
              {(Object.keys(modeLabels) as LearningMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer ${
                    currentMode === m ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <span>{modeLabels[m].icon}</span>
                  <span>{modeLabels[m].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Learner Level */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer transition-all">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentLevel === 'general' ? 'General' : currentLevel.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Target Age & Class
              </div>
              {(Object.keys(levelLabels) as LearnerLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer ${
                    currentLevel === lvl ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  {levelLabels[lvl]}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer transition-all">
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{languages.find((l) => l.code === currentLanguage)?.native || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer ${
                    currentLanguage === lang.code ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({lang.label})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Learning Streak Pill */}
          <div 
            title={`Active Learning Streak: ${streakCount} day${streakCount > 1 ? 's' : ''}!`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs select-none"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streakCount}</span>
          </div>

          {/* Quick View Toggle (Homepage vs Teacher View) */}
          {onToggleView && (
            <button
              onClick={onToggleView}
              title="Toggle between Homepage and Teacher View"
              className="px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{activeView === 'chat' ? '🏠 Home' : '💬 Teacher View'}</span>
            </button>
          )}

          {/* Explore Topics Button */}
          <button
            onClick={onOpenTopics}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Explore Topics</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Settings / Profile Button */}
          <button
            onClick={onOpenSettings}
            title="Learner Settings & Privacy"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
