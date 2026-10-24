/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ConversationSession, 
  ChatMessage, 
  LearningMode, 
  LearnerLevel, 
  LanguageCode, 
  UserPreferences 
} from './types';
import { 
  loadSessions, 
  saveSessions, 
  loadPreferences, 
  savePreferences, 
  updateLearningStreak, 
  clearAllLocalData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ChatContainer } from './components/ChatContainer';
import { CameraModal } from './components/CameraModal';
import { Sidebar } from './components/Sidebar';
import { TopicExplorerModal } from './components/TopicExplorerModal';
import { ProfileModal } from './components/ProfileModal';
import { SAMPLE_SHOWCASE_SESSION } from './data/sampleDemo';
import { AlertCircle, X, Sparkles } from 'lucide-react';

export default function App() {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [currentMode, setCurrentMode] = useState<LearningMode>(preferences.defaultMode || 'easy');
  const [currentLevel, setCurrentLevel] = useState<LearnerLevel>(preferences.defaultLevel || 'middle');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(preferences.defaultLanguage || 'en');
  const [streakCount, setStreakCount] = useState<number>(1);

  // Modals & Drawers
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Async States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize from local storage, seeding showcase demo if empty
  useEffect(() => {
    const loaded = loadSessions();
    if (loaded.length === 0) {
      setSessions([SAMPLE_SHOWCASE_SESSION]);
    } else {
      setSessions(loaded);
    }
    const streak = updateLearningStreak();
    setStreakCount(streak);
  }, []);

  // Save sessions on state updates
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Quick toggle between Homepage and Teacher Active Learning View
  const handleToggleView = () => {
    if (activeSessionId) {
      setActiveSessionId(null);
    } else {
      const targetId = sessions.length > 0 ? sessions[0].id : SAMPLE_SHOWCASE_SESSION.id;
      if (!sessions.some((s) => s.id === targetId)) {
        setSessions((prev) => [SAMPLE_SHOWCASE_SESSION, ...prev]);
      }
      setActiveSessionId(targetId);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // New Chat
  const handleNewChat = () => {
    setActiveSessionId(null);
    setErrorMessage(null);
  };

  // Main submission (either from homepage hero or fresh prompt)
  const handleSearchSubmit = async (
    text: string, 
    image?: { base64: string; mimeType: string; fileName: string }
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    const sessionId = 'session_' + Date.now();
    const title = text ? text.slice(0, 50) : (image?.fileName || 'Image Analysis');

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text || (image ? 'What is this? Please explain what I am seeing in detail.' : ''),
      timestamp: new Date().toISOString(),
      imageAttachment: image,
      modeUsed: currentMode,
      levelUsed: currentLevel,
      languageUsed: currentLanguage,
    };

    const newSession: ConversationSession = {
      id: sessionId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [userMessage],
      currentImage: image,
      mode: currentMode,
      level: currentLevel,
      language: currentLanguage,
    };

    // Optimistically set active session
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(sessionId);

    try {
      let endpoint = '/api/learn/explain';
      let payload: any = {
        question: text,
        mode: currentMode,
        level: currentLevel,
        language: currentLanguage,
      };

      if (image?.base64) {
        endpoint = '/api/learn/analyze-image';
        payload = {
          imageBase64: image.base64,
          mimeType: image.mimeType || 'image/jpeg',
          question: text,
          mode: currentMode,
          level: currentLevel,
          language: currentLanguage,
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze request');
      }

      const assistantMessage: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: data.explanation || '',
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        modeUsed: currentMode,
        levelUsed: currentLevel,
        languageUsed: currentLanguage,
      };

      // Update session with assistant reply immediately so learner gets answer in 2-3 seconds
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, assistantMessage],
              }
            : s
        )
      );

      // If user selected Visual Learning mode, fetch diagram asynchronously without blocking
      if (currentMode === 'visual') {
        fetch('/api/learn/diagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: title,
            context: data.explanation.slice(0, 300),
          }),
        })
          .then((res) => res.json())
          .then((diagData) => {
            if (diagData.svg) {
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== sessionId) return s;
                  const updated = [...s.messages];
                  const lastIdx = updated.length - 1;
                  if (lastIdx >= 0) {
                    updated[lastIdx] = { ...updated[lastIdx], diagramSvg: diagData.svg };
                  }
                  return { ...s, messages: updated };
                })
              );
            }
          })
          .catch((diagErr) => console.warn('Async diagram load notice:', diagErr));
      }

      // Increment learning streak
      const updatedStreak = updateLearningStreak();
      setStreakCount(updatedStreak);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please check your connection and try again.');
      
      // Add error message to session
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ **Unable to complete request:** ${err.message || 'Please check that a valid GEMINI_API_KEY is configured in Settings > Secrets and try again.'}`,
        timestamp: new Date().toISOString(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, errorMsg] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up chat message
  const handleFollowUpMessage = async (
    text: string, 
    newImage?: { base64: string; mimeType: string; fileName: string }
  ) => {
    if (!activeSession) return;

    setIsLoading(true);
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      imageAttachment: newImage,
      modeUsed: currentMode,
      levelUsed: currentLevel,
      languageUsed: currentLanguage,
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    const sessionImage = newImage || activeSession.currentImage;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              currentImage: sessionImage,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            }
          : s
      )
    );

    try {
      const res = await fetch('/api/learn/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentImage: sessionImage,
          mode: currentMode,
          level: currentLevel,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to process chat response');
      }

      const assistantMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: data.reply || '',
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        modeUsed: currentMode,
        levelUsed: currentLevel,
        languageUsed: currentLanguage,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, assistantMsg],
              }
            : s
        )
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Failed to get follow-up explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Request SVG Diagram for active session
  const handleRequestDiagram = async (topic: string, context: string) => {
    if (!activeSession) return;
    setIsGeneratingDiagram(true);

    try {
      const res = await fetch('/api/learn/diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeSession.title || topic, context }),
      });

      const data = await res.json();
      if (data.svg) {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSession.id) return s;
            const updated = [...s.messages];
            const lastAssistantIdx = updated.map((m) => m.role).lastIndexOf('assistant');
            if (lastAssistantIdx !== -1) {
              updated[lastAssistantIdx] = {
                ...updated[lastAssistantIdx],
                diagramSvg: data.svg,
              };
            }
            return { ...s, messages: updated };
          })
        );
      }
    } catch (err: any) {
      console.error('Diagram generation error:', err);
      setErrorMessage('Could not generate diagram at this moment.');
    } finally {
      setIsGeneratingDiagram(false);
    }
  };

  // Request Active Recall Quiz
  const handleRequestQuiz = async (topic: string, context: string) => {
    if (!activeSession) return;
    setIsGeneratingQuiz(true);

    try {
      const res = await fetch('/api/learn/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: activeSession.title || topic, 
          context,
          language: currentLanguage 
        }),
      });

      const data = await res.json();
      if (data.quiz && Array.isArray(data.quiz)) {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSession.id) return s;
            const updated = [...s.messages];
            const lastAssistantIdx = updated.map((m) => m.role).lastIndexOf('assistant');
            if (lastAssistantIdx !== -1) {
              updated[lastAssistantIdx] = {
                ...updated[lastAssistantIdx],
                quiz: data.quiz,
              };
            }
            return { ...s, messages: updated };
          })
        );
      }
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setErrorMessage('Could not generate quiz at this moment.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Switch Mode on current explanation
  const handleSwitchMode = (newMode: LearningMode, originalText: string) => {
    setCurrentMode(newMode);
    handleFollowUpMessage(`Please re-explain this in ${newMode.toUpperCase()} mode.`);
  };

  // Translate explanation to target language
  const handleTranslate = (lang: LanguageCode, originalText: string) => {
    setCurrentLanguage(lang);
    const langNames: Record<LanguageCode, string> = {
      en: 'English',
      te: 'Telugu (తెలుగు)',
      hi: 'Hindi (हिंदी)',
      ta: 'Tamil (தமிழ்)',
      es: 'Spanish (Español)',
    };
    handleFollowUpMessage(`Please re-explain this topic in ${langNames[lang]}, keeping technical scientific terms in English alongside the translation.`);
  };

  // Camera snapshot handler
  const handleCameraCapture = (base64: string, mimeType: string) => {
    setIsCameraOpen(false);
    handleSearchSubmit('Please examine this photo closely. What is it, how does it work, and what are its key features?', {
      base64,
      mimeType,
      fileName: 'Camera_Snapshot_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.jpg',
    });
  };

  // Data management
  const handleClearAll = () => {
    clearAllLocalData();
    setSessions([]);
    setActiveSessionId(null);
  };

  const handleExportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `gaja_ai_learn_notes_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <Navbar
        currentMode={currentMode}
        onModeChange={(mode) => setCurrentMode(mode)}
        currentLevel={currentLevel}
        onLevelChange={(lvl) => setCurrentLevel(lvl)}
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => setCurrentLanguage(lang)}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenTopics={() => setIsTopicsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        streakCount={streakCount}
        activeView={activeSession ? 'chat' : 'home'}
        onToggleView={handleToggleView}
      />

      {/* Error Toast Notification if any */}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-rose-900/90 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2 border border-rose-700">
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-rose-800 rounded-lg text-rose-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeSession ? (
          <ChatContainer
            session={activeSession}
            onSendMessage={handleFollowUpMessage}
            onRequestDiagram={handleRequestDiagram}
            onRequestQuiz={handleRequestQuiz}
            onSwitchMode={handleSwitchMode}
            onTranslate={handleTranslate}
            onModeChange={(mode) => setCurrentMode(mode)}
            onLanguageChange={(lang) => setCurrentLanguage(lang)}
            onOpenCamera={() => setIsCameraOpen(true)}
            onBackToHome={() => setActiveSessionId(null)}
            isLoading={isLoading}
            isGeneratingDiagram={isGeneratingDiagram}
            isGeneratingQuiz={isGeneratingQuiz}
          />
        ) : (
          <HeroSearch
            onSearchSubmit={handleSearchSubmit}
            onOpenCamera={() => setIsCameraOpen(true)}
            onOpenTopics={() => setIsTopicsOpen(true)}
            currentMode={currentMode}
            onModeChange={(mode) => setCurrentMode(mode)}
            currentLanguage={currentLanguage}
            onLanguageChange={(lang) => setCurrentLanguage(lang)}
            onPreviewShowcase={() => {
              if (!sessions.some((s) => s.id === SAMPLE_SHOWCASE_SESSION.id)) {
                setSessions((prev) => [SAMPLE_SHOWCASE_SESSION, ...prev]);
              }
              setActiveSessionId(SAMPLE_SHOWCASE_SESSION.id);
            }}
          />
        )}
      </main>

      {/* Live Device Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Topics Explorer Library Modal */}
      <TopicExplorerModal
        isOpen={isTopicsOpen}
        onClose={() => setIsTopicsOpen(false)}
        onSelectTopic={(prompt) => handleSearchSubmit(prompt)}
      />

      {/* Sidebar History Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewChat={handleNewChat}
        onDeleteSession={(id) => {
          setSessions((prev) => prev.filter((s) => s.id !== id));
          if (activeSessionId === id) setActiveSessionId(null);
        }}
        onClearAll={handleClearAll}
        onOpenTopics={() => setIsTopicsOpen(true)}
      />

      {/* User Preferences & Privacy Settings Modal */}
      <ProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={(prefs) => {
          setPreferences(prefs);
          savePreferences(prefs);
          setCurrentMode(prefs.defaultMode);
          setCurrentLevel(prefs.defaultLevel);
          setCurrentLanguage(prefs.defaultLanguage);
        }}
        onClearAllData={handleClearAll}
        onExportData={handleExportData}
      />
    </div>
  );
}
