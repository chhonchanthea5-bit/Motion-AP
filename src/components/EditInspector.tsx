import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Download,
  Sliders,
  Type,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { ComposerPreset } from '../types';
import { CodeBlock } from './CodeBlock';

interface EditInspectorProps {
  preset: ComposerPreset | null;
  onApply: (preset: ComposerPreset) => void;
  onUpdatePresetText: (id: string, newText: string) => void;
  onSwitchToAIStudio: (promptText: string) => void;
}

export const EditInspector: React.FC<EditInspectorProps> = ({
  preset,
  onApply,
  onUpdatePresetText,
  onSwitchToAIStudio,
}) => {
  if (!preset) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <Sliders className="w-10 h-10 mb-3 text-zinc-600" />
        <h3 className="text-sm font-semibold text-zinc-300">No Preset Selected for Editing</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Select any preset from the Browse tab to customize its typography, animation duration,
          overshoot physics, and expression code.
        </p>
      </div>
    );
  }

  const [customText, setCustomText] = useState(preset.displayText || preset.title);
  const [inDuration, setInDuration] = useState(0.8);
  const [overshoot, setOvershoot] = useState(35);
  const [speedRatio, setSpeedRatio] = useState(1.0);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApply(preset);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleTextChange = (val: string) => {
    setCustomText(val);
    onUpdatePresetText(preset.id, val);
  };

  const codeToShow = preset.expressionCode || preset.extendScriptCode || '';

  return (
    <div className="flex-1 flex flex-col bg-[#141416] overflow-y-auto p-4 sm:p-6 text-xs text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#26262a] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {preset.folderCategory}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 capitalize">
              Type: {preset.type}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 tracking-tight">{preset.title}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{preset.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchToAIStudio(`Customize ${preset.title}: modify easing dynamics, add slider controls, or convert to ExtendScript.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 font-medium transition-colors"
            title="Send to Gemini AI for custom variations"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Customize</span>
          </button>

          <button
            onClick={handleApply}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-semibold text-white shadow-md transition-all active:scale-95 ${
              applied ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied to AE Comp!</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Apply to Selected Layer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Left: Typography & Content Editor */}
        <div className="bg-[#18181c] border border-[#26262a] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              Typography & Content
            </span>
            <button
              onClick={() => handleTextChange(preset.displayText || preset.title)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Text
            </button>
          </div>

          <textarea
            value={customText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={3}
            placeholder="Type your custom title / typography..."
            className="w-full bg-[#0d0d0f] border border-[#333336] rounded p-2.5 text-xs text-zinc-100 font-sans focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />

          <div className="text-[11px] text-zinc-500">
            Updating this text immediately re-renders the live preview on the comp stage.
          </div>
        </div>

        {/* Right: Keyframe Physics & Timing */}
        <div className="bg-[#18181c] border border-[#26262a] rounded-lg p-4 flex flex-col gap-3.5">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Animation Parameters & Physics
          </span>

          {/* In Duration */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">IN Transition Duration</span>
              <span className="font-mono text-zinc-200">{inDuration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.05}
              value={inDuration}
              onChange={(e) => setInDuration(parseFloat(e.target.value))}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Overshoot % */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Inertial Overshoot Bounce</span>
              <span className="font-mono text-indigo-300">{overshoot}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={overshoot}
              onChange={(e) => setOvershoot(parseInt(e.target.value))}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Speed Scale */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Playback Speed Multiplier</span>
              <span className="font-mono text-amber-300">{speedRatio.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={speedRatio}
              onChange={(e) => setSpeedRatio(parseFloat(e.target.value))}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          Underlying Expression & ExtendScript Source
        </span>

        <CodeBlock
          code={codeToShow}
          title={`${preset.title} [${preset.type === 'extendscript' ? 'JSX Script' : 'Modern Expression'}]`}
          targetProperty={preset.targetProperty}
          filename={`${preset.id}.jsx`}
          onApply={() => handleApply()}
        />
      </div>
    </div>
  );
};
