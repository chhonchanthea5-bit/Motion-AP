import React, { useState } from 'react';
import { Layers, Wand2, Play, Grid, Box, RefreshCw, FileCode, Sliders } from 'lucide-react';
import { RIGGING_PRESETS } from '../constants/presets';
import { PresetItem } from '../types';
import { CodeBlock } from './CodeBlock';

interface AutoRigTabProps {
  onApplyToComp: (code: string) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, category: string) => Promise<string | void>;
  activeResult: string;
}

export const AutoRigTab: React.FC<AutoRigTabProps> = ({
  onApplyToComp,
  isGenerating,
  onGenerate,
  activeResult,
}) => {
  const [prompt, setPrompt] = useState('Create a 3x3 grid of shape layers that scale up sequentially.');
  const [selectedPreset, setSelectedPreset] = useState<PresetItem>(RIGGING_PRESETS[0]);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [staggerFrames, setStaggerFrames] = useState(3);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt, 'Automated Layouts & Auto-Rigging ExtendScript');
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
      <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Auto-Rig & Procedural Layouts</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              ExtendScript JSX
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Automatically rig shapes, generate sequenced grids, build kinetic typography animators,
            and construct multi-layer templates with master null controllers in After Effects.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Rigging & Layout Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {RIGGING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200 shadow-sm'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Quick Configurator */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-3.5 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Quick Rig Parameters:
        </span>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Grid:</span>
          <select
            value={`${rows}x${cols}`}
            onChange={(e) => {
              const [r, c] = e.target.value.split('x').map(Number);
              setRows(r);
              setCols(c);
              setPrompt(`Create a ${r}x${c} grid of shape layers that scale up sequentially with ${staggerFrames} frames stagger.`);
            }}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono text-xs focus:outline-none"
          >
            <option value="2x2">2x2 Grid (4 cells)</option>
            <option value="3x3">3x3 Grid (9 cells)</option>
            <option value="4x4">4x4 Grid (16 cells)</option>
            <option value="5x3">5x3 Grid (15 cells)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Stagger:</span>
          <input
            type="number"
            min={1}
            max={30}
            value={staggerFrames}
            onChange={(e) => {
              const val = Number(e.target.value);
              setStaggerFrames(val);
              setPrompt(`Create a ${rows}x${cols} grid of shape layers that scale up sequentially with ${val} frames stagger.`);
            }}
            className="w-14 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono text-xs text-center focus:outline-none"
          />
          <span className="text-zinc-500 font-mono">frames</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setPrompt(`Create a ${rows}x${cols} grid of shape layers that scale up sequentially with ${staggerFrames} frames stagger.`);
          }}
          className="ml-auto text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline"
        >
          Sync to prompt
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">
            ExtendScript Rigging Brief:
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            Generates pure ExtendScript (.jsx) with Undo Groups
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Describe your rig (e.g. Create a 3x3 grid of shape layers that scale up sequentially...)"
          className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500 placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Output runs via AE File &gt; Scripts &gt; Run Script File or CEP bridge.
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
              <span>Load Preset JSX</span>
            </button>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Rig...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Auto-Rig Script</span>
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
            ExtendScript Output (JSX)
          </span>
        </div>

        <CodeBlock
          code={activeResult || selectedPreset.defaultCode || ''}
          title="ExtendScript Rig Script"
          filename="ae_auto_rig.jsx"
          onApply={(code) => onApplyToComp(code)}
        />
      </div>
    </div>
  );
};
