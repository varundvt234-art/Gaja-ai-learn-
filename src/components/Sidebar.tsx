import React, { useState } from 'react';
import { 
  ConversationSession, 
  LearningMode, 
  LearnerLevel, 
  LanguageCode 
} from '../types';
import { 
  Plus, 
  Trash2, 
  Bookmark, 
  Search, 
  X, 
  MessageSquare, 
  Compass, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ConversationSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onOpenTopics: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
  onOpenTopics,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBookmark, setFilterBookmark] = useState<boolean>(false);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBookmark = filterBookmark ? s.isBookmarked : true;
    return matchesSearch && matchesBookmark;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Drawer Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
              🐘
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Learning Journal</h3>
              <p className="text-[10px] text-slate-400">Your curious questions & insights</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start Fresh Doubts</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="px-3 pb-2 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous questions..."
              className="w-full bg-slate-800/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-400 border border-slate-700/60 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>{sessions.length} recorded doubt{sessions.length !== 1 ? 's' : ''}</span>
            {sessions.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No questions saved yet.</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Ask a question or snap a photo to begin!
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const dateStr = new Date(session.updatedAt || session.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <p className="font-medium truncate">{session.title || 'Untitled question'}</p>
                      <span className="text-[10px] text-slate-500 block">{dateStr}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Delete question"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-1.5">
          <button
            onClick={() => {
              onOpenTopics();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full text-left p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Browse Topic Library</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <div className="px-2 pt-1.5 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Gaja AI Learn v1.0</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
