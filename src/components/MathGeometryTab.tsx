import React, { useState } from 'react';
import { Compass, Wand2, Play, Activity, Orbit, RefreshCw, Cpu } from 'lucide-react';
import { MATH_PRESETS } from '../constants/presets';
import { PresetItem } from '../types';
import { CodeBlock } from './CodeBlock';

interface MathGeometryTabProps {
  onApplyToComp: (code: string) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, category: string) => Promise<string | void>;
  activeResult: string;
}

export const MathGeometryTab: React.FC<MathGeometryTabProps> = ({
  onApplyToComp,
  isGenerating,
  onGenerate,
  activeResult,
}) => {
  const [prompt, setPrompt] = useState(
    'Write an After Effects expression for Position that creates a smooth Lissajous figure-8 curve with adjustable frequency ratios.'
  );
  const [selectedPreset, setSelectedPreset] = useState<PresetItem>(MATH_PRESETS[0]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt, 'Math & Trigonometry Geometry Expression / Script');
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPreset(preset);
    setPrompt(preset.prompt);
    if (preset.defaultCode) {
      onApplyToComp(preset.defaultCode);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900/60 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Math & Trigonometry Studio</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Vector & Trig
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Solve vector math, orbital trajectories, golden ratios, and harmonic Lissajous motion paths
            with clean vector arithmetic.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Math & Geometry Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {MATH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 shadow-sm'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-emerald-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Math Formula CheatSheet Bar */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold">Trig:</span>
          <span>x = r * cos(θ), y = r * sin(θ)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold">Vector:</span>
          <span>dist = length(p1, p2)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold">Angle:</span>
          <span>radiansToDegrees(Math.atan2(dy, dx))</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">
            Geometry & Math Expression Prompt:
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            Pure native vector calculations
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Describe your math motion (e.g. Spiral expanding outward with golden ratio 137.5 degrees and sine decay...)"
          className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Avoids expensive loops in expressions for smooth 60fps AE preview playback.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedPreset.defaultCode) {
                  onApplyToComp(selectedPreset.defaultCode);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-zinc-400" />
              <span>Load Preset Code</span>
            </button>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Math...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Math Expression</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Code Display */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Expression Math Output
          </span>
        </div>

        <CodeBlock
          code={activeResult || selectedPreset.defaultCode || ''}
          title="Parametric Motion Expression"
          targetProperty="Position"
          filename="ae_math_path.jsx"
          onApply={(code) => onApplyToComp(code)}
        />
      </div>
    </div>
  );
};
