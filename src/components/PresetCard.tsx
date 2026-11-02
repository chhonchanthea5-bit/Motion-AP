import React, { useState } from 'react';
import { Film, Star, Play, Check, Sliders, Copy, Bell, Terminal, Eye, Volume2, Camera, Zap, Radio, Sun, Compass } from 'lucide-react';
import { ComposerPreset } from '../types';

interface PresetCardProps {
  preset: ComposerPreset;
  isSelected: boolean;
  onSelect: (preset: ComposerPreset) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onApply: (preset: ComposerPreset, e: React.MouseEvent) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  isSelected,
  onSelect,
  onToggleFavorite,
  onApply,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(preset, e);
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 1500);
  };

  // Render authentic visual graphics matching the Animation Composer screenshot
  const renderVisualContent = () => {
    switch (preset.thumbnailType) {
      // 1. Existing screenshot cards:
      case 'deformation-title':
        return (
          <div className="flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-105">
            <span className="text-[10px] tracking-widest text-amber-300/80 font-mono">The</span>
            <span className="text-sm sm:text-base font-black tracking-tight text-cyan-300 font-sans leading-none uppercase drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
              NEVERENDING
            </span>
            <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase leading-tight">
              MOVIE
            </span>
          </div>
        );

      case 'basic-title-left':
        return (
          <div className="flex items-center gap-2 select-none px-4 transition-transform duration-300 group-hover:translate-x-1">
            <div className="w-[3px] h-10 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <div className="flex flex-col text-left font-sans">
              <span className="text-xs text-white font-medium leading-tight">May the</span>
              <span className="text-sm font-bold text-white tracking-wide leading-tight">Horse</span>
              <span className="text-[11px] text-zinc-300 font-light leading-tight">be with you</span>
            </div>
          </div>
        );

      case 'creative-title':
        return (
          <div className="flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-105">
            <span className="text-sm sm:text-base font-black tracking-wider text-white uppercase transform -rotate-1 font-serif">
              FANTASTIC
            </span>
            <span className="text-[8px] tracking-widest text-amber-400 uppercase font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40">
              TYPOGRAPHY PACK
            </span>
          </div>
        );

      case 'text-bubble':
        return (
          <div className="relative border border-amber-500/80 rounded-lg p-2.5 max-w-[210px] text-left select-none transition-transform duration-300 group-hover:scale-105 bg-black/40">
            <p className="text-[9px] text-amber-200/90 leading-tight font-sans">
              My mother always said,
              <br />
              the key is to easy ease
              <br />
              <span className="text-amber-400 font-semibold">keyframes</span> and use the right
              <br />
              woosh for the right thing.
            </p>
            <div className="absolute -bottom-1.5 left-4 w-2 h-2 border-r border-b border-amber-500 rotate-45 bg-[#0e0e0f]" />
          </div>
        );

      case 'two-line-title':
        return (
          <div className="flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-110">
            <span className="text-[11px] font-black tracking-widest text-zinc-300 uppercase leading-none italic font-mono">
              STAR
            </span>
            <span className="text-base sm:text-lg font-black tracking-tighter text-white uppercase leading-none italic">
              HORSE
            </span>
          </div>
        );

      case 'outline-badge':
        return (
          <div className="border border-amber-500/70 rounded px-3 py-1.5 flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-105">
            <span className="text-[10px] font-extrabold tracking-wider text-white uppercase font-sans">
              MOTION GRAPHICS
            </span>
            <span className="text-[7px] tracking-widest text-amber-400 font-bold uppercase mt-0.5 border-t border-amber-500/40 pt-0.5 w-full">
              WITHOUT HASSLE
            </span>
          </div>
        );

      case 'atypical-title':
        return (
          <div className="flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-105">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-serif italic">
              stunning
            </span>
            <span className="text-amber-400 text-[10px] leading-none tracking-widest">★ ★ ★</span>
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-sans mt-0.5">
              Simplicity
            </span>
          </div>
        );

      case 'bullet-list':
        return (
          <div className="flex flex-col gap-1 text-left text-[8px] font-sans font-bold select-none px-2 max-w-[200px] transition-transform duration-300 group-hover:translate-x-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="bg-white text-black px-1 py-0.2 rounded-sm uppercase tracking-wide">
                LIFE IS LIKE A KEYFRAME
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="bg-zinc-800 text-white px-1 py-0.2 rounded-sm uppercase">
                IT'S LINEAR BY DEFAULT
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-zinc-300">AND IT'S UP TO</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-amber-300">YOU HOW TO EASE IT</span>
            </div>
          </div>
        );

      case 'light-mask':
        return (
          <div className="flex flex-col items-center justify-center text-center select-none transition-transform duration-300 group-hover:scale-105">
            <span className="text-xs sm:text-sm font-serif tracking-widest text-white uppercase font-semibold">
              MASTER <span className="text-[9px] font-sans tracking-normal font-normal text-zinc-400">OF THE</span>
            </span>
            <span className="text-sm sm:text-base font-serif tracking-widest text-zinc-200 uppercase font-bold">
              STABLES
            </span>
          </div>
        );

      // 2. Motion Presets:
      case 'bounce-scale':
        return (
          <div className="flex flex-col items-center justify-center select-none">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/60 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-125 transition-transform duration-300">
              <span className="text-indigo-300 font-mono text-xs font-bold">100%</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 mt-1">Inertial Spring</span>
          </div>
        );

      case 'wiggle-loop':
        return (
          <div className="flex flex-col items-center justify-center select-none">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400/60 bg-emerald-500/20 flex items-center justify-center animate-pulse">
              <Radio className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">Looping Wiggle</span>
          </div>
        );

      // 3. Text Presets:
      case 'typewriter-terminal':
        return (
          <div className="bg-[#0b0b0e] border border-green-500/40 rounded px-3 py-2 font-mono text-xs text-green-400 select-none shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-green-500" />
            <span>const code = init();</span>
            <span className="animate-ping font-bold">█</span>
          </div>
        );

      case 'word-pop':
        return (
          <div className="flex items-center gap-1.5 font-bold font-sans text-xs select-none">
            <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 group-hover:scale-110 transition-transform">POP</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 group-hover:scale-110 transition-transform delay-75">EACH</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 group-hover:scale-110 transition-transform delay-150">WORD</span>
          </div>
        );

      case 'character-stagger':
        return (
          <div className="flex items-center gap-0.5 font-black text-sm text-cyan-300 tracking-wider font-mono">
            {'CASCADE'.split('').map((c, i) => (
              <span key={i} className="group-hover:-translate-y-1.5 transition-transform" style={{ transitionDelay: `${i * 35}ms` }}>
                {c}
              </span>
            ))}
          </div>
        );

      // 4. 3D & Cinematic:
      case 'isometric-3d':
        return (
          <div className="relative select-none transform rotate-12 -skew-x-12 group-hover:scale-110 transition-transform duration-300">
            <div className="w-20 h-10 rounded bg-indigo-600/80 border border-indigo-300 text-white font-black text-xs flex items-center justify-center shadow-2xl">
              ISOMETRIC
            </div>
            <div className="w-20 h-2 bg-indigo-950 rounded-b border-x border-b border-indigo-800" />
          </div>
        );

      case 'shadow-perspective':
        return (
          <div className="flex flex-col items-center justify-center select-none">
            <span className="text-sm font-black text-white tracking-widest">DEPTH SHADOW</span>
            <div className="w-24 h-2 bg-cyan-500/20 blur-sm rounded-full transform scale-x-125" />
          </div>
        );

      case 'smoke-reveal':
        return (
          <div className="flex flex-col items-center justify-center select-none">
            <span className="text-xs font-serif tracking-[0.3em] text-zinc-300 uppercase opacity-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              NOCTURNAL
            </span>
            <span className="text-[8px] tracking-[0.4em] text-zinc-500 uppercase mt-0.5">
              ATMOSPHERE
            </span>
          </div>
        );

      // 5. Social Media:
      case 'subscribe-button':
        return (
          <div className="flex items-center gap-2 select-none group-hover:scale-105 transition-transform">
            <div className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-md shadow-red-600/40">
              SUBSCRIBE
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Bell className="w-3.5 h-3.5 fill-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
        );

      case 'lower-third-tag':
        return (
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-purple-500/40 rounded-full px-3 py-1 select-none">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-purple-300">@creator_studio</span>
          </div>
        );

      // 6. Timers & Counters:
      case 'counter-timer':
        return (
          <div className="text-base font-bold font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] select-none">
            {preset.displayText || '$14,850.00'}
          </div>
        );

      case 'countdown-clock':
        return (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded px-3 py-1 text-center font-mono text-emerald-300 font-bold text-xs select-none">
            00:00:59:24
          </div>
        );

      case 'progress-percent':
        return (
          <div className="flex flex-col items-center justify-center select-none">
            <span className="text-xl font-black text-amber-400 font-mono">99.8%</span>
            <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div className="w-5/6 h-full bg-amber-400 rounded-full" />
            </div>
          </div>
        );

      // 7. Transitions: 2D Special Effects:
      case 'shockwave-impact':
        return (
          <div className="relative flex items-center justify-center select-none">
            <div className="w-14 h-14 rounded-full border-2 border-cyan-400/80 animate-ping opacity-60" />
            <div className="absolute w-8 h-8 rounded-full bg-cyan-500/40 border border-cyan-300" />
            <span className="absolute text-[8px] font-mono text-white font-bold">IMPACT</span>
          </div>
        );

      case 'speed-lines':
        return (
          <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-amber-400/30 rotate-12" />
              <div className="w-full h-[1px] bg-amber-400/30 -rotate-12" />
              <div className="w-full h-[1px] bg-amber-400/40 rotate-45" />
              <div className="w-full h-[1px] bg-amber-400/40 -rotate-45" />
            </div>
            <span className="relative z-10 text-xs font-black text-amber-300 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-amber-500/40">
              ACTION LINES
            </span>
          </div>
        );

      case 'particle-spark':
        return (
          <div className="relative flex items-center justify-center select-none">
            <Zap className="w-7 h-7 text-rose-400 animate-bounce" />
            <span className="text-[9px] font-bold text-rose-300 uppercase tracking-wider ml-1">SPARK BURST</span>
          </div>
        );

      // 8. Transitions: Camera:
      case 'camera-zoom-push':
        return (
          <div className="flex flex-col items-center justify-center select-none group-hover:scale-125 transition-transform duration-300">
            <Camera className="w-6 h-6 text-indigo-400 mb-1" />
            <span className="text-[9px] font-bold text-indigo-200 tracking-wider">CRASH ZOOM</span>
          </div>
        );

      case 'whip-pan':
        return (
          <div className="w-24 h-10 border border-sky-500/40 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent flex items-center justify-center select-none">
            <span className="text-[10px] font-mono font-bold text-sky-300 tracking-widest">&gt;&gt;&gt; WHIP &gt;&gt;&gt;</span>
          </div>
        );

      case 'camera-shake':
        return (
          <div className="flex items-center gap-1.5 select-none text-teal-300 font-mono text-xs font-bold group-hover:animate-bounce">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>HANDHELD</span>
          </div>
        );

      // 9. Transitions: Glitch:
      case 'rgb-split':
        return (
          <div className="relative select-none text-center">
            <span className="absolute -left-[2px] -top-[1px] text-base font-black text-cyan-400 opacity-80">RGB SPLIT</span>
            <span className="absolute left-[2px] top-[1px] text-base font-black text-red-500 opacity-80">RGB SPLIT</span>
            <span className="relative text-base font-black text-white">RGB SPLIT</span>
          </div>
        );

      case 'scanline-crt':
        return (
          <div className="relative w-full h-12 bg-black border border-green-500/40 flex items-center justify-center select-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
            <span className="relative z-10 text-xs font-mono font-bold text-green-400">CRT 1995 SIGNAL</span>
          </div>
        );

      case 'block-displacement':
        return (
          <div className="flex items-center gap-1 select-none">
            <div className="w-6 h-4 bg-purple-500/50 -translate-y-1" />
            <div className="w-8 h-4 bg-cyan-400/60 translate-y-1" />
            <div className="w-6 h-4 bg-pink-500/50" />
          </div>
        );

      // 10. Transitions: Hand Drawn & Light Leaks:
      case 'stop-motion-boil':
        return (
          <div className="border-2 border-dashed border-amber-400 rounded-lg p-2 text-center select-none">
            <span className="text-xs font-black text-amber-300 font-mono">12 FPS BOIL</span>
          </div>
        );

      case 'wobbly-stroke':
        return (
          <div className="relative select-none text-rose-400 font-serif italic text-sm font-bold">
            ~ Hand Sketched ~
          </div>
        );

      case 'sun-flare-leak':
        return (
          <div className="relative w-full h-12 bg-gradient-to-r from-amber-600/30 via-yellow-400/50 to-orange-500/20 rounded flex items-center justify-center select-none shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Sun className="w-5 h-5 text-amber-300 mr-1 animate-spin" />
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">35mm Sun Flare</span>
          </div>
        );

      case 'prism-streak':
        return (
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] rounded-full select-none" />
        );

      // 11. Transitions: Matte & Shapes:
      case 'diagonal-slice':
        return (
          <div className="relative w-20 h-10 border border-purple-500/60 overflow-hidden select-none">
            <div className="absolute inset-0 bg-purple-600/40 transform -skew-x-12 translate-x-2" />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white">45° SLICE</span>
          </div>
        );

      case 'brush-paint-matte':
        return (
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-serif text-xs select-none">
            Brush Stroke
          </div>
        );

      case 'iris-circle':
        return (
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center select-none group-hover:scale-125 transition-transform">
            <div className="w-4 h-4 rounded-full bg-blue-400" />
          </div>
        );

      case 'stripe-swipe':
        return (
          <div className="flex flex-col gap-0.5 w-24 select-none">
            <div className="h-1 bg-emerald-400 rounded-full w-full" />
            <div className="h-1 bg-emerald-500 rounded-full w-3/4" />
            <div className="h-1 bg-emerald-600 rounded-full w-1/2" />
          </div>
        );

      // 12. Graphic Components:
      case 'lower-third-modern':
        return (
          <div className="flex items-center gap-2 select-none border-l-2 border-cyan-400 pl-2">
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white leading-tight">ALEXANDER CROSS</span>
              <span className="text-[9px] text-cyan-300 font-mono leading-tight">Technical Director</span>
            </div>
          </div>
        );

      case 'sound-wave-bars':
        return (
          <div className="flex items-end gap-1 h-8 select-none">
            {[40, 70, 90, 60, 100, 75, 45, 80].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-purple-400 rounded-t group-hover:bg-cyan-400 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        );

      case 'grid-matrix':
        return (
          <div className="grid grid-cols-3 gap-1 select-none group-hover:scale-110 transition-transform duration-300">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded bg-cyan-500/40 border border-cyan-400/60 flex items-center justify-center"
              />
            ))}
          </div>
        );

      case 'radial-array':
        return (
          <div className="relative w-12 h-12 rounded-full border border-orange-500/40 flex items-center justify-center select-none group-hover:rotate-45 transition-transform duration-500">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
            <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
            <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
            <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
          </div>
        );

      default:
        return (
          <div className="text-center font-bold text-zinc-200 text-xs px-2 select-none">
            {preset.displayText || preset.title}
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(preset)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col rounded-md border bg-[#0e0e10] overflow-hidden cursor-pointer transition-all duration-150 select-none ${
        isSelected
          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-lg shadow-indigo-950/40'
          : 'border-[#26262a] hover:border-zinc-500/80 hover:bg-[#131316]'
      }`}
    >
      {/* 16:9 Black Screen Stage */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center p-3 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #555 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Visual Graphic */}
        {renderVisualContent()}

        {/* Hover Overlay with Action Buttons */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2 p-2 animate-in fade-in duration-100 z-20">
            <button
              onClick={handleApplyClick}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-md transition-all active:scale-95 ${
                appliedFeedback ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
              title="Apply to active AE composition / test preview"
            >
              {appliedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Apply</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(preset);
              }}
              className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs border border-zinc-700 transition-colors"
              title="Inspect & Edit Parameters"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Footer Bar matching Animation Composer exactly */}
      <div className="h-8 bg-[#18181b] border-t border-[#26262a] px-2.5 flex items-center justify-between text-xs">
        {/* Filmstrip Icon & Title */}
        <div className="flex items-center gap-2 overflow-hidden pr-1">
          {/* Filmstrip badge */}
          <div className="w-4 h-4 rounded bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shrink-0">
            <Film className="w-2.5 h-2.5 text-zinc-400" />
          </div>

          <span className="text-[11px] font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
            {preset.title}
          </span>
        </div>

        {/* Star Favorite toggle */}
        <button
          onClick={(e) => onToggleFavorite(preset.id, e)}
          className={`p-1 rounded hover:bg-zinc-700/60 transition-colors shrink-0 ${
            preset.isFavorite ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
          }`}
          title={preset.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-3.5 h-3.5 ${preset.isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>
    </div>
  );
};
