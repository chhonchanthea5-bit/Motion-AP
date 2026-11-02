import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Search,
  Star,
  Sliders,
  MoreVertical,
  PlusCircle,
  FileCode,
  Download,
  Copy
} from 'lucide-react';
import { CategoryKey } from '../types';

interface SidebarTreeProps {
  selectedCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (fav: boolean) => void;
  gridZoom: number;
  setGridZoom: (val: number) => void;
  onTriggerAction: (action: string) => void;
}

interface TreeNode {
  id: string;
  label: string;
  categoryKey?: CategoryKey;
  children?: TreeNode[];
  defaultOpen?: boolean;
}

export const SidebarTree: React.FC<SidebarTreeProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  gridZoom,
  setGridZoom,
  onTriggerAction,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'anim-presets': true,
    'titles-typography': true,
    'transitions': true,
    'graphic-components': true,
  });

  const [showPresetActions, setShowPresetActions] = useState(false);

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const treeData: TreeNode[] = [
    {
      id: 'anim-presets',
      label: 'Animation Presets',
      children: [
        { id: 'motion-presets', label: 'Motion Presets', categoryKey: 'motion-presets' },
        { id: 'text-presets', label: 'Text Presets', categoryKey: 'text-presets' },
      ],
    },
    {
      id: 'titles-typography',
      label: 'Titles & Typography',
      children: [
        { id: '3d-titles', label: '3D Titles', categoryKey: '3d-titles' },
        { id: 'cinematic-titles', label: 'Cinematic Titles', categoryKey: 'cinematic-titles' },
        { id: 'essential-typography', label: 'Essential Typography', categoryKey: 'essential-typography' },
        { id: 'social-media', label: 'Social Media', categoryKey: 'social-media' },
        { id: 'timers-counters', label: 'Timers & Counters', categoryKey: 'timers-counters' },
      ],
    },
    {
      id: 'transitions',
      label: 'Transitions',
      children: [
        { id: '2d-special-effects', label: '2D Special Effects', categoryKey: '2d-special-effects' },
        { id: 'camera', label: 'Camera', categoryKey: 'camera' },
        { id: 'glitch', label: 'Glitch', categoryKey: 'glitch' },
        { id: 'hand-drawn', label: 'Hand Drawn', categoryKey: 'hand-drawn' },
        { id: 'light-leaks', label: 'Light Leaks', categoryKey: 'light-leaks' },
        { id: 'matte-transitions', label: 'Matte Transitions', categoryKey: 'matte-transitions' },
        { id: 'shapes', label: 'Shapes', categoryKey: 'shapes' },
      ],
    },
    {
      id: 'graphic-components',
      label: 'Graphic Components',
      children: [
        { id: 'auto-rigs', label: 'Auto-Rigs & Layouts', categoryKey: 'auto-rigs' },
      ],
    },
  ];

  return (
    <div className="w-64 lg:w-72 bg-[#171719] border-r border-[#26262a] flex flex-col h-full select-none text-xs">
      {/* Search & Favorites Bar matching screenshot */}
      <div className="p-2 border-b border-[#26262a]">
        <div className="flex items-center gap-1.5 bg-[#0e0e10] border border-[#333336] rounded px-2 py-1">
          {/* Star Filter Button */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-0.5 rounded transition-colors ${
              showFavoritesOnly ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Show only favorites"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Search Icon & Input */}
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presets..."
            className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder:text-zinc-600 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-500 hover:text-zinc-300 text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tree View Folder List */}
      <div className="flex-1 overflow-y-auto py-1 px-1 custom-tree-scrollbar font-sans">
        {/* All Items root option */}
        <div
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer mb-0.5 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#2a2a2e] text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate">All Presets ({showFavoritesOnly ? 'Favorites' : 'Catalog'})</span>
        </div>

        {treeData.map((group) => {
          const isOpen = openFolders[group.id];

          return (
            <div key={group.id} className="flex flex-col">
              {/* Group Root (e.g. Titles & Typography) */}
              <div
                onClick={(e) => toggleFolder(group.id, e)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-zinc-300 hover:text-white hover:bg-[#202024] transition-colors"
              >
                <span className="text-zinc-500 text-[10px]">
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </span>
                <span className="font-medium truncate">{group.label}</span>
              </div>

              {/* Children Subfolders */}
              {isOpen && group.children && (
                <div className="flex flex-col pl-4">
                  {group.children.map((child) => {
                    const isSelected = selectedCategory === child.categoryKey;

                    return (
                      <div
                        key={child.id}
                        onClick={() => {
                          if (child.categoryKey) onSelectCategory(child.categoryKey);
                        }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer my-[1px] transition-colors ${
                          isSelected
                            ? 'bg-[#2e2e34] text-white font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
                        }`}
                      >
                        <span className="text-zinc-600 text-[10px]">
                          <ChevronRight className="w-3 h-3" />
                        </span>
                        <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="truncate">{child.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar: "Preset Actions ∨" & Grid Size Zoom Slider */}
      <div className="h-10 bg-[#141416] border-t border-[#26262a] px-3 flex items-center justify-between text-xs relative">
        {/* Preset Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresetActions(!showPresetActions)}
            className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors text-[11px] font-medium"
          >
            <span>Preset Actions</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showPresetActions && (
            <div className="absolute bottom-full left-0 mb-1 w-48 bg-[#18181c] border border-zinc-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
              <button
                onClick={() => {
                  onTriggerAction('apply-in');
                  setShowPresetActions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-300 hover:bg-zinc-700/60 hover:text-white"
              >
                Apply as IN Animation
              </button>
              <button
                onClick={() => {
                  onTriggerAction('apply-out');
                  setShowPresetActions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-300 hover:bg-zinc-700/60 hover:text-white"
              >
                Apply as OUT Animation
              </button>
              <button
                onClick={() => {
                  onTriggerAction('export-jsx');
                  setShowPresetActions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-300 hover:bg-zinc-700/60 hover:text-white"
              >
                Export Selected as JSX
              </button>
              <button
                onClick={() => {
                  onTriggerAction('copy-expression');
                  setShowPresetActions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-300 hover:bg-zinc-700/60 hover:text-white"
              >
                Copy Modern Expression
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Size Zoom Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={gridZoom}
            onChange={(e) => setGridZoom(Number(e.target.value))}
            className="w-20 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-400"
            title="Adjust thumbnail grid columns"
          />
        </div>
      </div>
    </div>
  );
};
