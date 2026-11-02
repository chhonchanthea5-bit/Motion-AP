import { PresetItem } from '../types';

export const EXPRESSION_PRESETS: PresetItem[] = [
  {
    id: 'inertial-bounce',
    title: 'Inertial Bounce with Slider Controls',
    category: 'Kinetic Easing',
    description: 'Bouncy overshoot that triggers immediately after any keyframe stops. Reacts to Amp, Freq, and Decay sliders or defaults.',
    targetProperty: 'Scale',
    prompt: 'Give me a bouncy scale expression that reacts to a slider control, but stops bouncing after 2 seconds.',
    defaultCode: `// AE Master: Inertial Bounce with Duration Clamp
// Apply to: Scale (or Position / Rotation)
// Optional: Add Slider Controls named "Amp", "Freq", "Decay" to this layer or a "Null Controller"

const amp = hasEffect("Amp") ? effect("Amp")(1) / 100 : 0.08;
const freq = hasEffect("Freq") ? effect("Freq")(1) : 4.0;
const decay = hasEffect("Decay") ? effect("Decay")(1) : 6.0;
const maxDuration = 2.0; // stops bouncing after 2.0 seconds

function hasEffect(name) {
  return thisLayer.effect(name) != null;
}

let n = 0;
if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) {
    n--;
  }
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
      { name: 'Decay', min: 1, max: 15, default: 6, step: 0.5 },
    ]
  },
  {
    id: 'seamless-wiggle',
    title: 'Seamless Looping Wiggle',
    category: 'Loop & Noise',
    description: 'Perfect loop wiggle that seamlessly repeats every cycle without sudden snapping.',
    targetProperty: 'Position',
    prompt: 'Create a smooth seamless looping wiggle expression for Position that loops every 3 seconds.',
    defaultCode: `// AE Master: Seamless Looping Wiggle
// Apply to: Position or Rotation
const loopTime = 3.0; // Loop cycle in seconds
const freq = 1.5;
const amp = 40;

const t = time % loopTime;
const w1 = wiggle(freq, amp, 1, 0.5, t);
const w2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
ease(t, 0, loopTime, w1, w2);`,
    sliders: [
      { name: 'Freq', min: 0.5, max: 5, default: 1.5, step: 0.1, unit: 'Hz' },
      { name: 'Amp', min: 5, max: 100, default: 40, step: 1, unit: 'px' },
      { name: 'LoopTime', min: 1, max: 10, default: 3, step: 0.5, unit: 's' }
    ]
  },
  {
    id: 'dynamic-currency-counter',
    title: 'Dynamic Currency / Odometer Counter',
    category: 'Typography',
    description: 'Formats a Slider Control into a formatted currency string ($1,234.56) with commas and fixed decimals.',
    targetProperty: 'Source Text',
    prompt: 'Create an expression for Source Text that counts up like a currency counter with comma separators and a dollar sign linked to a slider.',
    defaultCode: `// AE Master: Dynamic Currency Counter
// Apply to: Text Layer > Source Text
// Add a Slider Control named "Count" to this layer or Null
const sliderVal = thisLayer.effect("Count") ? thisLayer.effect("Count")(1).value : time * 1250;
const prefix = "$";
const decimals = 2;

function formatWithCommas(n) {
  const parts = n.toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
  return parts.join(".");
}

prefix + formatWithCommas(Math.max(0, sliderVal));`,
    sliders: [
      { name: 'Count', min: 0, max: 100000, default: 14850, step: 50, unit: '$' }
    ]
  },
  {
    id: 'auto-resize-box',
    title: 'Auto-Resize Background Box (sourceRectAtTime)',
    category: 'Layout & Box',
    description: 'Automatically matches the size and position of a target text layer with customizable padding.',
    targetProperty: 'Path',
    prompt: 'Write an expression for a shape layer rectangle size and position that automatically adapts to a text layer using sourceRectAtTime with padding.',
    defaultCode: `// AE Master: Responsive Box Size
// Apply to: Shape Layer > Contents > Rectangle 1 > Rectangle Path 1 > Size
// Link to layer named "Title" (or change layer name below)
const targetLayer = thisComp.layer("Title");
const padX = 60;
const padY = 30;

const rect = targetLayer.sourceRectAtTime(time, false);
[rect.width + padX * 2, rect.height + padY * 2];

// Apply to Shape Layer > Contents > Rectangle 1 > Transform > Position:
// const rect = thisComp.layer("Title").sourceRectAtTime(time, false);
// [rect.left + rect.width / 2, rect.top + rect.height / 2];`
  },
  {
    id: 'audio-reactive-pulse',
    title: 'Audio Amplitude Reactive Pulse',
    category: 'Audio Reactive',
    description: 'Pumps scale or glow in sync with an Audio Amplitude layer with smoothing and minimum baseline.',
    targetProperty: 'Scale',
    prompt: 'Create an audio reactive scale pulse expression that links to Audio Amplitude "Both Channels" with smooth decay and baseline.',
    defaultCode: `// AE Master: Audio Reactive Scale Pulse
// Apply to: Scale
// Requires layer "Audio Amplitude" (Animation > Keyframe Assistant > Convert Audio to Keyframes)
const baseScale = [100, 100];
const maxMultiplier = 0.8; // scale boost factor
let audioLevel = 0;

try {
  audioLevel = thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider").value;
} catch (e) {
  // Fallback demo sine wave if audio layer is missing
  audioLevel = Math.max(0, Math.sin(time * 8)) * 25;
}

const pulse = (audioLevel * maxMultiplier);
[baseScale[0] + pulse, baseScale[1] + pulse];`
  }
];

