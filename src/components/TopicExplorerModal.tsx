import React, { useState } from 'react';
import { EXPLORE_CATEGORIES } from '../data/topics';
import { Compass, X, Search, Sparkles, ArrowRight, Dna, Atom, Cpu, Globe2, Wrench } from 'lucide-react';

interface TopicExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (prompt: string) => void;
}

export const TopicExplorerModal: React.FC<TopicExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const [filterText, setFilterText] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...EXPLORE_CATEGORIES.map((c) => c.name)];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dna': return <Dna className="w-4 h-4 text-emerald-600" />;
      case 'Atom': return <Atom className="w-4 h-4 text-indigo-600" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-600" />;
      case 'Globe2': return <Globe2 className="w-4 h-4 text-amber-600" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-rose-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const filteredCategories = EXPLORE_CATEGORIES.filter((cat) => {
    if (selectedCat !== 'All' && cat.name !== selectedCat) return false;
    return true;
  }).map((cat) => {
    return {
      ...cat,
      topics: cat.topics.filter((t) =>
        t.title.toLowerCase().includes(filterText.toLowerCase()) ||
        t.prompt.toLowerCase().includes(filterText.toLowerCase())
      ),
    };
  }).filter((cat) => cat.topics.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Topic Explorer</h3>
              <p className="text-xs text-slate-500">Discover science, biology, engineering, astronomy, and history</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-4 sm:px-6 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search across all scientific, technological, and historical topics..."
              className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Categories & Topics Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <p>No matching topics found for &quot;{filterText}&quot;.</p>
              <p className="mt-1 text-xs text-slate-500">Try searching for &quot;cell&quot;, &quot;star&quot;, &quot;battery&quot;, or &quot;tectonics&quot;.</p>
            </div>
          ) : (
            filteredCategories.map((cat, cIdx) => (
              <div key={cIdx}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 rounded-lg bg-slate-100">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{cat.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">({cat.topics.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic.prompt);
                        onClose();
                      }}
                      className="p-3.5 bg-slate-50/70 hover:bg-indigo-50/60 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div>
                        <h5 className="font-semibold text-slate-800 group-hover:text-indigo-950 text-xs sm:text-sm mb-1">
                          {topic.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {topic.prompt}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-1 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
