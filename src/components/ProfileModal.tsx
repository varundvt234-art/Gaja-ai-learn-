import React, { useState } from 'react';
import { UserPreferences, LearningMode, LearnerLevel, LanguageCode } from '../types';
import { 
  Settings, 
  X, 
  ShieldCheck, 
  Trash2, 
  Download, 
  Volume2, 
  GraduationCap, 
  Languages, 
  User, 
  Save, 
  Check 
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onClearAllData: () => void;
  onExportData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onClearAllData,
  onExportData,
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Learner Profile & Settings</h3>
              <p className="text-xs text-slate-500">Personalize your teacher, grade, language, and privacy</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Learner Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Learner Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Maya, Arjun, Alex"
            />
          </div>

          {/* Target Grade Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Default Learning Level</span>
            </label>
            <select
              value={formData.defaultLevel}
              onChange={(e) => setFormData({ ...formData, defaultLevel: e.target.value as LearnerLevel })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option value="elementary">Grade 1-5 (Elementary School - Simple & playful)</option>
              <option value="middle">Grade 6-8 (Middle School - Relatable analogies)</option>
              <option value="high_school">Grade 9-12 (High School - Academic & structured)</option>
              <option value="college">College / University (Advanced concepts & formulas)</option>
              <option value="general">General Curious Learner</option>
            </select>
          </div>

          {/* Default Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Default Learning Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['easy', 'quick', 'detailed', 'visual', 'step-by-step', 'expert'] as LearningMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFormData({ ...formData, defaultMode: mode })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    formData.defaultMode === mode
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Default Language */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preferred Language</span>
            </label>
            <select
              value={formData.defaultLanguage}
              onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value as LanguageCode })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option value="en">English (Universal)</option>
              <option value="te">Telugu (తెలుగు - with English terms)</option>
              <option value="hi">Hindi (हिंदी - with English terms)</option>
              <option value="ta">Tamil (தமிழ் - with English terms)</option>
              <option value="es">Spanish (Español)</option>
            </select>
          </div>

          {/* Privacy & Trust Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy & Accuracy Promise</span>
            </div>
            <p className="leading-relaxed">
              • <strong>Camera & Photos:</strong> Captured photos are processed securely via server-side AI to answer your questions and are never permanently stored without your consent.
            </p>
            <p className="leading-relaxed">
              • <strong>Accuracy:</strong> Responses are grounded in verified academic and scientific institutions using Google Search Grounding. For wild plants, mushrooms, or medical concerns, always exercise caution.
            </p>
          </div>

          {/* Data Management Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onExportData}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Learning Notes (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved conversations and local learning history?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Clear All Data</span>
            </button>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
