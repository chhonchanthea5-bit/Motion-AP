import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Sliders,
  Grid,
  Eye,
  EyeOff,
  Lock,
  Layers,
  Activity,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { CompLayer } from '../types';

interface CompViewerProps {
  activeExpressionCode?: string;
  targetProperty?: string;
  customSliders?: { name: string; min: number; max: number; default: number; step: number; unit?: string }[];
  onSliderChange?: (name: string, val: number) => void;
  statusMessage?: string;
}

export const CompViewer: React.FC<CompViewerProps> = ({
  activeExpressionCode,
  targetProperty = 'Scale',
  customSliders,
  statusMessage,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0.85); // seconds
  const [showSafeGuides, setShowSafeGuides] = useState(true);
  const [showCheckerboard, setShowCheckerboard] = useState(false);
  const [activeTab, setActiveTab] = useState<'comp' | 'graph'>('comp');
  const [layersExpanded, setLayersExpanded] = useState(true);

  // Dynamic slider values state
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    Amp: 8,
    Freq: 4,
    Decay: 6,
    Count: 14850,
    LoopTime: 3,
  });

  // Keep slider values updated if customSliders change
  useEffect(() => {
    if (customSliders && customSliders.length > 0) {
      setSliderValues((prev) => {
        const next = { ...prev };
        customSliders.forEach((s) => {
          if (next[s.name] === undefined) {
            next[s.name] = s.default;
          }
        });
        return next;
      });
    }
  }, [customSliders]);

  // Composition Layers state
  const [layers, setLayers] = useState<CompLayer[]>([
    {
      id: 'null-ctrl',
      name: 'NULL_CONTROLLER',
      type: 'null',
      color: '#eab308', // yellow
      visible: true,
      locked: false,
      scale: [100, 100],
      position: [240, 135],
      rotation: 0,
      opacity: 100,
    },
    {
      id: 'shape-box',
      name: 'Dynamic_Card_Shape',
      type: 'shape',
      color: '#0284c7', // cyan
      visible: true,
      locked: false,
      scale: [100, 100],
      position: [240, 135],
      rotation: 0,
      opacity: 100,
    },
    {
      id: 'text-main',
      name: 'Title_Typography',
      type: 'text',
      color: '#a855f7', // purple
      visible: true,
      locked: false,
      scale: [100, 100],
      position: [240, 135],
      rotation: 0,
      opacity: 100,
      text: 'MOTION ENGINE',
    },
  ]);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const maxDuration = 3.0; // 3 second loop

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        return next >= maxDuration ? 0 : next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Evaluate expression animation values at `time`
  const getEvaluatedValues = (t: number) => {
    const amp = (sliderValues['Amp'] ?? 8) / 100;
    const freq = sliderValues['Freq'] ?? 4;
    const decay = sliderValues['Decay'] ?? 6;

    // Simulate keyframe landing at t = 0.3s
    const keyTime = 0.3;
    let bounceVal = 0;
    if (t > keyTime && t < 2.5) {
      const elapsed = t - keyTime;
      const velocity = 850;
      bounceVal = (velocity * amp * Math.sin(freq * elapsed * 2 * Math.PI)) / Math.exp(decay * elapsed);
    }

    // Wiggle simulation
    const wiggleX = Math.sin(t * 7.3) * 15 + Math.cos(t * 3.1) * 8;
    const wiggleY = Math.cos(t * 5.2) * 12 + Math.sin(t * 2.4) * 6;

    // Counter simulation
    const countVal = Math.floor((sliderValues['Count'] ?? 14850) * Math.min(1, t / 1.8));

    // Lissajous curve
    const lissX = Math.sin(t * 2 * Math.PI * 1) * 60;
    const lissY = Math.sin(t * 2 * Math.PI * 2) * 35;

    return {
      bounceScale: Math.max(0, 100 + bounceVal / 8),
      wiggleOffset: [wiggleX, wiggleY],
      countFormatted: '$' + countVal.toLocaleString('en-US'),
      lissajous: [lissX, lissY],
    };
  };

  const evalState = getEvaluatedValues(currentTime);

  // Render Timecode string (00:00:01:14 @ 30fps)
  const formatTimecode = (sec: number) => {
    const totalFrames = Math.floor(sec * 30);
    const frames = totalFrames % 30;
    const s = Math.floor(sec) % 60;
    const m = Math.floor(sec / 60) % 60;
    return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Draw Graph Canvas for the Graph Editor tab
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || activeTab !== 'graph') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background grid lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Baseline (value = 100 or center)
    const midY = h * 0.55;
    ctx.strokeStyle = '#3f3f46';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Plot mathematical curve
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    for (let px = 0; px < w; px++) {
      const t = (px / w) * maxDuration;
      const values = getEvaluatedValues(t);
      const val = values.bounceScale; // normalized around 100
      const py = midY - (val - 100) * 2;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Playhead marker
    const playX = (currentTime / maxDuration) * w;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playX, 0);
    ctx.lineTo(playX, h);
    ctx.stroke();

    // Current point dot
    const curVal = evalState.bounceScale;
    const curY = midY - (curVal - 100) * 2;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(playX, curY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playX, curY, 2, 0, Math.PI * 2);
    ctx.fill();
  }, [currentTime, sliderValues, activeTab]);

  return (
    <div className="flex flex-col bg-[#111113] border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Bar / Viewport Header */}
      <div className="h-10 bg-[#161619] border-b border-zinc-800 px-3 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
            <button
              onClick={() => setActiveTab('comp')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                activeTab === 'comp'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Comp Viewer
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                activeTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Speed / Value Graph</span>
            </button>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">1920x1080 (100%)</span>
        </div>

        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
              {statusMessage}
            </span>
          )}

          {/* Toggle Guides */}
          <button
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={`p-1 rounded transition-colors ${
              showSafeGuides ? 'text-indigo-400 bg-indigo-950/40' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Safe Margins / Guides"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Transparency Checkerboard */}
          <button
            onClick={() => setShowCheckerboard(!showCheckerboard)}
            className={`px-1.5 py-0.5 text-[10px] rounded border font-mono transition-colors ${
              showCheckerboard
                ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Transparency Grid"
          >
            Alpha
          </button>
        </div>
      </div>

      {/* Main Preview Surface */}
      <div className="relative aspect-video w-full bg-[#0a0a0c] overflow-hidden flex items-center justify-center">
        {/* Checkerboard Pattern */}
        {showCheckerboard && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          />
        )}

        {/* Title Safe & Action Safe Guides */}
        {showSafeGuides && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* 90% Action Safe */}
            <div className="absolute inset-[5%] border border-cyan-500/15 pointer-events-none" />
            {/* 80% Title Safe */}
            <div className="absolute inset-[10%] border border-cyan-500/25 pointer-events-none" />
            {/* Center Crosshair */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-cyan-400/30" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-[1px] bg-cyan-400/30" />
          </div>
        )}

        {activeTab === 'comp' ? (
          /* Virtual Comp Layers Stage */
          <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
            {/* Background subtle radial glow */}
            <div className="absolute w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            {/* Virtual Shape Layer with evaluated scale & bounce */}
            <div
              className="relative flex flex-col items-center justify-center transition-transform duration-75"
              style={{
                transform: `scale(${evalState.bounceScale / 100}) translate(${evalState.wiggleOffset[0]}px, ${evalState.wiggleOffset[1]}px)`,
              }}
            >
              {/* Outer Glow Card */}
              <div className="relative w-56 h-32 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-zinc-900/90 to-black border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/20 p-4 flex flex-col justify-between backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    AE LIVE RIG
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    S: {evalState.bounceScale.toFixed(1)}%
                  </span>
                </div>

                <div className="my-auto text-center">
                  <div className="text-xl font-bold font-mono tracking-tight text-white drop-shadow-md">
                    {evalState.countFormatted}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium tracking-wide mt-0.5">
                    {layers.find((l) => l.id === 'text-main')?.text || 'MOTION ENGINE'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Amp: {sliderValues['Amp'] ?? 8}%</span>
                  <span>Freq: {sliderValues['Freq'] ?? 4}Hz</span>
                  <span>Decay: {sliderValues['Decay'] ?? 6}</span>
                </div>
              </div>

              {/* Anchor point indicator */}
              <div className="absolute w-3 h-3 rounded-full border border-red-400/80 pointer-events-none flex items-center justify-center">
                <div className="w-1 h-1 bg-red-400 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Graph Editor Canvas */
          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
            <canvas
              ref={graphCanvasRef}
              width={560}
              height={280}
              className="w-full h-full rounded border border-zinc-800 bg-[#0d0d10]"
            />
          </div>
        )}

        {/* Live HUD overlay on top-left of comp */}
        <div className="absolute top-2 left-2 pointer-events-none flex flex-col gap-1 text-[10px] font-mono text-zinc-400 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">CTI:</span>
            <span className="text-indigo-300 font-bold">{formatTimecode(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Property:</span>
            <span className="text-amber-300">{targetProperty}</span>
          </div>
        </div>
      </div>

      {/* Scrubber & Playback Transport Bar */}
      <div className="bg-[#141417] border-t border-zinc-800 px-3 py-2 flex flex-col gap-2 select-none">
        {/* Timeline Slider Track */}
        <div className="relative flex items-center w-full group">
          <input
            type="range"
            min={0}
            max={maxDuration}
            step={0.01}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
        </div>

        {/* Playback Controls & Frame Stepper */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-7 h-7 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95 shadow-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentTime(0)}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Return to 00:00:00:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="font-mono text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {formatTimecode(currentTime)} / 00:00:03:00
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 font-mono">
            Keyframe at <strong className="text-indigo-400">00:00:00:09</strong> (Overshoot active)
          </div>
        </div>
      </div>

      {/* Slider Controls Inspector (Expression Parameters) */}
      <div className="bg-[#0f0f11] border-t border-zinc-800/80 p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span className="font-semibold flex items-center gap-1.5 text-zinc-200">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Expression Controller Sliders
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">Real-time parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Amplitude */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded p-2 flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Amplitude (Amp)</span>
              <span className="font-mono text-indigo-300">{sliderValues['Amp'] ?? 8}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={sliderValues['Amp'] ?? 8}
              onChange={(e) => setSliderValues({ ...sliderValues, Amp: parseFloat(e.target.value) })}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Frequency */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded p-2 flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Frequency (Freq)</span>
              <span className="font-mono text-cyan-300">{sliderValues['Freq'] ?? 4} Hz</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={sliderValues['Freq'] ?? 4}
              onChange={(e) => setSliderValues({ ...sliderValues, Freq: parseFloat(e.target.value) })}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Decay */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded p-2 flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Decay Falloff</span>
              <span className="font-mono text-amber-300">{sliderValues['Decay'] ?? 6}</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={sliderValues['Decay'] ?? 6}
              onChange={(e) => setSliderValues({ ...sliderValues, Decay: parseFloat(e.target.value) })}
              className="h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* AE Timeline Layer Stack Inspector */}
      <div className="bg-[#121215] border-t border-zinc-800/80 p-2 text-xs">
        <button
          onClick={() => setLayersExpanded(!layersExpanded)}
          className="w-full flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-1"
        >
          <span className="flex items-center gap-1.5 font-medium text-[11px] uppercase tracking-wider text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Comp Layers ({layers.length})
          </span>
          {layersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {layersExpanded && (
          <div className="mt-1 flex flex-col gap-1">
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                className="flex items-center justify-between px-2 py-1 rounded bg-zinc-900/60 border border-zinc-800/60 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 font-mono w-3">{idx + 1}</span>
                  {/* AE Color Swatch */}
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-mono font-medium text-zinc-200">{layer.name}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-500">
                  <span className="capitalize text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    {layer.type}
                  </span>
                  <button
                    onClick={() => {
                      setLayers(
                        layers.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                      );
                    }}
                    className="hover:text-zinc-300"
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5 text-zinc-300" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-600" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
