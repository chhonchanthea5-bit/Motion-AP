import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const SYSTEM_PROMPT = `Role & Objective: You are an elite Motion Graphics Technical Director and Senior Adobe After Effects Scripter. Your job is to act as the core intelligence for an all-in-one After Effects assistant plugin. You generate clean, optimized, and error-free ExtendScript (JSX) code, expressions, and workflow automation scripts tailored specifically for motion designers.

Core Capabilities You Provide:
1. Expression Generation: Write robust expressions for looping (loopOut()), easing, inertial bounce, wiggle dampening, dynamic text counting, auto-sizing bounding boxes (sourceRectAtTime), and parent-child linking.
2. Automated Layouts & Rigging: Create scripts that instantly auto-rig shapes, generate grid layouts, set up kinetic typography controllers, or build lower-third templates from scratch.
3. Timeline & Layer Management: Code utilities to color-code layers, sequence layers with staggered offsets, rename layers with regex, and manage render queue presets.
4. Math & Geometry Helpers: Solve complex trigonometry or vector math problems for motion paths, radial arrays, and particle-like effects using native shape layers.

Rules for Output:
- When the user asks for an automated tool/action, provide valid ExtendScript (JSX) wrapped in a clean code block (\`\`\`javascript or \`\`\`jsx) that can be executed directly via app.executeCommand(), evaluated via BridgeTalk, or run directly via File > Scripts > Run Script File. Always wrap in an undo group: \`app.beginUndoGroup("Action Name"); ... app.endUndoGroup();\` and check \`if (!app.project || !app.project.activeItem || !(app.project.activeItem instanceof CompItem)) { alert("Please select an active composition."); return; }\`.
- When the user asks for property behavior, provide clean, modern After Effects JavaScript Expressions with comments explaining how to hook them up to slider controls and which property (Scale, Position, Opacity, Rotation, Source Text, etc.) they belong to.
- Always prioritize performance (avoid heavy loops in expressions where possible, cache sourceRectAtTime when possible, avoid recursive calls).
- Keep your tone professional, concise, and deeply knowledgeable about After Effects terminology (comp, layer, property group, keyframe interpolation, temporal/spatial tangents, master properties, shape contents, ADOBE expression engine).
- In addition to the code, provide a brief "How to apply in AE" instruction (e.g. Alt/Option + Click stopwatch, or ScriptUI execution).`;

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Retry helper with fallback models for high demand spikes
async function generateContentWithRetry(ai: GoogleGenAI, fullPrompt: string) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        return { text: response.text ?? '', model };
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || '';
        // If 503 high demand or 429, wait and retry
        if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('429')) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        // If other error, break to next model
        break;
      }
    }
  }

  throw lastError;
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// Non-streaming generation endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, category, contextCode, aeVersion } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGeminiClient();

    let fullPrompt = prompt;
    if (category) {
      fullPrompt = `[Category: ${category}] [Target AE Engine: Modern JavaScript Engine (AE 2020-2026)]\n${prompt}`;
    }
    if (contextCode) {
      fullPrompt += `\n\nExisting Code / Broken Expression Context:\n\`\`\`\n${contextCode}\n\`\`\``;
    }
    if (aeVersion) {
      fullPrompt += `\nTarget AE Version: ${aeVersion}`;
    }

    const { text, model } = await generateContentWithRetry(ai, fullPrompt);

    res.json({
      result: text,
      model,
    });
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    let parsedMessage = error?.message || 'Failed to generate response';
    try {
      const parsed = JSON.parse(parsedMessage);
      if (parsed?.error?.message) parsedMessage = parsed.error.message;
    } catch (_) {}

    res.status(500).json({
      error: parsedMessage,
    });
  }
});

// Streaming generation endpoint via Server-Sent Events (SSE)
app.post('/api/generate/stream', async (req: Request, res: Response) => {
  try {
    const { prompt, category, contextCode, aeVersion } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGeminiClient();

    let fullPrompt = prompt;
    if (category) {
      fullPrompt = `[Category: ${category}] [Target AE Engine: Modern JavaScript Engine (AE 2020-2026)]\n${prompt}`;
    }
    if (contextCode) {
      fullPrompt += `\n\nExisting Code / Broken Expression Context:\n\`\`\`\n${contextCode}\n\`\`\``;
    }
    if (aeVersion) {
      fullPrompt += `\nTarget AE Version: ${aeVersion}`;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let streamResponse = null;
    try {
      streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
    } catch (err: any) {
      // Fallback model if initial stream initiation hits transient 503
      console.warn('Primary model hit temporary demand spike, switching to gemini-flash-latest');
      streamResponse = await ai.models.generateContentStream({
        model: 'gemini-flash-latest',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
    }

    for await (const chunk of streamResponse) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Gemini streaming error:', error);
    let parsedMessage = error?.message || 'Stream error occurred';
    try {
      const parsed = JSON.parse(parsedMessage);
      if (parsed?.error?.message) parsedMessage = parsed.error.message;
    } catch (_) {}

    if (!res.headersSent) {
      res.status(500).json({ error: parsedMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: parsedMessage })}\n\n`);
      res.end();
    }
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AE Master Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
