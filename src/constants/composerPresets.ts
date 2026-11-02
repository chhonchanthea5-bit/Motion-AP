import { ComposerPreset } from '../types';

export const COMPOSER_PRESETS: ComposerPreset[] = [
  // ==========================================
  // TITLES & TYPOGRAPHY > ESSENTIAL TYPOGRAPHY
  // ==========================================
  {
    id: 'deformation-title',
    title: 'Deformation Title',
    folderCategory: 'Titles & Typography > Essential Typography',
    categoryKey: 'essential-typography',
    thumbnailType: 'deformation-title',
    displayText: 'The\nNEVERENDING\nMOVIE',
    accentColor: '#38bdf8',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Source Text',
    description: 'Dynamic character stretching and deformation typography with customizable overshoot easing.',
    expressionCode: `// AE Master / Animation Composer: Deformation Title
// Apply to: Text Layer > Scale / Animator Scale
const damp = 6.0;
const t = time - inPoint;

if (t > 0 && t < 1.2) {
  const osc = Math.sin(t * 8 * Math.PI) / Math.exp(damp * t);
  const scaleX = 100 + osc * 35;
  const scaleY = 100 - osc * 25;
  [scaleX, scaleY];
} else {
  [100, 100];
}`,
    sliders: [
      { name: 'Stretch Amp', min: 10, max: 200, default: 35, step: 1, unit: '%' },
      { name: 'Dampening', min: 1, max: 15, default: 6, step: 0.5 },
      { name: 'Duration', min: 0.2, max: 3, default: 1.2, step: 0.1, unit: 's' }
    ]
  },
  {
    id: 'basic-title-left',
    title: 'Basic Title Left',
    folderCategory: 'Titles & Typography > Essential Typography',
    categoryKey: 'essential-typography',
    thumbnailType: 'basic-title-left',
    displayText: 'May the\nHorse\nbe with you',
    subText: 'Left Bar Accent',
    accentColor: '#f59e0b',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Left-aligned corporate title with dynamic vertical accent line that auto-resizes to text height.',
    expressionCode: `// AE Master: Left Accent Bar Position & Height
// Apply to: Accent Line Shape Layer > Size
const textLayer = thisComp.layer("Title Text");
const padY = 20;
const rect = textLayer.sourceRectAtTime(time, false);
[4, rect.height + padY];`,
    extendScriptCode: `// Create Left Accented Title Rig
(function() {
  app.beginUndoGroup("Create Basic Title Left");
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) return;
  var text = comp.layers.addText("May the\\nHorse\\nbe with you");
  text.property("ADOBE Transform Group").property("ADOBE Position").setValue([comp.width/2 - 100, comp.height/2]);
  app.endUndoGroup();
})();`
  },
  {
    id: 'outline-basic-title',
    title: 'Outline Basic Title',
    folderCategory: 'Titles & Typography > Essential Typography',
    categoryKey: 'essential-typography',
    thumbnailType: 'outline-badge',
    displayText: 'MOTION GRAPHICS\nWITHOUT HASSLE',
    accentColor: '#f59e0b',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Clean outlined rectangle badge that frames title and subtitle with spring pop animation.',
    expressionCode: `// AE Master: Badge Spring Pop
const amp = 0.12;
const freq = 4.0;
const decay = 7.0;
const t = time - inPoint;
if (t > 0 && t < 1.5) {
  const w = Math.sin(t * freq * 2 * Math.PI) / Math.exp(decay * t);
  value + [w * 100 * amp, w * 100 * amp];
} else {
  value;
}`
  },
  {
    id: 'bullet-list',
    title: 'Bullet List',
    folderCategory: 'Titles & Typography > Essential Typography',
    categoryKey: 'essential-typography',
    thumbnailType: 'bullet-list',
    displayText: '• LIFE IS LIKE A KEYFRAME\n• IT\'S LINEAR BY DEFAULT\n• AND IT\'S UP TO\n• YOU HOW TO EASE IT',
    accentColor: '#f59e0b',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Self-sequencing bullet list presentation rig with individual line staggering.',
    expressionCode: `// AE Master: Bullet Point Sequential Cascade
const lineIndex = thisLayer.name.split("_")[1] || 1;
const delay = (lineIndex - 1) * 0.15;
const t = time - inPoint - delay;
easeOut(t, 0, 0.5, [value[0] - 60, value[1]], value);`
  },

  // ==========================================
  // TITLES & TYPOGRAPHY > 3D TITLES
  // ==========================================
  {
    id: 'creative-title',
    title: 'Creative Title',
    folderCategory: 'Titles & Typography > 3D Titles',
    categoryKey: '3d-titles',
    thumbnailType: 'creative-title',
    displayText: 'FANTASTIC\nTYPOGRAPHY PACK',
    accentColor: '#ffffff',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Rotation',
    description: 'Arched 3D typography with kinetic tracking expansion and kinetic spring inertia.',
    expressionCode: `// AE Master: Arched Kinetic Wave
const t = time - inPoint;
const freq = 3.0;
const decay = 5.0;
if (t > 0 && t < 2) {
  value + (velocityAtTime(inPoint + 0.05) * 0.05 * Math.sin(t * freq * 2 * Math.PI) / Math.exp(decay * t));
} else {
  value;
}`
  },
  {
    id: 'isometric-3d-title',
    title: 'Isometric 3D Extrude',
    folderCategory: 'Titles & Typography > 3D Titles',
    categoryKey: '3d-titles',
    thumbnailType: 'isometric-3d',
    displayText: 'ISOMETRIC\n3D EXTRUDE',
    accentColor: '#818cf8',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Rotation',
    description: 'True isometric projection angles (35.264° X-rot, 45° Y-rot) with faux depth layer stacking.',
    expressionCode: `// Apply to 3D Layer Orientation:
// Isometric True Projection Angles
[35.264, 45, 0];`
  },
  {
    id: 'shadow-perspective-title',
    title: 'Perspective Shadow Drop',
    folderCategory: 'Titles & Typography > 3D Titles',
    categoryKey: '3d-titles',
    thumbnailType: 'shadow-perspective',
    displayText: 'PERSPECTIVE\nSHADOW DEPTH',
    accentColor: '#38bdf8',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Calculates dynamic long cast shadow angle and floor skew matching light source position.',
    expressionCode: `// Apply to Shadow Duplicate Layer > Skew
const lightPos = thisComp.layer("Light Controller").transform.position;
const dx = position[0] - lightPos[0];
clamp(dx / 12, -65, 65);`
  },

  // ==========================================
  // TITLES & TYPOGRAPHY > CINEMATIC TITLES
  // ==========================================
  {
    id: 'two-line-title',
    title: '2-Line Title',
    folderCategory: 'Titles & Typography > Cinematic Titles',
    categoryKey: 'cinematic-titles',
    thumbnailType: 'two-line-title',
    displayText: 'STAR\nHORSE',
    accentColor: '#ffffff',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'High-impact cinematic bold 2-line title with split directional slide and matte wipe.',
    expressionCode: `// AE Master: Split 2-Line Offset
const t = time - inPoint;
const easeProgress = easeOut(t, 0, 0.6, -200, 0);
[value[0], value[1] + easeProgress];`
  },
  {
    id: 'atypical-title',
    title: 'Atypical Title',
    folderCategory: 'Titles & Typography > Cinematic Titles',
    categoryKey: 'cinematic-titles',
    thumbnailType: 'atypical-title',
    displayText: 'stunning\n•••\nSimplicity',
    accentColor: '#ffffff',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Opacity',
    description: 'Curved typography with staggered 3-dot accent divider and smooth blur fade-in.',
    expressionCode: `// AE Master: Staggered Blur Reveal
const delay = (index - 1) * 0.08;
const t = time - inPoint - delay;
linear(t, 0, 0.4, 0, 100);`
  },
  {
    id: 'light-mask-title',
    title: 'Light Mask Title',
    folderCategory: 'Titles & Typography > Cinematic Titles',
    categoryKey: 'cinematic-titles',
    thumbnailType: 'light-mask',
    displayText: 'MASTER OF THE\nSTABLES',
    accentColor: '#e2e8f0',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'Elegant serif title revealed through an optical track matte light flare sweep.',
    expressionCode: `// AE Master: Optical Flare Sweep Wipe
const speed = 600;
const t = time - inPoint;
const x = -300 + t * speed;
[x, value[1]];`
  },
  {
    id: 'smoke-reveal-title',
    title: 'Atmospheric Fog & Title Reveal',
    folderCategory: 'Titles & Typography > Cinematic Titles',
    categoryKey: 'cinematic-titles',
    thumbnailType: 'smoke-reveal',
    displayText: 'NOCTURNAL\nCINEMA',
    accentColor: '#94a3b8',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Opacity',
    description: 'Slow atmospheric fade with optical blur diffusion and subtle tracking creep.',
    expressionCode: `// Apply to Animator Tracking
const t = time - inPoint;
ease(t, 0, 3.5, 0, 35);`
  },

  // ==========================================
  // TITLES & TYPOGRAPHY > SOCIAL MEDIA
  // ==========================================
  {
    id: 'long-text-bubble',
    title: 'Long Text Bubble',
    folderCategory: 'Titles & Typography > Social Media',
    categoryKey: 'social-media',
    thumbnailType: 'text-bubble',
    displayText: 'My mother always said,\nthe key is to easy ease\nkeyframes and use the right\nwoosh for the right thing.',
    accentColor: '#f97316',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Path',
    description: 'Auto-resizing cartoon speech bubble with responsive tail and padding using sourceRectAtTime.',
    expressionCode: `// AE Master: Speech Bubble Responsive Box
const txt = thisComp.layer("Bubble Text");
const rect = txt.sourceRectAtTime(time, false);
const pad = [40, 24];
[rect.width + pad[0] * 2, rect.height + pad[1] * 2];`
  },
  {
    id: 'subscribe-bell-button',
    title: 'Subscribe & Bell Button Rig',
    folderCategory: 'Titles & Typography > Social Media',
    categoryKey: 'social-media',
    thumbnailType: 'subscribe-button',
    displayText: 'SUBSCRIBE',
    subText: 'Bell Notification',
    accentColor: '#ef4444',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Red pill subscribe button that clicks into grey Subscribed state with jiggling bell icon.',
    expressionCode: `// Button Click Bounce Reaction
const clickTime = 1.2;
const t = time - clickTime;
if (t > 0 && t < 0.6) {
  const bounce = Math.sin(t * 12 * Math.PI) / Math.exp(10 * t);
  [100 - bounce * 15, 100 - bounce * 15];
} else {
  [100, 100];
}`
  },
  {
    id: 'lower-third-tag',
    title: 'Social Handle @Name Tag',
    folderCategory: 'Titles & Typography > Social Media',
    categoryKey: 'social-media',
    thumbnailType: 'lower-third-tag',
    displayText: '@creator_name',
    subText: 'Follow on Social',
    accentColor: '#a855f7',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Sleek rounded capsule badge for YouTube/TikTok handles with smooth ease slide-in.',
    expressionCode: `// Smooth Slide In from Left
const t = time - inPoint;
const slide = easeOut(t, 0, 0.5, -400, 0);
[value[0] + slide, value[1]];`
  },

  // ==========================================
  // TITLES & TYPOGRAPHY > TIMERS & COUNTERS
  // ==========================================
  {
    id: 'counter-timer-preset',
    title: 'Currency & Number Odometer',
    folderCategory: 'Titles & Typography > Timers & Counters',
    categoryKey: 'timers-counters',
    thumbnailType: 'counter-timer',
    displayText: '$14,850.00',
    subText: 'Dynamic Counter',
    accentColor: '#3b82f6',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Source Text',
    description: 'Dynamic currency and number odometer linked to slider with commas and decimals.',
    expressionCode: `// AE Master: Dynamic Currency Counter
const sliderVal = thisLayer.effect("Count") ? thisLayer.effect("Count")(1).value : time * 1485;
const prefix = "$";
const decimals = 2;
function formatWithCommas(n) {
  const parts = n.toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
  return parts.join(".");
}
prefix + formatWithCommas(Math.max(0, sliderVal));`
  },
  {
    id: 'countdown-clock-preset',
    title: 'Digital Countdown Clock (MM:SS:FF)',
    folderCategory: 'Titles & Typography > Timers & Counters',
    categoryKey: 'timers-counters',
    thumbnailType: 'countdown-clock',
    displayText: '00:00:59:24',
    subText: 'Timecode Rig',
    accentColor: '#10b981',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Source Text',
    description: 'Precision digital sports/fitness countdown clock with padded minutes, seconds, and frames.',
    expressionCode: `// Digital Sports Countdown
const totalSec = Math.max(0, 60 - (time - inPoint));
const m = Math.floor(totalSec / 60);
const s = Math.floor(totalSec % 60);
const f = Math.floor((totalSec % 1) * 30);
function pad(n) { return (n < 10 ? "0" : "") + n; }
pad(m) + ":" + pad(s) + ":" + pad(f);`
  },
  {
    id: 'progress-percent-preset',
    title: 'Percentage Metric (0% - 100%)',
    folderCategory: 'Titles & Typography > Timers & Counters',
    categoryKey: 'timers-counters',
    thumbnailType: 'progress-percent',
    displayText: '99.8%',
    subText: 'KPI Metric',
    accentColor: '#f59e0b',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Source Text',
    description: 'Clean data visualization metric with easing acceleration and formatted percentage suffix.',
    expressionCode: `// Percentage Metric
const t = time - inPoint;
const p = easeOut(t, 0, 2.0, 0, 99.8);
p.toFixed(1) + "%";`
  },

  // ==========================================
  // ANIMATION PRESETS > MOTION PRESETS
  // ==========================================
  {
    id: 'bounce-scale-preset',
    title: 'Inertial Bounce Scale',
    folderCategory: 'Animation Presets > Motion Presets',
    categoryKey: 'motion-presets',
    thumbnailType: 'bounce-scale',
    displayText: 'INERTIAL BOUNCE',
    subText: 'Scale Overshoot',
    accentColor: '#6366f1',
    isFavorite: true,
    type: 'expression',
    targetProperty: 'Scale',
    description: 'Bouncy overshoot scale expression that reacts to slider controls and stops cleanly after 2 seconds.',
    expressionCode: `// AE Master: Bouncy Scale with Slider Control
const amp = hasEffect("Amp") ? effect("Amp")(1) / 100 : 0.08;
const freq = hasEffect("Freq") ? effect("Freq")(1) : 4.0;
const decay = hasEffect("Decay") ? effect("Decay")(1) : 6.0;
const maxDuration = 2.0;

function hasEffect(name) {
  return thisLayer.effect(name) != null;
}

let n = 0;
if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) n--;
}

if (n === 0) {
  value;
} else {
  const t = time - key(n).time;
  if (t > 0 && t <= maxDuration) {
    const v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);
    value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);
  } else {
    value;
  }
}`,
    sliders: [
      { name: 'Amp', min: 1, max: 20, default: 8, step: 0.5, unit: '%' },
      { name: 'Freq', min: 1, max: 10, default: 4, step: 0.5, unit: 'Hz' },
      { name: 'Decay', min: 1, max: 15, default: 6, step: 0.5 }
    ]
  },
  {
    id: 'seamless-wiggle-preset',
    title: 'Seamless Looping Wiggle',
    folderCategory: 'Animation Presets > Motion Presets',
    categoryKey: 'motion-presets',
    thumbnailType: 'wiggle-loop',
    displayText: 'SMOOTH WIGGLE',
    subText: 'Looping Cycle',
    accentColor: '#10b981',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'Organic looping wiggle expression that seamlessly loops every cycle without jarring breaks.',
    expressionCode: `// AE Master: Seamless Looping Wiggle
const loopTime = 3.0;
const freq = 1.5;
const amp = 40;
const t = time % loopTime;
const w1 = wiggle(freq, amp, 1, 0.5, t);
const w2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
ease(t, 0, loopTime, w1, w2);`
  },
  {
    id: 'elastic-snap-rotation',
    title: 'Elastic Snap Rotation',
    folderCategory: 'Animation Presets > Motion Presets',
    categoryKey: 'motion-presets',
    thumbnailType: 'bounce-scale',
    displayText: 'ELASTIC SNAP',
    subText: 'Snappy Angle',
    accentColor: '#f97316',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Rotation',
    description: 'High energy snappy rotation that overshoots target angle and snaps into place.',
    expressionCode: `// Elastic Snap Rotation
const t = time - inPoint;
const snap = Math.sin(t * 14) / Math.exp(8 * t);
value + snap * 45;`
  },

  // ==========================================
  // ANIMATION PRESETS > TEXT PRESETS
  // ==========================================
  {
    id: 'typewriter-terminal-preset',
    title: 'Typewriter Terminal Cursor',
    folderCategory: 'Animation Presets > Text Presets',
    categoryKey: 'text-presets',
    thumbnailType: 'typewriter-terminal',
    displayText: 'const code = init();█',
    subText: 'Typewriter Effect',
    accentColor: '#22c55e',
    isFavorite: true,
    type: 'expression',
    targetProperty: 'Source Text',
    description: 'Retro mechanical typewriter text reveal with blinking terminal block cursor █.',
    expressionCode: `// Typewriter with Blinking Cursor
const fullText = "const aeMaster = new Intelligence();";
const charsPerSec = 25;
const t = Math.max(0, time - inPoint);
const count = Math.floor(t * charsPerSec);
const cursor = (Math.floor(time * 3) % 2 === 0) ? "█" : " ";
fullText.substring(0, count) + cursor;`
  },
  {
    id: 'word-pop-preset',
    title: 'Word by Word Kinetic Pop',
    folderCategory: 'Animation Presets > Text Presets',
    categoryKey: 'text-presets',
    thumbnailType: 'word-pop',
    displayText: 'POP • EACH • WORD',
    subText: 'Kinetic Stagger',
    accentColor: '#ec4899',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Sequentially pops each word into existence with scale overshoot and spatial tracking.',
    expressionCode: `// Word Cascade Overshoot
const wordDelay = 0.2;
const t = time - inPoint;
const wordScale = easeOut(t, 0, 0.4, 0, 100);
[wordScale, wordScale];`
  },
  {
    id: 'character-stagger-preset',
    title: 'Character Y-Axis Cascade Wave',
    folderCategory: 'Animation Presets > Text Presets',
    categoryKey: 'text-presets',
    thumbnailType: 'character-stagger',
    displayText: 'CASCADE WAVE',
    subText: 'Smooth Ramp Up',
    accentColor: '#38bdf8',
    isFavorite: false,
    type: 'extendscript',
    description: 'Sets up a Text Animator with Range Selector Ramp Up for silky smooth letter cascades.',
    extendScriptCode: `// ExtendScript: Text Animator Range Wave
(function() {
  app.beginUndoGroup("Create Text Animator Wave");
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) return;
  var text = comp.layers.addText("CASCADE WAVE");
  var anim = text.property("ADOBE Text Properties").property("ADOBE Text Animators").addProperty("ADOBE Text Animator");
  var p = anim.property("ADOBE Text Animator Properties").addProperty("ADOBE Text Position 3D");
  p.setValue([0, 100, 0]);
  app.endUndoGroup();
})();`
  },

  // ==========================================
  // TRANSITIONS > 2D SPECIAL EFFECTS
  // ==========================================
  {
    id: 'shockwave-impact-preset',
    title: 'Impact Shockwave Ring',
    folderCategory: 'Transitions > 2D Special Effects',
    categoryKey: '2d-special-effects',
    thumbnailType: 'shockwave-impact',
    displayText: 'SHOCKWAVE',
    subText: 'Impact Ring',
    accentColor: '#00f2fe',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Fast expanding circular shockwave with stroke width dissipation and exponential deceleration.',
    expressionCode: `// Shockwave Expansion
const t = time - inPoint;
const r = easeOut(t, 0, 0.5, 0, 300);
[r, r];`
  },
  {
    id: 'speed-lines-preset',
    title: 'Anime Action Speed Lines',
    folderCategory: 'Transitions > 2D Special Effects',
    categoryKey: '2d-special-effects',
    thumbnailType: 'speed-lines',
    displayText: 'SPEED LINES',
    subText: 'Radial Burst',
    accentColor: '#eab308',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Opacity',
    description: 'High intensity anime action speed lines bursting towards the center focal point.',
    expressionCode: `// Speed Line Flashing
const f = (time * 24) % 1;
(Math.sin(time * 30) > 0) ? 100 : 20;`
  },
  {
    id: 'particle-spark-preset',
    title: 'Particle Burst Sparkles',
    folderCategory: 'Transitions > 2D Special Effects',
    categoryKey: '2d-special-effects',
    thumbnailType: 'particle-spark',
    displayText: 'SPARK BURST',
    subText: 'Radial Sparks',
    accentColor: '#f43f5e',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Eight-directional spark particle emitter that scatters and fades over 15 frames.',
    expressionCode: `// Particle Trajectory with Gravity
const angle = (index % 8) * (Math.PI / 4);
const speed = 400;
const t = time - inPoint;
const gravity = 500 * t * t;
[value[0] + Math.cos(angle) * speed * t, value[1] + Math.sin(angle) * speed * t + gravity];`
  },

  // ==========================================
  // TRANSITIONS > CAMERA
  // ==========================================
  {
    id: 'camera-zoom-push-preset',
    title: 'Dynamic Camera Zoom Push',
    folderCategory: 'Transitions > Camera',
    categoryKey: 'camera',
    thumbnailType: 'camera-zoom-push',
    displayText: 'ZOOM PUSH',
    subText: 'Target Warp',
    accentColor: '#6366f1',
    isFavorite: true,
    type: 'expression',
    targetProperty: 'Scale',
    description: 'Seamless warp zoom transition that catapults into the focal point with motion blur.',
    expressionCode: `// Dynamic Camera Crash Zoom
const t = time - inPoint;
const zoom = easeIn(t, 0, 0.4, 100, 350);
[zoom, zoom];`
  },
  {
    id: 'whip-pan-preset',
    title: 'Cinematic 3D Whip Pan Blur',
    folderCategory: 'Transitions > Camera',
    categoryKey: 'camera',
    thumbnailType: 'whip-pan',
    displayText: 'WHIP PAN',
    subText: 'Fast Blur Wipe',
    accentColor: '#0ea5e9',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'Hyper-fast camera pan with directional motion blur simulating an energetic whip cut.',
    expressionCode: `// Whip Pan Offset
const t = time - inPoint;
const panX = easeInOut(t, 0, 0.35, -thisComp.width, 0);
[value[0] + panX, value[1]];`
  },
  {
    id: 'camera-shake-preset',
    title: 'Handheld Cinematic Camera Shake',
    folderCategory: 'Transitions > Camera',
    categoryKey: 'camera',
    thumbnailType: 'camera-shake',
    displayText: 'CAMERA SHAKE',
    subText: 'Handheld Drift',
    accentColor: '#14b8a6',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'Realistic organic handheld camera drift with natural breathing frequency and micro-jitters.',
    expressionCode: `// Handheld Organic Shake
const freq1 = 1.2;
const amp1 = 18;
const freq2 = 4.5;
const amp2 = 6;
const w1 = wiggle(freq1, amp1);
const w2 = wiggle(freq2, amp2);
(w1 + w2) / 2;`
  },

  // ==========================================
  // TRANSITIONS > GLITCH
  // ==========================================
  {
    id: 'rgb-split-preset',
    title: 'RGB Chromatic Aberration Split',
    folderCategory: 'Transitions > Glitch',
    categoryKey: 'glitch',
    thumbnailType: 'rgb-split',
    displayText: 'RGB SPLIT',
    subText: 'Chromatic Shift',
    accentColor: '#ec4899',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Position',
    description: 'Splits Red, Green, and Blue color channels horizontally with intermittent strobe bursts.',
    expressionCode: `// Red Channel Offset
const glitchFreq = 8;
const isGlitching = Math.random() > 0.65;
if (isGlitching) {
  const shift = (Math.random() - 0.5) * 35;
  [value[0] + shift, value[1]];
} else {
  value;
}`
  },
  {
    id: 'scanline-crt-preset',
    title: 'CRT Scanline & Signal Drop',
    folderCategory: 'Transitions > Glitch',
    categoryKey: 'glitch',
    thumbnailType: 'scanline-crt',
    displayText: 'CRT SCANLINES',
    subText: 'Signal Drop',
    accentColor: '#10b981',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Opacity',
    description: 'Vintage 90s cathode ray tube horizontal scanlines with vertical sync roll.',
    expressionCode: `// CRT Scanline Flickering
const scanlineSpeed = 12;
const bar = Math.sin(time * scanlineSpeed) * 15;
85 + bar;`
  },
  {
    id: 'block-displacement-preset',
    title: 'Digital Block Displacement Artifacts',
    folderCategory: 'Transitions > Glitch',
    categoryKey: 'glitch',
    thumbnailType: 'block-displacement',
    displayText: 'BLOCK GLITCH',
    subText: 'Pixel Slice',
    accentColor: '#8b5cf6',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Position',
    description: 'Procedural digital block slicing that slices the image into staggered rectangular strips.',
    expressionCode: `// Block Displacement
const seed = Math.floor(time * 15);
seedRandom(seed, true);
(Math.random() > 0.7) ? [value[0] + (Math.random()-0.5)*50, value[1]] : value;`
  },

  // ==========================================
  // TRANSITIONS > HAND DRAWN
  // ==========================================
  {
    id: 'stop-motion-boil-preset',
    title: 'Stop Motion 12fps Line Boil',
    folderCategory: 'Transitions > Hand Drawn',
    categoryKey: 'hand-drawn',
    thumbnailType: 'stop-motion-boil',
    displayText: '12 FPS BOIL',
    subText: 'Stop Motion Jitter',
    accentColor: '#f59e0b',
    isFavorite: true,
    type: 'expression',
    targetProperty: 'Rotation',
    description: 'Postersized 12 frames-per-second wobbly organic line boil for hand-crafted indie animations.',
    expressionCode: `// 12fps Posterized Line Boil
const fps = 12;
posterizeTime(fps);
const boil = (Math.random() - 0.5) * 4;
value + boil;`
  },
  {
    id: 'wobbly-stroke-preset',
    title: 'Wobbly Hand-Drawn Stroke',
    folderCategory: 'Transitions > Hand Drawn',
    categoryKey: 'hand-drawn',
    thumbnailType: 'wobbly-stroke',
    displayText: 'WOBBLY STROKE',
    subText: 'Organic Outline',
    accentColor: '#e11d48',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Path',
    description: 'Hand-drawn sketched outlines with subtle organic breathing and rough contours.',
    expressionCode: `// Hand Sketched Wiggle
posterizeTime(8);
wiggle(6, 12);`
  },

  // ==========================================
  // TRANSITIONS > LIGHT LEAKS
  // ==========================================
  {
    id: 'sun-flare-leak-preset',
    title: 'Warm Golden Sun Flare Leak',
    folderCategory: 'Transitions > Light Leaks',
    categoryKey: 'light-leaks',
    thumbnailType: 'sun-flare-leak',
    displayText: 'GOLDEN FLARE',
    subText: 'Sun Bleed',
    accentColor: '#f59e0b',
    isFavorite: true,
    type: 'expression',
    targetProperty: 'Opacity',
    description: 'Dreamy 35mm film warm optical lens flare sweep that overexposes and washes across the screen.',
    expressionCode: `// Flare Sweep Intensity
const t = time - inPoint;
ease(t, 0, 0.4, 0, 100) - ease(t, 0.4, 0.8, 0, 100);`
  },
  {
    id: 'prism-streak-preset',
    title: 'Anamorphic Prism Optical Streak',
    folderCategory: 'Transitions > Light Leaks',
    categoryKey: 'light-leaks',
    thumbnailType: 'prism-streak',
    displayText: 'PRISM STREAK',
    subText: 'Anamorphic Blue',
    accentColor: '#06b6d4',
    isFavorite: false,
    type: 'expression',
    targetProperty: 'Scale',
    description: 'Horizontal sci-fi anamorphic blue optical streak that expands across the 2.39:1 widescreen frame.',
    expressionCode: `// Anamorphic Streak Scale
const t = time - inPoint;
const sx = easeOut(t, 0, 0.5, 0, 400);
const sy = easeOut(t, 0, 0.5, 10, 1);
[sx, sy];`
  },

  // ==========================================
  // TRANSITIONS > MATTE TRANSITIONS
  // ==========================================
  {
    id: 'diagonal-slice-preset',
    title: 'Diagonal Geometric Matte Slice',
    folderCategory: 'Transitions > Matte Transitions',
    categoryKey: 'matte-transitions',
    thumbnailType: 'diagonal-slice',
    displayText: 'DIAGONAL SLICE',
    subText: 'Angled Wipe',
    accentColor: '#a855f7',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: '45-degree angular knife slice transition separating outgoing and incoming footage.',
    expressionCode: `// 45-degree Matte Offset
const t = time - inPoint;
const p = easeInOut(t, 0, 0.5, -thisComp.width, 0);
[value[0] + p, value[1] + p * 0.5];`
  },
  {
    id: 'brush-paint-matte-preset',
    title: 'Paint Brush Stroke Matte Reveal',
    folderCategory: 'Transitions > Matte Transitions',
    categoryKey: 'matte-transitions',
    thumbnailType: 'brush-paint-matte',
    displayText: 'BRUSH MATTE',
    subText: 'Watercolor Stroke',
    accentColor: '#eab308',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Artistic textured watercolor brush sweep revealing the scene with soft feathered edges.',
    expressionCode: `// Brush Stroke Reveal
const t = time - inPoint;
const s = easeOut(t, 0, 0.6, 0, 120);
[s, 100];`
  },

  // ==========================================
  // TRANSITIONS > SHAPES
  // ==========================================
  {
    id: 'iris-circle-preset',
    title: 'Circle Iris Scale Wipe',
    folderCategory: 'Transitions > Shapes',
    categoryKey: 'shapes',
    thumbnailType: 'iris-circle',
    displayText: 'IRIS CIRCLE',
    subText: 'Radial Scale',
    accentColor: '#3b82f6',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Classic camera iris circular wipe that contracts to focal point or blossoms outward.',
    expressionCode: `// Iris Circle Scale
const t = time - inPoint;
const iris = easeOut(t, 0, 0.6, 0, 250);
[iris, iris];`
  },
  {
    id: 'stripe-swipe-preset',
    title: 'Multi-Band Stripe Swipe',
    folderCategory: 'Transitions > Shapes',
    categoryKey: 'shapes',
    thumbnailType: 'stripe-swipe',
    displayText: 'STRIPE SWIPE',
    subText: 'Cascading Bands',
    accentColor: '#10b981',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Position',
    description: 'Five cascading horizontal colored stripes that wipe the frame in staggered sequence.',
    expressionCode: `// Cascading Stripe
const bandIndex = index;
const delay = bandIndex * 0.05;
const t = time - inPoint - delay;
const x = easeInOut(t, 0, 0.45, -thisComp.width, 0);
[x, value[1]];`
  },

  // ==========================================
  // GRAPHIC COMPONENTS > AUTO-RIGS & LAYOUTS
  // ==========================================
  {
    id: 'grid-matrix-preset',
    title: '3x3 Sequenced Shape Grid',
    folderCategory: 'Graphic Components > Auto-Rigs & Layouts',
    categoryKey: 'auto-rigs',
    thumbnailType: 'grid-matrix',
    displayText: '3x3 MATRIX RIG',
    subText: 'Procedural Grid',
    accentColor: '#06b6d4',
    isFavorite: true,
    type: 'extendscript',
    description: 'Creates a 3x3 grid of shape layers centered in the comp that scale up sequentially with smooth ease.',
    extendScriptCode: `// AE Master: 3x3 Sequenced Shape Grid
(function() {
  app.beginUndoGroup("Create 3x3 Shape Grid");
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please select an active composition.");
    return;
  }
  var rows = 3, cols = 3, size = 120, gap = 40;
  var startX = comp.width/2 - ((cols*size + (cols-1)*gap)/2) + size/2;
  var startY = comp.height/2 - ((rows*size + (rows-1)*gap)/2) + size/2;
  var master = comp.layers.addNull();
  master.name = "GRID_CONTROLLER";

  var idx = 0;
  for (var r=0; r<rows; r++) {
    for (var c=0; c<cols; c++) {
      var shape = comp.layers.addShape();
      shape.name = "Cell_" + (r+1) + "_" + (c+1);
      shape.parent = master;
      var group = shape.property("ADOBE Root Vectors Group").addProperty("ADOBE Vector Group");
      var rect = group.property("ADOBE Vectors Group").addProperty("ADOBE Vector Shape - Rect");
      rect.property("ADOBE Vector Rect Size").setValue([size, size]);
      var fill = group.property("ADOBE Vectors Group").addProperty("ADOBE Vector Graphic - Fill");
      fill.property("ADOBE Vector Fill Color").setValue([0.08, 0.5, 0.95, 1]);
      shape.property("ADOBE Transform Group").property("ADOBE Position").setValue([startX + c*(size+gap), startY + r*(size+gap)]);
      var t = comp.time + idx * 0.08;
      shape.property("ADOBE Transform Group").property("ADOBE Scale").setValueAtTime(t, [0, 0]);
      shape.property("ADOBE Transform Group").property("ADOBE Scale").setValueAtTime(t + 0.45, [100, 100]);
      idx++;
    }
  }
  app.endUndoGroup();
})();`
  },
  {
    id: 'radial-array-preset',
    title: 'Radial Cloner & Orbital Array',
    folderCategory: 'Graphic Components > Auto-Rigs & Layouts',
    categoryKey: 'auto-rigs',
    thumbnailType: 'radial-array',
    displayText: 'RADIAL ARRAY',
    subText: '12-Node Orbital Ring',
    accentColor: '#f97316',
    isFavorite: false,
    type: 'extendscript',
    description: 'Procedurally arranges 12 elements in a circle with expressions linked to a central radius controller.',
    extendScriptCode: `// AE Master: Radial Cloner
(function() {
  app.beginUndoGroup("Create Radial Array");
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) return;
  var hub = comp.layers.addNull();
  hub.name = "RADIAL_HUB";
  var slider = hub.property("ADOBE Effect Parade").addProperty("ADOBE Slider Control");
  slider.name = "Radius";
  slider.property(1).setValue(260);
  for (var i = 0; i < 12; i++) {
    var angle = (i / 12) * 360;
    var shape = comp.layers.addShape();
    shape.name = "Node_" + (i + 1);
    shape.parent = hub;
    var grp = shape.property("ADOBE Root Vectors Group").addProperty("ADOBE Vector Group");
    var ell = grp.property("ADOBE Vectors Group").addProperty("ADOBE Vector Shape - Ellipse");
    ell.property("ADOBE Vector Ellipse Size").setValue([30, 30]);
    var fill = grp.property("ADOBE Vectors Group").addProperty("ADOBE Vector Graphic - Fill");
    fill.property("ADOBE Vector Fill Color").setValue([0.96, 0.45, 0.2, 1]);
    shape.property("ADOBE Transform Group").property("ADOBE Position").expression =
      "const r = thisComp.layer('RADIAL_HUB').effect('Radius')(1);\\n" +
      "const a = " + angle + " * Math.PI / 180;\\n" +
      "[thisComp.width/2 + Math.cos(a)*r, thisComp.height/2 + Math.sin(a)*r];";
  }
  app.endUndoGroup();
})();`
  },
  {
    id: 'lower-third-modern-rig',
    title: 'Responsive Lower Third Template Rig',
    folderCategory: 'Graphic Components > Auto-Rigs & Layouts',
    categoryKey: 'auto-rigs',
    thumbnailType: 'lower-third-modern',
    displayText: 'ALEXANDER CROSS\nLead Motion Technical Director',
    subText: 'Lower-Third Rig',
    accentColor: '#38bdf8',
    isFavorite: true,
    type: 'both',
    targetProperty: 'Path',
    description: 'Auto-sizing lower third with name, designation, and color accent bar driven by sourceRectAtTime.',
    expressionCode: `// Responsive Lower Third Box
const title = thisComp.layer("Name Text");
const subtitle = thisComp.layer("Title Text");
const r1 = title.sourceRectAtTime(time, false);
const r2 = subtitle.sourceRectAtTime(time, false);
const w = Math.max(r1.width, r2.width) + 80;
const h = r1.height + r2.height + 40;
[w, h];`
  },
  {
    id: 'sound-wave-bars-rig',
    title: 'Kinetic Audio Equalizer Wave Rig',
    folderCategory: 'Graphic Components > Auto-Rigs & Layouts',
    categoryKey: 'auto-rigs',
    thumbnailType: 'sound-wave-bars',
    displayText: 'AUDIO SPECTRUM',
    subText: '16-Band Visualizer',
    accentColor: '#a855f7',
    isFavorite: false,
    type: 'both',
    targetProperty: 'Scale',
    description: 'Procedural 16-bar frequency equalizer with simulated acoustic dynamics or audio keyframe binding.',
    expressionCode: `// Band Equalizer Pulse
const band = index;
const speed = 6 + (band % 4);
const bounce = Math.abs(Math.sin(time * speed + band));
[100, 20 + bounce * 180];`
  }
];