export const RIGGING_PRESETS: PresetItem[] = [
  {
    id: 'grid-matrix-3x3',
    title: '3x3 Shape Grid Matrix with Staggered Scale-Up',
    category: 'Procedural Grid',
    description: 'Generates 9 shape layers centered in the active comp, distributed in a 3x3 grid with staggered keyframes.',
    prompt: 'Create a 3x3 grid of shape layers that scale up sequentially.',
    defaultCode: `// AE Master ExtendScript: 3x3 Sequenced Shape Grid
(function() {
  app.beginUndoGroup("AE Master: Create 3x3 Shape Grid");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      alert("AE Master: Please open or select an active composition first.");
      return;
    }

    var rows = 3;
    var cols = 3;
    var shapeSize = 120;
    var gap = 40;
    var centerX = comp.width / 2;
    var centerY = comp.height / 2;
    var totalW = (cols * shapeSize) + ((cols - 1) * gap);
    var totalH = (rows * shapeSize) + ((rows - 1) * gap);
    var startX = centerX - (totalW / 2) + (shapeSize / 2);
    var startY = centerY - (totalH / 2) + (shapeSize / 2);

    var masterNull = comp.layers.addNull();
    masterNull.name = "GRID_CONTROLLER";
    masterNull.label = 13; // Yellow

    var index = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var posX = startX + (c * (shapeSize + gap));
        var posY = startY + (r * (shapeSize + gap));

        var shape = comp.layers.addShape();
        shape.name = "Grid_Cell_" + (r + 1) + "_" + (c + 1);
        shape.parent = masterNull;

        // Add contents
        var shapeGroup = shape.property("ADOBE Root Vectors Group").addProperty("ADOBE Vector Group");
        var rectPath = shapeGroup.property("ADOBE Vectors Group").addProperty("ADOBE Vector Shape - Rect");
        rectPath.property("ADOBE Vector Rect Size").setValue([shapeSize, shapeSize]);
        rectPath.property("ADOBE Vector Rect Roundness").setValue(24);

        var fill = shapeGroup.property("ADOBE Vectors Group").addProperty("ADOBE Vector Graphic - Fill");
        fill.property("ADOBE Vector Fill Color").setValue([0.08, 0.45, 0.95, 1]); // Modern blue

        // Set position & keyframe scale
        shape.property("ADOBE Transform Group").property("ADOBE Position").setValue([posX, posY]);

        var scaleProp = shape.property("ADOBE Transform Group").property("ADOBE Scale");
        var startTime = comp.time + (index * 0.08); // 80ms stagger
        scaleProp.setValueAtTime(startTime, [0, 0]);
        scaleProp.setValueAtTime(startTime + 0.5, [100, 100]);
        
        // Apply smooth ease
        var easeIn = new KeyframeEase(0, 75);
        var easeOut = new KeyframeEase(0, 75);
        scaleProp.setTemporalEaseAtKey(1, [easeIn, easeIn], [easeOut, easeOut]);
        scaleProp.setTemporalEaseAtKey(2, [easeIn, easeIn], [easeOut, easeOut]);

        shape.label = 9; // Blue
        index++;
      }
    }
  } catch(err) {
    alert("AE Master Error: " + err.toString());
  } finally {
    app.endUndoGroup();
  }
})();`
  },
  {
    id: 'kinetic-type-animator',
    title: 'Kinetic Typography Wave Rig',
    category: 'Kinetic Typography',
    description: 'Creates a stylized kinetic text layer with a character-by-character position & opacity wave animator.',
    prompt: 'Create an ExtendScript script that adds a kinetic typography text layer with a smooth wave text animator and range selector.',
    defaultCode: `// AE Master ExtendScript: Kinetic Typography Wave Rig
(function() {
  app.beginUndoGroup("AE Master: Kinetic Type Wave");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      alert("Please select an active composition.");
      return;
    }

    var textLayer = comp.layers.addText("KINETIC MOTION");
    textLayer.property("ADOBE Transform Group").property("ADOBE Position").setValue([comp.width / 2, comp.height / 2]);
    textLayer.label = 11; // Purple

    // Add Animator
    var animators = textLayer.property("ADOBE Text Properties").property("ADOBE Text Animators");
    var anim1 = animators.addProperty("ADOBE Text Animator");
    anim1.name = "Kinetic Wave";

    // Add Position & Opacity properties
    var props = anim1.property("ADOBE Text Animator Properties");
    var posProp = props.addProperty("ADOBE Text Position 3D");
    posProp.setValue([0, 120, 0]);

    var opacProp = props.addProperty("ADOBE Text Opacity");
    opacProp.setValue(0);

    // Range Selector
    var selector = anim1.property("ADOBE Text Selectors").property("ADOBE Text Selector");
    var startProp = selector.property("ADOBE Text Percent Start");
    var endProp = selector.property("ADOBE Text Percent End");
    var offsetProp = selector.property("ADOBE Text Track Offset");

    offsetProp.setValueAtTime(comp.time, -100);
    offsetProp.setValueAtTime(comp.time + 1.2, 100);

    var advanced = selector.property("ADOBE Text Range Advanced");
    advanced.property("ADOBE Text Shape").setValue(2); // Ramp Up
    advanced.property("ADOBE Text Ease High").setValue(60);
    advanced.property("ADOBE Text Ease Low").setValue(60);

  } catch(err) {
    alert("Error: " + err.message);
  } finally {
    app.endUndoGroup();
  }
})();`
  },
  {
    id: 'radial-array-rig',
    title: 'Radial Cloner & Orbital Array',
    category: 'Procedural Layout',
    description: 'Instantiates N copies in a perfect circle around the center with automatic rotation tangents pointing outwards.',
    prompt: 'Write an ExtendScript script to arrange selected layers or new shape layers in a radial circle with radius slider controller.',
    defaultCode: `// AE Master ExtendScript: Radial Circle Array
(function() {
  app.beginUndoGroup("AE Master: Radial Array");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      alert("Select an active composition.");
      return;
    }

    var count = 12;
    var radius = 260;
    var center = [comp.width / 2, comp.height / 2];

    var controller = comp.layers.addNull();
    controller.name = "RADIAL_HUB";
    var radiusSlider = controller.property("ADOBE Effect Parade").addProperty("ADOBE Slider Control");
    radiusSlider.name = "Radius";
    radiusSlider.property("ADOBE Slider Control-0001").setValue(radius);

    for (var i = 0; i < count; i++) {
      var angleDeg = (i / count) * 360;
      var shape = comp.layers.addShape();
      shape.name = "Radial_Node_" + (i + 1);
      shape.parent = controller;

      var shapeGroup = shape.property("ADOBE Root Vectors Group").addProperty("ADOBE Vector Group");
      var circle = shapeGroup.property("ADOBE Vectors Group").addProperty("ADOBE Vector Shape - Ellipse");
      circle.property("ADOBE Vector Ellipse Size").setValue([32, 32]);

      var fill = shapeGroup.property("ADOBE Vectors Group").addProperty("ADOBE Vector Graphic - Fill");
      fill.property("ADOBE Vector Fill Color").setValue([0.96, 0.45, 0.2, 1]); // Neon orange

      // Position & Rotation expression linking to hub
      var posExpr = "const hub = thisComp.layer('" + controller.name + "');\\n" +
                    "const r = hub.effect('Radius')(1);\\n" +
                    "const angle = " + angleDeg + " * (Math.PI / 180);\\n" +
                    "[" + center[0] + " + Math.cos(angle) * r, " + center[1] + " + Math.sin(angle) * r];";
      shape.property("ADOBE Transform Group").property("ADOBE Position").expression = posExpr;
      shape.property("ADOBE Transform Group").property("ADOBE Rotation").setValue(angleDeg + 90);
    }
  } catch(e) {
    alert(e.toString());
  } finally {
    app.endUndoGroup();
  }
})();`
  }
];

