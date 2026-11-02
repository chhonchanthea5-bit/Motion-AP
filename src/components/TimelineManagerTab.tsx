import React, { useState } from 'react';
import { Clock, Wand2, Play, Palette, FileText, Film, RefreshCw, Sliders } from 'lucide-react';
import { TIMELINE_PRESETS } from '../constants/presets';
import { PresetItem } from '../types';
import { CodeBlock } from './CodeBlock';

interface TimelineManagerTabProps {
  onApplyToComp: (code: string) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, category: string) => Promise<string | void>;
  activeResult: string;
}

export const TimelineManagerTab: React.FC<TimelineManagerTabProps> = ({
  onApplyToComp,
  isGenerating,
  onGenerate,
  activeResult,
}) => {
  const [prompt, setPrompt] = useState(
    'Create an ExtendScript script that staggers the in-points of selected layers by 5 frames with reverse order option.'
  );
  const [selectedPreset, setSelectedPreset] = useState<PresetItem>(TIMELINE_PRESETS[0]);
  const [staggerFrames, setStaggerFrames] = useState(5);
  const [prefixName, setPrefixName] = useState('Layer_');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt, 'Timeline & Layer Management Script');
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900/60 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Timeline & Layer Management</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              AE Utilities
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Streamline your comp workflow: batch rename layers with regex, stagger keyframes/in-points,
            color-code timeline tracks by layer type, and inject custom render queue templates.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Workflow Utilities:
        </span>
        <div className="flex flex-wrap gap-2">
          {TIMELINE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Configurator Bar */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-3.5 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Quick Tool Knobs:
        </span>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Offset:</span>
          <input
            type="number"
            min={1}
            max={60}
            value={staggerFrames}
            onChange={(e) => {
              const val = Number(e.target.value);
              setStaggerFrames(val);
              setPrompt(`Create an ExtendScript script that staggers selected layers by ${val} frames.`);
            }}
            className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono text-xs text-center focus:outline-none"
          />
          <span className="text-zinc-500 font-mono">frames</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Prefix:</span>
          <input
            type="text"
            value={prefixName}
            onChange={(e) => {
              setPrefixName(e.target.value);
              setPrompt(`Create an ExtendScript script that batch renames selected layers using prefix "${e.target.value}" and zero-padded two-digit indices.`);
            }}
            className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono text-xs focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setPrompt(`Write an ExtendScript script that applies color labels to active comp layers: Text layers = Purple (11), Shapes = Cyan (9), Nulls = Yellow (13), Solids = Dark Green (8).`);
          }}
          className="ml-auto text-[11px] text-amber-400 hover:text-amber-300 font-mono underline"
        >
          Preset: Studio Color Code
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">
            Timeline Automation Task:
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            ExtendScript batch processing
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="E.g. Write an ExtendScript script to color-code all shape layers cyan and text layers purple, and sequence them by 4 frames..."
          className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500 placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Scripts include undo grouping and active composition checks.
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
              <span>Load Preset</span>
            </button>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shadow-amber-600/30 flex items-center gap-2 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Timeline Utility</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Code Result */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            ExtendScript Output (JSX)
          </span>
        </div>

        <CodeBlock
          code={activeResult || selectedPreset.defaultCode || ''}
          title="ExtendScript Timeline Tool"
          filename="ae_timeline_tool.jsx"
          onApply={(code) => onApplyToComp(code)}
        />
      </div>
    </div>
  );
};
