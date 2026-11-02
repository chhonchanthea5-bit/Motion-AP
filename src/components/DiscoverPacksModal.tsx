import React from 'react';
import { X, Download, Check, Sparkles, FolderDown, Zap, Layers, Play } from 'lucide-react';
import { CEP_EXTENSION_TEMPLATE } from '../constants/systemPrompt';

interface DiscoverPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoverPacksModal: React.FC<DiscoverPacksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const packs = [
    {
      id: 'essential-titles',
      title: 'Essential Titles & Typography Pack',
      count: '48 Presets',
      badge: 'Free Included',
      desc: 'Cinematic titles, deformation typography, speech bubbles, bullet lists, and lower-thirds with responsive bounding boxes.',
      color: '#38bdf8',
    },
    {
      id: 'motion-presets-pack',
      title: 'Kinetic Motion & Inertial Spring Pack',
      count: '64 Presets',
      badge: 'Core Engine',
      desc: 'Inertial bounce, dampening decay, smooth looping wiggles, and velocity-reactive physics expressions.',
      color: '#6366f1',
    },
    {
      id: 'transitions-pack',
      title: 'Seamless Transitions & FX Pack',
      count: '32 Presets',
      badge: 'Popular',
      desc: '2D shape wipes, light leak sweeps, camera zooms, and chromatic glitch transitions.',
      color: '#f59e0b',
    },
    {
      id: 'procedural-rigs',
      title: 'ExtendScript Auto-Rig Matrix Pack',
      count: '24 Scripts',
      badge: 'Pro TD',
      desc: 'Automated 3x3 grids, radial cloner arrays, layer staggering utilities, and master null controllers.',
      color: '#10b981',
    },
  ];

  const handleDownloadCEP = () => {
    const fullZipScript = `// AE Master / Animation Composer CEP Extension Installer
// 1. Unzip to:
// macOS: /Library/Application Support/Adobe/CEP/extensions/com.aemaster.mograph.plugin
// Windows: C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\com.aemaster.mograph.plugin

${CEP_EXTENSION_TEMPLATE.hostScriptJsx}
`;
    const blob = new Blob([fullZipScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AEMaster_AnimationComposer_CEP_Extension.jsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#141416] border border-zinc-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#26262a] bg-[#18181c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Discover Motion Graphics Packs</h2>
              <p className="text-[11px] text-zinc-400">Expand your After Effects library with modular preset packs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Packs Grid */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-[#1a1a1e] border border-[#2e2e34] hover:border-zinc-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${pack.color}15`,
                    borderColor: `${pack.color}40`,
                    color: pack.color,
                  }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white font-sans">{pack.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {pack.count}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">{pack.desc}</p>
                </div>
              </div>

              <button
                onClick={handleDownloadCEP}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Installed</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#26262a] bg-[#18181c] flex items-center justify-between text-xs">
          <span className="text-zinc-500 text-[11px]">All packs are powered by ExtendScript & Modern JS engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
