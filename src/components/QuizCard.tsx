import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Award, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === questions.length;
  const score = calculateScore();

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="mt-5 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base">Quick Comprehension Check</h4>
            <p className="text-xs text-slate-500">Test what you just learned with 3 instant questions</p>
          </div>
        </div>

        {showResults && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Score: {score} / {questions.length}
            </span>
            <button
              onClick={handleReset}
              title="Try Again"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-100 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isAnswered = userChoice !== undefined;

          return (
            <div key={qIdx} className="bg-white/80 rounded-xl p-3.5 border border-slate-200/70 shadow-2xs">
              <p className="text-sm font-semibold text-slate-800 mb-2.5 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span>{q.question}</span>
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700';

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                    } else if (userChoice === optIdx && optIdx !== q.correctIndex) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      optStyle = 'border-slate-100 text-slate-400 opacity-60';
                    }
                  } else if (userChoice === optIdx) {
                    optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium ring-1 ring-indigo-500';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={showResults}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left text-xs sm:text-sm px-3.5 py-2 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {showResults && userChoice === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submitting */}
              {showResults && q.explanation && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-amber-50/50 p-2 rounded-lg">
                  <span className="font-semibold text-amber-800">Why: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action footer */}
      {!showResults && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </span>
          <button
            type="button"
            disabled={!isAllAnswered}
            onClick={() => setShowResults(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isAllAnswered
                ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check My Answers</span>
          </button>
        </div>
      )}
    </div>
  );
};