export const TIMELINE_PRESETS: PresetItem[] = [
  {
    id: 'stagger-offsets',
    title: 'Stagger Selected Layers by X Frames',
    category: 'Sequencing',
    description: 'Sequences in-points of all selected layers by a customizable frame offset in top-to-bottom or bottom-to-top order.',
    prompt: 'Create an ExtendScript script that staggers the in-points of selected layers by 5 frames.',
    defaultCode: `// AE Master ExtendScript: Stagger Layer In-Points
(function() {
  app.beginUndoGroup("AE Master: Stagger Layers");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      alert("Please select a composition.");
      return;
    }
    var sel = comp.selectedLayers;
    if (sel.length === 0) {
      alert("Please select at least 2 layers to stagger.");
      return;
    }

    var frameOffset = 4; // Stagger offset in frames
    var offsetSec = frameOffset * comp.frameDuration;
    var baseTime = sel[0].startTime;

    for (var i = 0; i < sel.length; i++) {
      sel[i].startTime = baseTime + (i * offsetSec);
    }
  } catch(e) {
    alert(e.toString());
  } finally {
    app.endUndoGroup();
  }
})();`
  },
  {
    id: 'batch-layer-renamer',
    title: 'Batch Regex Renamer with Zero-Padded Index',
    category: 'Renaming & Hygiene',
    description: 'Renames selected layers with a clean prefix, search/replace, and zero-padded indices (e.g. Asset_01, Asset_02).',
    prompt: 'Create an ExtendScript script that renames selected layers using a prefix and zero-padded numbers.',
    defaultCode: `// AE Master ExtendScript: Batch Layer Renamer
(function() {
  app.beginUndoGroup("AE Master: Batch Rename");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return;

    var sel = comp.selectedLayers;
    if (sel.length === 0) {
      alert("Select layers to rename.");
      return;
    }

    var prefix = "Element_";
    for (var i = 0; i < sel.length; i++) {
      var numStr = (i + 1 < 10) ? ("0" + (i + 1)) : (i + 1);
      sel[i].name = prefix + numStr;
    }
  } finally {
    app.endUndoGroup();
  }
})();`
  },
  {
    id: 'color-code-layers',
    title: 'Auto Color-Code Layers by Type',
    category: 'Layer Organization',
    description: 'Inspects layer types across the comp and applies standard studio label colors (Text=Purple, Shape=Cyan, Null=Yellow, Camera=Peach).',
    prompt: 'Write an ExtendScript script that color-codes layers in the active comp based on their layer type.',
    defaultCode: `// AE Master ExtendScript: Auto Color-Code Layers by Type
(function() {
  app.beginUndoGroup("AE Master: Color Code Layers");
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return;

    for (var i = 1; i <= comp.numLayers; i++) {
      var layer = comp.layer(i);
      if (layer.nullLayer) {
        layer.label = 13; // Yellow
      } else if (layer instanceof TextLayer) {
        layer.label = 11; // Purple
      } else if (layer instanceof ShapeLayer) {
        layer.label = 9;  // Cyan / Blue
      } else if (layer instanceof CameraLayer) {
        layer.label = 4;  // Peach
      } else if (layer instanceof LightLayer) {
        layer.label = 6;  // Warm Brown
      } else if (layer.hasAudio && !layer.hasVideo) {
        layer.label = 7;  // Green (Audio)
      } else {
        layer.label = 14; // Lavender
      }
    }
  } finally {
    app.endUndoGroup();
  }
})();`
  }
];

