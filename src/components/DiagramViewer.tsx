import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, Minimize2, Check, Sparkles } from 'lucide-react';

interface DiagramViewerProps {
  svgContent: string;
  topic?: string;
  onClose?: () => void;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ svgContent, topic = 'Educational Diagram' }) => {
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.6));
  const handleResetZoom = () => setScale(1);

  const handleDownload = () => {
    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_diagram.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mt-4 rounded-xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60 shadow-sm overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-white shadow-2xl' : 'relative'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-semibold tracking-wide truncate max-w-[200px] sm:max-w-md">
            Educational Diagram: {topic}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-medium border border-indigo-400/20">
            Vector SVG
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 text-slate-400">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={handleCopy}
            title="Copy SVG XML"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[11px]">Copy</span>}
          </button>
          <button
            onClick={handleDownload}
            title="Download SVG Diagram"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div 
        className={`w-full overflow-auto p-4 flex items-center justify-center bg-radial from-white to-slate-100/50 ${
          isFullscreen ? 'flex-1' : 'min-h-[340px] max-h-[520px]'
        }`}
      >
        <div 
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
          className="w-full max-w-3xl flex justify-center drop-shadow-xs"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Diagram footer notice */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Curated educational visualization with clear labels and scientific process flow</span>
        <span className="text-slate-400">Scale-independent vector</span>
      </div>
    </div>
  );
};
