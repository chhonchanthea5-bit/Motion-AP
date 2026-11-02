export type MainViewTab = 'browse' | 'edit' | 'ai-studio';

export type CommandTab =
  | 'expressions'
  | 'rigging'
  | 'timeline'
  | 'math'
  | 'troubleshooter'
  | 'system-prompt';

export type AEVersion = 'AE 2026' | 'AE 2025' | 'AE 2024' | 'AE CC (Legacy)';

export type CategoryKey =
  | 'all'
  | 'motion-presets'
  | 'text-presets'
  | '3d-titles'
  | 'cinematic-titles'
  | 'essential-typography'
  | 'social-media'
  | 'timers-counters'
  | '2d-special-effects'
  | 'camera'
  | 'glitch'
  | 'hand-drawn'
  | 'light-leaks'
  | 'matte-transitions'
  | 'shapes'
  | 'graphic-components'
  | 'auto-rigs';

export type ExpressionProperty =
  | 'Scale'
  | 'Position'
  | 'Opacity'
  | 'Rotation'
  | 'Source Text'
  | 'Path'
  | 'Color'
  | 'Slider Control'
  | 'Point Control';

export interface PresetItem {
  id: string;
  title: string;
  category: string;
  description: string;
  targetProperty?: ExpressionProperty;
  prompt: string;
  defaultCode?: string;
  sliders?: { name: string; min: number; max: number; default: number; step: number; unit?: string }[];
}

export type ThumbnailType =
  | 'deformation-title'
  | 'basic-title-left'
  | 'creative-title'
  | 'text-bubble'
  | 'two-line-title'
  | 'outline-badge'
  | 'atypical-title'
  | 'bullet-list'
  | 'light-mask'
  | 'bounce-scale'
  | 'wiggle-loop'
  | 'counter-timer'
  | 'grid-matrix'
  | 'kinetic-wave'
  | 'radial-array'
  // Text presets
  | 'typewriter-terminal'
  | 'word-pop'
  | 'character-stagger'
  | 'blur-fade'
  // 3D titles
  | 'isometric-3d'
  | 'shadow-perspective'
  | 'depth-card'
  // Cinematic
  | 'smoke-reveal'
  // Social media
  | 'subscribe-button'
  | 'lower-third-tag'
  | 'story-sticker'
  // Timers & Counters
  | 'countdown-clock'
  | 'progress-percent'
  // Transitions: 2D Special Effects
  | 'shockwave-impact'
  | 'speed-lines'
  | 'particle-spark'
  // Transitions: Camera
  | 'camera-zoom-push'
  | 'whip-pan'
  | 'camera-shake'
  // Transitions: Glitch
  | 'rgb-split'
  | 'scanline-crt'
  | 'block-displacement'
  // Transitions: Hand Drawn
  | 'stop-motion-boil'
  | 'wobbly-stroke'
  | 'crayon-brush'
  // Transitions: Light Leaks
  | 'sun-flare-leak'
  | 'prism-streak'
  | 'neon-flash'
  // Transitions: Matte
  | 'diagonal-slice'
  | 'brush-paint-matte'
  | 'linear-angle-wipe'
  // Transitions: Shapes
  | 'iris-circle'
  | 'stripe-swipe'
  | 'hexagon-grid'
  // Graphic components
  | 'lower-third-modern'
  | 'sound-wave-bars'
  | 'custom';

export interface ComposerPreset {
  id: string;
  title: string;
  folderCategory: string; // e.g. "Titles & Typography > Essential Typography"
  categoryKey: CategoryKey;
  thumbnailType: ThumbnailType;
  displayText?: string;
  subText?: string;
  accentColor?: string;
  isFavorite?: boolean;
  type: 'expression' | 'extendscript' | 'both';
  targetProperty?: ExpressionProperty;
  description: string;
  expressionCode?: string;
  extendScriptCode?: string;
  sliders?: {
    name: string;
    min: number;
    max: number;
    default: number;
    step: number;
    unit?: string;
  }[];
}

export interface CompLayer {
  id: string;
  name: string;
  type: 'shape' | 'text' | 'null' | 'solid' | 'camera';
  color: string;
  visible: boolean;
  locked: boolean;
  scale: [number, number];
  position: [number, number];
  rotation: number;
  opacity: number;
  text?: string;
  expressionCode?: string;
}
