import React, { useState, useMemo, useCallback } from 'react';
import { ComposerHeader } from './components/ComposerHeader';
import { SidebarTree } from './components/SidebarTree';
import { PresetCard } from './components/PresetCard';
import { EditInspector } from './components/EditInspector';
import { CompViewer } from './components/CompViewer';
import { DiscoverPacksModal } from './components/DiscoverPacksModal';
import { SystemPromptModal } from './components/SystemPromptModal';
import { TabNavigation } from './components/TabNavigation';
import { SmartExpressionsTab } from './components/SmartExpressionsTab';
import { AutoRigTab } from './components/AutoRigTab';
import { TimelineManagerTab } from './components/TimelineManagerTab';
import { MathGeometryTab } from './components/MathGeometryTab';
import { TroubleshooterTab } from './components/TroubleshooterTab';

import { COMPOSER_PRESETS } from './constants/composerPresets';
import {
  ComposerPreset,
  MainViewTab,
  CategoryKey,
  CommandTab,
  ExpressionProperty,
} from './types';
import {
  EXPRESSION_PRESETS,
  RIGGING_PRESETS,
  TIMELINE_PRESETS,
  MATH_PRESETS,
} from './constants/presets';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainViewTab>('browse');
  const [aiSubTab, setAiSubTab] = useState<CommandTab>('expressions');

  // Browse state
  const [presets, setPresets] = useState<ComposerPreset[]>(COMPOSER_PRESETS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('essential-typography');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [gridZoom, setGridZoom] = useState(3); // 2, 3, 4, 5 columns
  const [selectedPreset, setSelectedPreset] = useState<ComposerPreset>(COMPOSER_PRESETS[0]);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(true);

  // Modals
  const [isDiscoverPacksOpen, setIsDiscoverPacksOpen] = useState(false);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  // Comp status
  const [statusMessage, setStatusMessage] = useState('');
  const [activeExpressionCode, setActiveExpressionCode] = useState<string>(
    COMPOSER_PRESETS[0].expressionCode || COMPOSER_PRESETS[0].extendScriptCode || ''
  );
  const [targetProperty, setTargetProperty] = useState<string>('Scale');

  // AI Studio Generation state
  const [aiResults, setAiResults] = useState<Record<CommandTab, string>>({
    expressions: EXPRESSION_PRESETS[0].defaultCode || '',
    rigging: RIGGING_PRESETS[0].defaultCode || '',
    timeline: TIMELINE_PRESETS[0].defaultCode || '',
    math: MATH_PRESETS[0].defaultCode || '',
    troubleshooter: '',
    'system-prompt': '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Toggle favorite on card
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Select card
  const handleSelectPreset = (preset: ComposerPreset) => {
    setSelectedPreset(preset);
    if (preset.expressionCode) {
      setActiveExpressionCode(preset.expressionCode);
    } else if (preset.extendScriptCode) {
      setActiveExpressionCode(preset.extendScriptCode);
    }
    if (preset.targetProperty) {
      setTargetProperty(preset.targetProperty);
    }
  };

  // Apply preset to comp
  const handleApplyPreset = (preset: ComposerPreset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPreset(preset);
    const code = preset.expressionCode || preset.extendScriptCode || '';
    setActiveExpressionCode(code);
    if (preset.targetProperty) setTargetProperty(preset.targetProperty);
    triggerStatus(`Applied "${preset.title}" to AE Layer!`);
  };

  // Update preset custom text from Edit inspector
  const handleUpdatePresetText = (id: string, newText: string) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, displayText: newText } : p))
    );
    if (selectedPreset.id === id) {
      setSelectedPreset((prev) => ({ ...prev, displayText: newText }));
    }
  };

  // Preset Actions handler (from bottom sidebar)
  const handleTriggerAction = (action: string) => {
    if (action === 'apply-in' || action === 'apply-out') {
      handleApplyPreset(selectedPreset);
      triggerStatus(`Applied ${selectedPreset.title} as ${action === 'apply-in' ? 'IN' : 'OUT'} transition`);
    } else if (action === 'export-jsx') {
      const code = selectedPreset.extendScriptCode || selectedPreset.expressionCode || '';
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPreset.id}.jsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerStatus(`Exported ${selectedPreset.id}.jsx`);
    } else if (action === 'copy-expression') {
      const code = selectedPreset.expressionCode || selectedPreset.extendScriptCode || '';
      navigator.clipboard.writeText(code);
      triggerStatus('Copied code to clipboard!');
    }
  };

  // Filter presets based on category, search, and favorites
  const filteredPresets = useMemo(() => {
    return presets.filter((p) => {
      if (showFavoritesOnly && !p.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCategory = p.folderCategory.toLowerCase().includes(q);
        const matchesText = (p.displayText || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesText) return false;
      } else if (selectedCategory !== 'all') {
        if (p.categoryKey !== selectedCategory) return false;
      }
      return true;
    });
  }, [presets, selectedCategory, searchQuery, showFavoritesOnly]);

  // AI Generation
  const handleAIGenerate = useCallback(
    async (
      prompt: string,
      category: string,
      property?: string,
      contextCode?: string
    ): Promise<string | void> => {
      setIsGenerating(true);
      triggerStatus('Gemini synthesizing motion code...');

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            category,
            contextCode,
            aeVersion: 'AE 2026',
          }),
        });
        const data = await response.json();
        if (data.result) {
          let cleanCode = data.result;
          const match = data.result.match(/```(?:javascript|jsx|js)?([\s\S]*?)```/);
          if (match && match[1]) cleanCode = match[1].trim();

          setAiResults((prev) => ({ ...prev, [aiSubTab]: cleanCode }));
          setActiveExpressionCode(cleanCode);
          if (property) setTargetProperty(property);
          triggerStatus('Generated & verified!');
          return cleanCode;
        } else if (data.error) {
          triggerStatus(`Error: ${data.error}`);
        }
      } catch (err: any) {
        console.error(err);
        triggerStatus('Failed to generate.');
      } finally {
        setIsGenerating(false);
      }
    },
    [aiSubTab]
  );

  // Dynamic grid column class based on zoom slider (2 to 5 columns)
  const getGridColsClass = () => {
    switch (gridZoom) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
      case 3:
      default:
        return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';
    }
  };

  return (
    <div className="min-h-screen bg-[#111113] text-zinc-100 flex flex-col font-sans select-none antialiased">
      {/* Top Header matching Animation Composer exactly */}
      <ComposerHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSystemPrompt={() => setIsSystemPromptOpen(true)}
        onOpenDiscoverPacks={() => setIsDiscoverPacksOpen(true)}
        activePresetName={selectedPreset.title}
      />

      {/* Main Workspace Body */}
      {currentTab === 'browse' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Folder Tree matching screenshot */}
          <SidebarTree
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setShowFavoritesOnly(false);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            gridZoom={gridZoom}
            setGridZoom={setGridZoom}
            onTriggerAction={handleTriggerAction}
          />

          {/* Center Main Stage: Visual Presets Cards Grid */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#111113] p-4 sm:p-5">
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#26262a]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">
                  {showFavoritesOnly ? 'Starred Favorites' : selectedCategory.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  ({filteredPresets.length} items)
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {statusMessage && (
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {statusMessage}
                  </span>
                )}

                <button
                  onClick={() => setShowPreviewDrawer(!showPreviewDrawer)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    showPreviewDrawer
                      ? 'border-indigo-500/60 bg-indigo-950/30 text-indigo-300'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {showPreviewDrawer ? 'Hide Comp Preview' : 'Show Comp Preview'}
                </button>
              </div>
            </div>

            {/* Presets Cards Grid */}
            <div className={`grid ${getGridColsClass()} gap-3.5 mb-6`}>
              {filteredPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset.id === preset.id}
                  onSelect={handleSelectPreset}
                  onToggleFavorite={handleToggleFavorite}
                  onApply={handleApplyPreset}
                />
              ))}
            </div>

            {filteredPresets.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500">
                <p className="text-sm font-medium text-zinc-400">No presets found in this category.</p>
                <p className="text-xs text-zinc-600 mt-1">Try clearing your search query or selecting another folder.</p>
              </div>
            )}

            {/* Bottom Live Comp Viewport Preview Drawer */}
            {showPreviewDrawer && (
              <div className="mt-auto pt-4 border-t border-[#26262a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Composition Preview: {selectedPreset.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Virtual After Effects Viewport & Curve Graph
                  </span>
                </div>

                <div className="max-w-4xl mx-auto">
                  <CompViewer
                    activeExpressionCode={activeExpressionCode}
                    targetProperty={targetProperty}
                    customSliders={selectedPreset.sliders}
                    statusMessage={statusMessage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* "Edit ≡" Tab */}
      {currentTab === 'edit' && (
        <div className="flex-1 flex overflow-hidden">
          <EditInspector
            preset={selectedPreset}
            onApply={handleApplyPreset}
            onUpdatePresetText={handleUpdatePresetText}
            onSwitchToAIStudio={(prompt) => {
              setCurrentTab('ai-studio');
              setAiSubTab('expressions');
            }}
          />

          {/* Right Comp Preview in Edit mode */}
          <div className="hidden lg:flex w-[480px] border-l border-[#26262a] bg-[#0e0e10] p-4 flex-col justify-start gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Live Inspector Feedback
            </span>
            <CompViewer
              activeExpressionCode={activeExpressionCode}
              targetProperty={targetProperty}
              customSliders={selectedPreset.sliders}
              statusMessage={statusMessage}
            />
          </div>
        </div>
      )}

      {/* "AI TD Studio" Tab (Gemini Powerhouse Command Center) */}
      {currentTab === 'ai-studio' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Subtabs Bar */}
          <TabNavigation activeTab={aiSubTab} setActiveTab={setAiSubTab} />

          <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 flex flex-col gap-4">
              {aiSubTab === 'expressions' && (
                <SmartExpressionsTab
                  onApplyToComp={(code, prop) => {
                    setActiveExpressionCode(code);
                    if (prop) setTargetProperty(prop);
                    triggerStatus(`Applied to ${prop}`);
                  }}
                  isGenerating={isGenerating}
                  onGenerate={(p, c, pr) => handleAIGenerate(p, c, pr)}
                  activeResult={aiResults.expressions}
                />
              )}

              {aiSubTab === 'rigging' && (
                <AutoRigTab
                  onApplyToComp={(code) => {
                    setActiveExpressionCode(code);
                    triggerStatus('Applied Rig to Comp Simulator');
                  }}
                  isGenerating={isGenerating}
                  onGenerate={(p, c) => handleAIGenerate(p, c)}
                  activeResult={aiResults.rigging}
                />
              )}

              {aiSubTab === 'timeline' && (
                <TimelineManagerTab
                  onApplyToComp={(code) => {
                    setActiveExpressionCode(code);
                    triggerStatus('Applied Timeline Script');
                  }}
                  isGenerating={isGenerating}
                  onGenerate={(p, c) => handleAIGenerate(p, c)}
                  activeResult={aiResults.timeline}
                />
              )}

              {aiSubTab === 'math' && (
                <MathGeometryTab
                  onApplyToComp={(code) => {
                    setActiveExpressionCode(code);
                    triggerStatus('Applied Math Expression');
                  }}
                  isGenerating={isGenerating}
                  onGenerate={(p, c) => handleAIGenerate(p, c)}
                  activeResult={aiResults.math}
                />
              )}

              {aiSubTab === 'troubleshooter' && (
                <TroubleshooterTab
                  onApplyToComp={(code) => {
                    setActiveExpressionCode(code);
                    triggerStatus('Applied Fixed Code');
                  }}
                  isGenerating={isGenerating}
                  onGenerate={(p, c, pr, ctx) => handleAIGenerate(p, c, pr, ctx)}
                  activeResult={aiResults.troubleshooter}
                />
              )}
            </div>

            <div className="lg:col-span-5 sticky top-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Simulator & Curve Graph
              </span>
              <CompViewer
                activeExpressionCode={activeExpressionCode}
                targetProperty={targetProperty}
                statusMessage={statusMessage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <DiscoverPacksModal
        isOpen={isDiscoverPacksOpen}
        onClose={() => setIsDiscoverPacksOpen(false)}
      />

      <SystemPromptModal
        isOpen={isSystemPromptOpen}
        onClose={() => setIsSystemPromptOpen(false)}
      />
    </div>
  );
}
