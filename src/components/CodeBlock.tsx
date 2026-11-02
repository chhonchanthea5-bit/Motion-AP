import React, { useState } from 'react';
import { Copy, Check, Download, Play, Terminal, CheckCircle2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  targetProperty?: string;
  onApply?: (code: string) => void;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  title = 'ExtendScript / Expression Code',
  targetProperty,
  onApply,
  filename = 'ae_script.jsx',
}) => {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(code);
      setApplied(true);
      setTimeout(() => setApplied(false), 2200);
    }
  };

  // Basic syntax coloring logic
  const renderHighlightedCode = (rawCode: string) => {
    const lines = rawCode.split('\n');
    return lines.map((line, idx) => {
      // Highlight comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return (
          <div key={idx} className="table-row">
            <span className="table-cell pr-4 text-right text-zinc-600 select-none text-xs">{idx + 1}</span>
            <span className="table-cell text-zinc-500 italic whitespace-pre font-mono">{line}</span>
          </div>
        );
      }

      // Format keywords & numbers simply
      return (
        <div key={idx} className="table-row hover:bg-zinc-800/30 transition-colors">
          <span className="table-cell pr-4 text-right text-zinc-600 select-none text-xs font-mono">{idx + 1}</span>
          <span className="table-cell text-zinc-200 whitespace-pre font-mono">
            {formatTokens(line)}
          </span>
        </div>
      );
    });
  };

  // Helper token formatter
  const formatTokens = (line: string) => {
    // Basic regex based token replacement
    const parts = line.split(/(\b(?:const|let|var|function|return|if|else|for|while|try|catch|finally|new|thisComp|thisLayer|value|time|Math|app|CompItem|KeyframeEase)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[\s\S]*?`|\b\d+(?:\.\d+)?\b)/g);

    return parts.map((part, i) => {
      if (['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally', 'new'].includes(part)) {
        return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
      }
      if (['thisComp', 'thisLayer', 'value', 'time', 'Math', 'app', 'CompItem', 'KeyframeEase'].includes(part)) {
        return <span key={i} className="text-cyan-400 font-medium">{part}</span>;
      }
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'")) || (part.startsWith('`') && part.endsWith('`'))) {
        return <span key={i} className="text-emerald-300">{part}</span>;
      }
      if (/^\d+(\.\d+)?$/.test(part)) {
        return <span key={i} className="text-amber-300">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0f0f11] overflow-hidden shadow-xl flex flex-col my-3">
      {/* Code Header Bar */}
      <div className="bg-[#18181c] px-3.5 py-2 border-b border-zinc-800/80 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-mono font-medium text-zinc-300">{title}</span>
          {targetProperty && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Apply to: {targetProperty}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onApply && (
            <button
              onClick={handleApply}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                applied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600/90 hover:bg-indigo-600 text-white active:scale-95'
              }`}
              title="Apply expression/script to the virtual comp simulation"
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>Applied to Comp!</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-white" />
                  <span>Test in Preview</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700/60"
            title={`Download ${filename}`}
          >
            <Download className="w-3 h-3" />
            <span>.jsx</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all border ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60 active:scale-95'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-3.5 overflow-x-auto text-xs leading-relaxed max-h-[380px] overflow-y-auto font-mono">
        <div className="table w-full">
          {renderHighlightedCode(code)}
        </div>
      </div>
    </div>
  );
};
