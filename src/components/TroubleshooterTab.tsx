import React, { useState } from 'react';
import { AlertTriangle, Wand2, CheckCircle2, Bug, Play, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { ERROR_DIAGNOSTICS_PRESETS } from '../constants/presets';
import { CodeBlock } from './CodeBlock';

interface TroubleshooterTabProps {
  onApplyToComp: (code: string) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, category: string, property?: string, contextCode?: string) => Promise<string | void>;
  activeResult: string;
}

export const TroubleshooterTab: React.FC<TroubleshooterTabProps> = ({
  onApplyToComp,
  isGenerating,
  onGenerate,
  activeResult,
}) => {
  const [errorMessage, setErrorMessage] = useState(
    'Why is my expression throwing a "property is missing or does not exist" error?'
  );
  const [brokenCode, setBrokenCode] = useState(
    `// Broken expression throwing error:
const box = thisComp.layer("BoundingBox");
const t = box.transform.position.value;
const pad = effect("Padding")(1);
[t[0] + pad, t[1] + pad];`
  );
  const [selectedErrorPreset, setSelectedErrorPreset] = useState(ERROR_DIAGNOSTICS_PRESETS[0]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!errorMessage.trim() || isGenerating) return;

    const fullPrompt = `AE Error Question / Symptom:\n${errorMessage}\n\nPlease diagnose why this After Effects expression or ExtendScript throws an error, identify the root cause according to the Modern JavaScript expression engine, and provide a fully corrected, hardened version with defensive coding.`;

    await onGenerate(fullPrompt, 'AE Expression & Script Troubleshooting', undefined, brokenCode);
  };

  const handleSelectPreset = (preset: typeof ERROR_DIAGNOSTICS_PRESETS[0]) => {
    setSelectedErrorPreset(preset);
    setErrorMessage(preset.solutionPrompt);
    setBrokenCode(preset.brokenCode);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900/60 border border-rose-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Bug className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">AE Expression Doctor & Troubleshooter</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              Diagnostics & Fix
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Diagnose yellow/orange warning banners in After Effects, fix missing property references,
            resolve NaN/division crashes, and modernize legacy syntax.
          </p>
        </div>
      </div>

      {/* Preset Common Errors */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Common After Effects Error Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {ERROR_DIAGNOSTICS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 ${
                selectedErrorPreset.id === preset.id
                  ? 'bg-rose-600/20 border-rose-500 text-rose-200 shadow-sm'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostic Inputs Form */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
        {/* Error Message Input */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Error Message / Problem Description:
          </label>
          <input
            type="text"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder='E.g. Why is my expression throwing a "property is missing or does not exist" error?'
            className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Broken Code Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Paste Broken Expression / Script Code:
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              Optional but recommended for precise fix
            </span>
          </div>
          <textarea
            value={brokenCode}
            onChange={(e) => setBrokenCode(e.target.value)}
            rows={4}
            placeholder="// Paste your expression that generates an error..."
            className="w-full bg-[#0d0d0f] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-rose-500 placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Gemini inspects AST, property names, and runtime exceptions.
          </span>

          <button
            type="submit"
            disabled={isGenerating || !errorMessage.trim()}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shadow-rose-600/30 flex items-center gap-2 active:scale-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Diagnosing Bug...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Diagnose & Fix Error</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Diagnosis & Corrected Output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Diagnosis & Corrected Code
          </span>
        </div>

        <CodeBlock
          code={
            activeResult ||
            `// AE Master: Defensive Fixed Expression
// Fixes "Property is missing or does not exist"
// Uses defensive try-catch and existence checks for layer and effects

function getSafeLayer(name) {
  try {
    return thisComp.layer(name);
  } catch (e) {
    return null;
  }
}

function getSafeSlider(layer, effectName, defaultVal) {
  try {
    if (layer && layer.effect(effectName)) {
      return layer.effect(effectName)(1).value;
    }
  } catch (e) {}
  return defaultVal;
}

const boxLayer = getSafeLayer("BoundingBox");
const defaultPos = [thisComp.width / 2, thisComp.height / 2];

if (boxLayer) {
  const t = boxLayer.transform.position.value;
  const pad = getSafeSlider(thisLayer, "Padding", 20);
  [t[0] + pad, t[1] + pad];
} else {
  // Graceful fallback prevents yellow error banner
  defaultPos;
}`
          }
          title="Diagnostic Fix & Hardened Code"
          filename="ae_fixed_expression.jsx"
          onApply={(code) => onApplyToComp(code)}
        />
      </div>
    </div>
  );
};
