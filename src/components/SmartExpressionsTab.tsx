import React, { useState } from 'react';
import { Sparkles, Play, Copy, ArrowRight, Wand2, Sliders, Check, RefreshCw } from 'lucide-react';
import { ExpressionProperty, PresetItem } from '../types';
import { EXPRESSION_PRESETS } from '../constants/presets';
import { CodeBlock } from './CodeBlock';

interface SmartExpressionsTabProps {
  onApplyToComp: (code: string, prop: ExpressionProperty) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, category: string, property: ExpressionProperty) => Promise<string | void>;
  activeResult: string;
}

export const SmartExpressionsTab: React.FC<SmartExpressionsTabProps> = ({
  onApplyToComp,
  isGenerating,
  onGenerate,
  activeResult,
}) => {
  const [prompt, setPrompt] = useState(
    'Give me a bouncy scale expression that reacts to a slider control, but stops bouncing after 2 seconds.'
  );
  const [targetProperty, setTargetProperty] = useState<ExpressionProperty>('Scale');
  const [selectedPreset, setSelectedPreset] = useState<PresetItem>(EXPRESSION_PRESETS[0]);
  const [autoCopy, setAutoCopy] = useState(true);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    const res = await onGenerate(prompt, 'Smart Expression Generation', targetProperty);
    if (res && autoCopy) {
      try {
        await navigator.clipboard.writeText(res);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPreset(preset);
    setPrompt(preset.prompt);
    if (preset.targetProperty) {
      setTargetProperty(preset.targetProperty);
    }
    if (preset.defaultCode) {
      onApplyToComp(preset.defaultCode, preset.targetProperty || 'Scale');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900/60 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Smart Expression Engine</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Modern JS ES6
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Generate high-performance After Effects expressions for looping, dynamic easing, inertial bounce,
            decay curves, text counters, and bounding boxes.
          </p>
        </div>

        {/* Auto-copy switch */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200 select-none bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
          <input
            type="checkbox"
            checked={autoCopy}
            onChange={(e) => setAutoCopy(e.target.checked)}
            className="w-3.5 h-3.5 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-[11px] font-medium">Auto-copy generated code</span>
        </label>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Curated Expression Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {EXPRESSION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{preset.title}</span>
              {preset.targetProperty && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {preset.targetProperty}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Input Formulation Card */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Target Property Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium">Target Property:</span>
            <select
              value={targetProperty}
              onChange={(e) => setTargetProperty(e.target.value as ExpressionProperty)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="Scale">Scale (2D / 3D)</option>
              <option value="Position">Position (2D / 3D)</option>
              <option value="Opacity">Opacity (%)</option>
              <option value="Rotation">Rotation (°)</option>
              <option value="Source Text">Source Text (Typography)</option>
              <option value="Path">Shape Path / Size</option>
              <option value="Color">Fill / Stroke Color</option>
              <option value="Slider Control">Slider / Point Control</option>
            </select>
          </div>

          <div className="text-[11px] text-zinc-500 font-mono">
            Powered by Gemini 3.8 Flash
          </div>
        </div>

        {/* Prompt Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Describe the desired motion behavior, easing curve, slider connections, or math formula..."
            className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Tip: Press Generate to query the TD model or load any curated preset.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedPreset.defaultCode) {
                  onApplyToComp(selectedPreset.defaultCode, targetProperty);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-zinc-400" />
              <span>Use Curated Preset</span>
            </button>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Expression</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Code Result Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            Generated Expression Output
          </span>
        </div>

        <CodeBlock
          code={activeResult || selectedPreset.defaultCode || ''}
          title={`AE Expression [${targetProperty}]`}
          targetProperty={targetProperty}
          filename={`${targetProperty.toLowerCase().replace(/\s+/g, '_')}_expression.jsx`}
          onApply={(code) => onApplyToComp(code, targetProperty)}
        />
      </div>
    </div>
  );
};
