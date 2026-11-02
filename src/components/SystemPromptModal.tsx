import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Download, Folder, Code, Terminal, ExternalLink } from 'lucide-react';
import { OFFICIAL_SYSTEM_PROMPT, CEP_EXTENSION_TEMPLATE } from '../constants/systemPrompt';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'cep' | 'scriptui'>('prompt');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_SYSTEM_PROMPT);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySnippet = async (content: string, name: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(name);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121215] border border-zinc-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 bg-[#161619] flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Google AI Studio System Prompt & Plugin Package
              </h2>
              <p className="text-[11px] text-zinc-400">
                Production-ready configuration for Google AI Studio & After Effects Panel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="px-5 pt-3 border-b border-zinc-800/80 bg-[#141417] flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            System Prompt (AI Studio)
          </button>

          <button
            onClick={() => setActiveTab('cep')}
            className={`pb-2.5 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cep'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-cyan-400" />
            CEP Extension Files (manifest.xml & JSX)
          </button>

          <button
            onClick={() => setActiveTab('scriptui')}
            className={`pb-2.5 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'scriptui'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            Standalone ScriptUI (.jsx)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {activeTab === 'prompt' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-semibold">
                  System Instructions for Google AI Studio:
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    copiedPrompt
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50'
                  }`}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy System Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#0b0b0d] border border-zinc-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap select-text">
                {OFFICIAL_SYSTEM_PROMPT}
              </div>

              <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 text-[11px] text-indigo-200 flex flex-col gap-1">
                <strong>How to use in Google AI Studio:</strong>
                <span>1. Open Google AI Studio (aistudio.google.com).</span>
                <span>2. Create a new prompt and click the "System Instructions" accordion.</span>
                <span>3. Paste the prompt above. Select model <strong>Gemini 3.8 Flash</strong>.</span>
                <span>4. You can now prompt expressions, rigging scripts, and AE troubleshooting with 100% accuracy.</span>
              </div>
            </div>
          )}

          {activeTab === 'cep' && (
            <div className="flex flex-col gap-4">
              <div className="text-zinc-400 text-xs">
                Adobe CEP (Common Extensibility Platform) allows this web application to run inside an After Effects floating panel (Window &gt; Extensions &gt; AE Master).
              </div>

              {/* manifest.xml */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-zinc-300 font-semibold">CSXS/manifest.xml</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadFile('manifest.xml', CEP_EXTENSION_TEMPLATE.manifestXml)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button
                      onClick={() => handleCopySnippet(CEP_EXTENSION_TEMPLATE.manifestXml, 'manifest')}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      {copiedFile === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                </div>
                <pre className="bg-[#0b0b0d] p-3 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-400 max-h-36 overflow-auto">
                  {CEP_EXTENSION_TEMPLATE.manifestXml}
                </pre>
              </div>

              {/* hostscript.jsx */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-zinc-300 font-semibold">jsx/hostscript.jsx (AE DOM Bridge)</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadFile('hostscript.jsx', CEP_EXTENSION_TEMPLATE.hostScriptJsx)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button
                      onClick={() => handleCopySnippet(CEP_EXTENSION_TEMPLATE.hostScriptJsx, 'hostscript')}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      {copiedFile === 'hostscript' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                </div>
                <pre className="bg-[#0b0b0d] p-3 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-400 max-h-36 overflow-auto">
                  {CEP_EXTENSION_TEMPLATE.hostScriptJsx}
                </pre>
              </div>

              {/* Install paths */}
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-[11px] text-zinc-400 flex flex-col gap-1">
                <strong>CEP Extension Installation Directory:</strong>
                <code className="text-zinc-200">macOS: /Library/Application Support/Adobe/CEP/extensions/com.aemaster.mograph.plugin</code>
                <code className="text-zinc-200">Windows: C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.aemaster.mograph.plugin</code>
              </div>
            </div>
          )}

          {activeTab === 'scriptui' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-semibold">
                  AEMaster_ScriptUI.jsx (Single-file AE Dockable Palette)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadFile('AEMaster.jsx', CEP_EXTENSION_TEMPLATE.scriptUiWrapper)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download AEMaster.jsx
                  </button>
                </div>
              </div>

              <pre className="bg-[#0b0b0d] p-3 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 max-h-56 overflow-auto">
                {CEP_EXTENSION_TEMPLATE.scriptUiWrapper}
              </pre>

              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-[11px] text-zinc-400 flex flex-col gap-1">
                <strong>ScriptUI Panels Directory:</strong>
                <code className="text-zinc-200">macOS: /Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/</code>
                <code className="text-zinc-200">Windows: C:\Program Files\Adobe\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-[#161619] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
