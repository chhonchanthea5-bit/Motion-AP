import React, { useState } from 'react';
import {
  Menu,
  Sliders,
  Sparkles,
  Download,
  User,
  Settings,
  FolderDown,
  Info,
  Check,
  Zap,
  Layers,
  Wand2
} from 'lucide-react';
import { MainViewTab } from '../types';

interface ComposerHeaderProps {
  currentTab: MainViewTab;
  onSelectTab: (tab: MainViewTab) => void;
  onOpenSystemPrompt: () => void;
  onOpenDiscoverPacks: () => void;
  activePresetName?: string;
}

export const ComposerHeader: React.FC<ComposerHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSystemPrompt,
  onOpenDiscoverPacks,
  activePresetName,
}) => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);

  return (
    <header className="h-12 bg-[#171719] border-b border-[#26262a] px-3 sm:px-4 flex items-center justify-between select-none">
      {/* Left: Brand & Main Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Brand Menu matching screenshot: "Animation Composer ≡" */}
        <div className="relative">
          <button
            onClick={() => setShowMainMenu(!showMainMenu)}
            className="flex items-center gap-1.5 text-zinc-100 hover:text-white transition-colors group"
          >
            <span className="font-bold text-sm tracking-tight font-sans">Animation Composer</span>
            <Menu className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
          </button>

          {showMainMenu && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1e] border border-zinc-700/80 rounded-lg shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                AE Master Plugin
              </div>
              <button
                onClick={() => {
                  onOpenSystemPrompt();
                  setShowMainMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-200 hover:bg-zinc-700/60 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Google AI Studio Prompt</span>
              </button>
              <button
                onClick={() => {
                  onOpenDiscoverPacks();
                  setShowMainMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-200 hover:bg-zinc-700/60 flex items-center gap-2"
              >
                <FolderDown className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export CEP Extension</span>
              </button>
              <div className="border-t border-zinc-800 my-1" />
              <div className="px-3 py-1 text-[11px] text-zinc-400 font-mono">
                Host: Adobe After Effects 2026
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs matching screenshot: Browse, Edit ≡, AI TD Studio */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs h-12">
          {/* Browse Tab */}
          <button
            onClick={() => onSelectTab('browse')}
            className={`h-full flex items-center font-medium transition-colors relative ${
              currentTab === 'browse'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Browse</span>
            {currentTab === 'browse' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
            )}
          </button>

          {/* Edit ≡ Tab */}
          <button
            onClick={() => onSelectTab('edit')}
            className={`h-full flex items-center gap-1 font-medium transition-colors relative ${
              currentTab === 'edit'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Edit</span>
            <Menu className="w-3 h-3 text-zinc-400" />
            {currentTab === 'edit' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
            )}
          </button>

          {/* AI Studio TD Tab */}
          <button
            onClick={() => onSelectTab('ai-studio')}
            className={`h-full flex items-center gap-1.5 font-medium transition-colors relative ${
              currentTab === 'ai-studio'
                ? 'text-indigo-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI TD Studio</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono hidden sm:inline">
              Gemini
            </span>
            {currentTab === 'ai-studio' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Right: Tools, Discover Packs button, and Profile Icon */}
      <div className="flex items-center gap-3">
        {/* Tools Menu */}
        <div className="relative">
          <button
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            className="text-zinc-300 hover:text-white text-xs font-medium transition-colors px-2 py-1"
          >
            Tools
          </button>

          {showToolsMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1e] border border-zinc-700/80 rounded-lg shadow-2xl py-1 z-50 text-xs">
              <button
                onClick={() => {
                  onOpenSystemPrompt();
                  setShowToolsMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-200 hover:bg-zinc-700/60 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Studio System Prompt</span>
              </button>
              <button
                onClick={() => {
                  onOpenDiscoverPacks();
                  setShowToolsMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-200 hover:bg-zinc-700/60 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CEP Panel ZIP</span>
              </button>
            </div>
          )}
        </div>

        {/* Discover Packs Blue Pill Button matching screenshot */}
        <button
          onClick={onOpenDiscoverPacks}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Zap className="w-3 h-3 fill-white" />
          <span>Discover Packs</span>
        </button>

        {/* User Profile Avatar Icon matching screenshot */}
        <div
          onClick={onOpenSystemPrompt}
          className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer transition-colors"
          title="Motion Designer Profile & TD Status"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
