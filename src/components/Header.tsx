import React from 'react';
import { Layers, Terminal, Sparkles, Download, Cpu, PlayCircle, BookOpen, Check } from 'lucide-react';
import { AEVersion } from '../types';

interface HeaderProps {
  aeVersion: AEVersion;
  setAeVersion: (v: AEVersion) => void;
  onOpenSystemPrompt: () => void;
  onOpenExportModal: () => void;
  activeCompName: string;
}

export const Header: React.FC<HeaderProps> = ({
  aeVersion,
  setAeVersion,
  onOpenSystemPrompt,
  onOpenExportModal,
  activeCompName,
}) => {
  return (
    <header className="h-14 bg-[#141416] border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* Left: Branding & AE Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Adobe AE styled icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9999FF]/20 to-[#00005B] border border-[#9999FF]/40 flex items-center justify-center shadow-lg shadow-indigo-950/40">
            <span className="text-[#9999FF] font-black text-sm tracking-tighter">Ae</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-zinc-100 flex items-center gap-1.5">
                AE MASTER
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  TD Command Center
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Comp: <strong className="text-zinc-200 font-medium">{activeCompName}</strong> (1920x1080 @ 30fps)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Engine & Version Selector */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-900/90 px-3 py-1 rounded-lg border border-zinc-800 text-xs">
        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-zinc-400">Engine:</span>
        <span className="text-zinc-200 font-mono font-medium">Modern JavaScript (ES6+)</span>
        <span className="text-zinc-700">|</span>
        <select
          value={aeVersion}
          onChange={(e) => setAeVersion(e.target.value as AEVersion)}
          className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer hover:text-indigo-300 transition-colors font-medium"
        >
          <option value="AE 2026" className="bg-zinc-900 text-zinc-100">AE 2026</option>
          <option value="AE 2025" className="bg-zinc-900 text-zinc-100">AE 2025</option>
          <option value="AE 2024" className="bg-zinc-900 text-zinc-100">AE 2024</option>
          <option value="AE CC (Legacy)" className="bg-zinc-900 text-zinc-100">AE CC (Legacy ExtendScript)</option>
        </select>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSystemPrompt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-xs font-medium text-zinc-200 transition-all hover:border-zinc-600 shadow-sm"
          title="View and copy the Google AI Studio System Prompt"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>System Prompt</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/25 active:scale-95"
          title="Export CEP Extension for Adobe After Effects"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CEP Plugin</span>
        </button>
      </div>
    </header>
  );
};