export const MATH_PRESETS: PresetItem[] = [
  {
    id: 'lissajous-curve',
    title: 'Parametric Lissajous Motion Curve',
    category: 'Trigonometry & Paths',
    description: 'Generates harmonically complex 3D figure-8 motion patterns using coupled sinusoidal frequencies.',
    targetProperty: 'Position',
    prompt: 'Write an After Effects expression for Position that creates a smooth Lissajous figure-8 curve with adjustable frequency ratios.',
    defaultCode: `// AE Master: Lissajous Harmonic Motion Path
// Apply to: Position (2D or 3D)
const center = [thisComp.width / 2, thisComp.height / 2];
const ampX = 280;
const ampY = 160;
const freqX = 1.0;
const freqY = 2.0;
const phase = Math.PI / 2;

const x = center[0] + ampX * Math.sin(time * freqX * 2 * Math.PI + phase);
const y = center[1] + ampY * Math.sin(time * freqY * 2 * Math.PI);

[x, y];`,
    sliders: [
      { name: 'AmpX', min: 50, max: 500, default: 280, step: 10, unit: 'px' },
      { name: 'AmpY', min: 50, max: 500, default: 160, step: 10, unit: 'px' },
      { name: 'FreqRatio', min: 0.5, max: 4, default: 2.0, step: 0.5 }
    ]
  },
  {
    id: 'golden-spiral',
    title: 'Fibonacci Golden Ratio Growth Path',
    category: 'Sacred Geometry',
    description: 'Calculates logarithmic expansion using the golden angle (137.5077°) and phi (1.618).',
    targetProperty: 'Position',
    prompt: 'Create a mathematical expression that places or moves a layer along a logarithmic Fibonacci golden spiral.',
    defaultCode: `// AE Master: Logarithmic Golden Spiral Path
// Apply to: Position
const center = [thisComp.width / 2, thisComp.height / 2];
const goldenAngle = 137.5077 * (Math.PI / 180);
const growth = 35; // expansion speed

const theta = time * 2;
const r = growth * Math.sqrt(theta * 10);

const x = center[0] + r * Math.cos(theta);
const y = center[1] + r * Math.sin(theta);
[x, y];`
  }
];

