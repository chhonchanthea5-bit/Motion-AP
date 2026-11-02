import React from 'react';
import { Sparkles, Layers, Clock, Compass, Bug, Terminal, Cpu } from 'lucide-react';
import { CommandTab } from '../types';

interface TabNavigationProps {
  activeTab: CommandTab;
  setActiveTab: (tab: CommandTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: CommandTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'expressions',
      label: 'Smart Expressions',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      badge: 'fx',
    },
    {
      id: 'rigging',
      label: 'Auto-Rig & Layouts',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      badge: 'JSX',
    },
    {
      id: 'timeline',
      label: 'Timeline & Layers',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      badge: 'Seq',
    },
    {
      id: 'math',
      label: 'Math & Geometry',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      badge: 'Trig',
    },
    {
      id: 'troubleshooter',
      label: 'Troubleshooter',
      icon: <Bug className="w-4 h-4 text-rose-400" />,
      badge: 'Fix',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800/80 bg-[#121215] px-4 py-2 select-none no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-zinc-800/90 text-white border-zinc-700 shadow-md shadow-black/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