export const ERROR_DIAGNOSTICS_PRESETS = [
  {
    id: 'prop-missing',
    title: '"Property is missing or does not exist"',
    errorMsg: 'After Effects warning: Class "Property" has no property or method named "ADOBE Opacity" (or layer "Title" does not exist)',
    brokenCode: `// User code causing error:
const box = thisComp.layer("BoundingBox");
const t = box.transform.position.value;
const pad = effect("Padding")(1);`,
    diagnosis: '1. `thisComp.layer("BoundingBox")` throws a fatal error if the layer does not exist in the active composition.\n2. In the Modern JavaScript expression engine, missing effect or layer lookups immediately crash expression evaluation.\n3. Safe optional chaining (`?.`) or `hasEffect` guard check is required.',
    solutionPrompt: 'Fix this expression that throws "property is missing or does not exist" error: make layer lookups defensive and add fallback coordinates if target is missing.'
  },
  {
    id: 'numeric-overflow',
    title: '"Invalid numeric result (divide by zero or NaN)"',
    errorMsg: 'After Effects warning: Expression resulted in an invalid numeric value (NaN or Infinity)',
    brokenCode: `// User code causing NaN:
const decay = effect("Decay")(1);
const t = time - key(1).time;
const bounce = Math.sin(t * 10) / Math.exp(decay * t);
value + bounce;`,
    diagnosis: 'When `time < key(1).time`, `t` is negative. `Math.exp(decay * t)` can produce division anomalies, or if `numKeys == 0`, accessing `key(1)` fails completely.',
    solutionPrompt: 'Fix this inertial bounce expression that results in NaN when the playhead is before the first keyframe.'
  },
  {
    id: 'active-item-null',
    title: '"ReferenceError: app.project.activeItem is null"',
    errorMsg: 'ExtendScript Error: Cannot read property "layers" of null / activeItem is undefined',
    brokenCode: `// Script without safety check:
var comp = app.project.activeItem;
var layer = comp.layers.addShape();`,
    diagnosis: 'ExtendScript requires validating `app.project`, `app.project.activeItem`, and ensuring `activeItem instanceof CompItem` before accessing `.layers` or properties.',
    solutionPrompt: 'Wrap this ExtendScript snippet with professional error handling and comp type validation.'
  }
];
