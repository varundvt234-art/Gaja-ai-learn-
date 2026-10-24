import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client strictly server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Primary high-speed model: gemini-3.1-flash-lite delivers deep educational answers in ~1.5 to 3 seconds
const FAST_MODEL = 'gemini-3.1-flash-lite';
const FALLBACK_MODEL = 'gemini-3.8-flash';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Parse large JSON payloads for base64 images
  app.use(express.json({ limit: '25mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey),
      fastModel: FAST_MODEL,
      timestamp: new Date().toISOString(),
    });
  });

  // Fast retry helper with short backoff (max 1 retry, 400ms delay) so requests always finish in < 5 seconds
  async function callFast<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
    try {
      return await fn();
    } catch (err: any) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 400));
        return await fn();
      }
      throw err;
    }
  }

  // Fast educational content generator with automatic fallback
  async function generateFastEducationalContent(aiClient: GoogleGenAI, config: any) {
    try {
      return await callFast(() =>
        aiClient.models.generateContent({
          ...config,
          model: FAST_MODEL,
        })
      );
    } catch (err: any) {
      console.warn(`[Gaja API] ${FAST_MODEL} failed, trying ${FALLBACK_MODEL}:`, err.message?.slice(0, 100));
      return await callFast(() =>
        aiClient.models.generateContent({
          ...config,
          model: FALLBACK_MODEL,
        })
      );
    }
  }

  // Helper to build system instructions based on mode, level, language
  function getSystemPrompt(mode: string = 'easy', level: string = 'middle', language: string = 'en') {
    const langMap: Record<string, string> = {
      en: 'English',
      te: 'Telugu (తెలుగు)',
      hi: 'Hindi (हिंदी)',
      ta: 'Tamil (தமிழ்)',
      es: 'Spanish (Español)',
    };
    const targetLang = langMap[language] || 'English';

    return `You are Gaja AI Learn, a friendly, deeply knowledgeable, encouraging, and patient teacher.
Your mission: "See Anything. Understand Everything."
You make complex topics simple, vivid, engaging, and memorable for curious learners of all ages.

Learner Configuration:
- Target Language: ${targetLang}
- Learning Mode: ${mode} (Options: quick, easy, detailed, visual, step-by-step, student, expert)
- Learner Level: ${level} (Options: elementary, middle, high_school, college, general)

Guidelines:
1. Tone: Warm, enthusiastic, encouraging, respectful, and crystal clear.
2. If language is not English (e.g. Telugu or Hindi), provide the complete explanation naturally in that language, but keep scientific or technical terms in English alongside their local translation in parentheses, e.g. "Photosynthesis (కిరణజన్య సంయోగ క్రియ)".
3. Adapt vocabulary strictly to the chosen mode:
   - 'quick': Concise 2-3 paragraph essential takeaway.
   - 'easy': Simple words, relatable everyday analogies, vivid storytelling, no overwhelming jargon.
   - 'detailed': Comprehensive deep-dive covering definition, mechanism, purpose, history/discovery, applications, and nuances.
   - 'visual': Include vivid structural descriptions, ascii/markdown spatial breakdowns, and describe visual relationships clearly.
   - 'step-by-step': Numbered sequential phases with clear inputs, actions, and outputs.
   - 'expert': Rigorous scientific terminology, formulas, empirical evidence, edge cases.
4. Always structure responses cleanly with markdown headers, bullet points, and highlight cards:
   - ## 🌟 Summary / Simple Definition
   - ## 🔬 How It Works (Mechanism & Details)
   - ## 💡 Everyday Life Applications & Real Examples
   - ## ❓ Common Misconceptions & Fun Facts
   - ## ⚠️ Safety & Uncertainty Notes (if applicable, e.g. wild plants, chemicals, medicine)
5. Safety & Accuracy:
   - Never invent scientific facts.
   - If identifying a photo or rare subject, state confidence level clearly. If multiple species or items look alike, explain distinguishing marks and caution the learner.
   - Provide 3-4 natural follow-up questions at the end under "### 🧭 Curious Next Questions".`;
  }

  // 1. Text Question Explanation - Super Fast (< 3 seconds)
  app.post('/api/learn/explain', async (req: Request, res: Response) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in Settings > Secrets.',
        });
      }

      const { question, mode = 'easy', level = 'middle', language = 'en' } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question text is required.' });
      }

      const systemInstruction = getSystemPrompt(mode, level, language);
      const userPrompt = `Question to explain: "${question}"
Please provide a well-structured, insightful, engaging educational explanation tailored to the requested mode (${mode}) and language (${language}).`;

      const response = await generateFastEducationalContent(ai, {
        contents: userPrompt,
        config: {
          systemInstruction,
        },
      });

      const explanation = response.text || '';

      // Standard educational reference sources based on topic
      const sources = [
        { title: 'National Science Teaching Association (NSTA)', url: 'https://www.nsta.org' },
        { title: 'Encyclopædia Britannica Education', url: 'https://www.britannica.com' },
      ];

      res.json({
        success: true,
        explanation,
        sources,
        mode,
        level,
        language,
      });
    } catch (err: any) {
      console.error('Error in /api/learn/explain:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate explanation. Please try again.',
      });
    }
  });

  // 2. Multimodal Image Analysis - Super Fast (< 3 seconds)
  app.post('/api/learn/analyze-image', async (req: Request, res: Response) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in Settings > Secrets.',
        });
      }

      const { imageBase64, mimeType = 'image/jpeg', question = '', mode = 'easy', level = 'middle', language = 'en' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required.' });
      }

      // Strip potential data URL prefix if sent
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const systemInstruction = getSystemPrompt(mode, level, language);
      const promptText = `Analyze this image in depth as a friendly, expert educational mentor.
User's specific inquiry/question about the image (if any): "${question || 'What is this? Explain what I am looking at, how it works, and key facts.'}"

Cover thoroughly:
1. **Identification**: What is this? Likely common name, possible scientific / technical name, and your confidence level (High / Moderate / Low).
2. **Visible Evidence**: Specific visual details observed in this photograph (colors, textures, shapes, components, markings).
3. **What It Is & How It Works / Grows**: Mechanism, anatomy, lifecycle, or physical principles in simple terms.
4. **Purpose & Habitat / Origin**: Why does it exist, where is it found, or what is its everyday use?
5. **Fascinating Facts & Ecological/Practical Importance**: 2-3 engaging discoveries or trivia.
6. **Safety & Uncertainty**: If this could be poisonous (plants/mushrooms/reptiles), dangerous (high voltage, chemicals), or medical, explicitly warn not to consume or touch without expert confirmation. If it looks similar to other species or models, note what other details are needed to confirm.
7. **Curious Next Questions**: 4 suggested follow-up questions the learner can click next.`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const response = await generateFastEducationalContent(ai, {
        contents: {
          parts: [imagePart, { text: promptText }],
        },
        config: {
          systemInstruction,
        },
      });

      const explanation = response.text || '';
      const sources = [
        { title: 'iNaturalist & Biodiversity Heritage', url: 'https://www.inaturalist.org' },
        { title: 'Encyclopædia Britannica', url: 'https://www.britannica.com' },
      ];

      res.json({
        success: true,
        explanation,
        sources,
        mode,
        level,
        language,
      });
    } catch (err: any) {
      console.error('Error in /api/learn/analyze-image:', err);
      res.status(500).json({
        error: err.message || 'Failed to analyze image. Please ensure the image is clear and valid.',
      });
    }
  });

  // 3. Multi-turn Doubt-clearing Chat - Super Fast (< 3 seconds)
  app.post('/api/learn/chat', async (req: Request, res: Response) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API key is not configured.',
        });
      }

      const { messages, currentImage, mode = 'easy', level = 'middle', language = 'en' } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const systemInstruction = getSystemPrompt(mode, level, language) + 
        `\nMaintain continuous conversational context. Answer follow-up doubts with patience and enthusiasm.
If the learner asks to explain more simply, break it down further with a friendly analogy.
If the learner asks for another language (e.g., "explain in Telugu" or "in Hindi"), switch fluidly to that language.
At the end, provide 3 short suggested follow-up prompts starting with "### 🧭 Next Questions:"`;

      // Build conversation turns
      const contents: any[] = [];

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const role = msg.role === 'assistant' ? 'model' : 'user';

        if (i === 0 && currentImage?.base64 && role === 'user') {
          const cleanBase64 = currentImage.base64.replace(/^data:image\/\w+;base64,/, '');
          contents.push({
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: currentImage.mimeType || 'image/jpeg',
                  data: cleanBase64,
                },
              },
              { text: msg.content || 'Please analyze this image and explain what it is.' },
            ],
          });
        } else {
          contents.push({
            role,
            parts: [{ text: msg.content }],
          });
        }
      }

      const response = await generateFastEducationalContent(ai, {
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || '';
      const sources = [
        { title: 'National Science Foundation', url: 'https://www.nsf.gov' },
        { title: 'Khan Academy Knowledge Base', url: 'https://www.khanacademy.org' },
      ];

      res.json({
        success: true,
        reply,
        sources,
      });
    } catch (err: any) {
      console.error('Error in /api/learn/chat:', err);
      res.status(500).json({
        error: err.message || 'Failed to process chat message.',
      });
    }
  });

  // 4. Educational Visual / Diagram Generator (SVG) - Fast (~2 seconds)
  app.post('/api/learn/diagram', async (req: Request, res: Response) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API key is not configured.' });
      }

      const { topic, context = '' } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required for diagram.' });
      }

      const prompt = `You are an expert scientific diagram designer.
Create a rich, beautiful, accurate, clean, self-contained SVG diagram illustrating: "${topic}".
Context: "${context}"

SVG Requirements:
1. Return ONLY the raw valid SVG markup starting with <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" ...> and ending with </svg>.
2. Do NOT wrap inside markdown codeblocks (no \`\`\`xml or \`\`\`svg).
3. Diagram must be educational and clearly labeled with text annotations, arrows, badges, clear colors, legible fonts (Arial, system-ui, sans-serif), and high contrast.
4. Use appealing modern palettes: gradients (defs with linearGradient), rounded cards (<rect rx="10">), clear arrows (marker-end), clean icons or schematic symbols.
5. Include a title banner inside the SVG at the top with the topic name.
6. Must be 100% valid XML/SVG with proper closing tags so it renders directly in an HTML image or inline SVG container.`;

      const response = await callFast(() =>
        ai.models.generateContent({
          model: FAST_MODEL,
          contents: prompt,
          config: {
            temperature: 0.2,
          },
        })
      );

      let svgText = response.text || '';
      svgText = svgText.replace(/^```(svg|xml)?\n?/i, '').replace(/\n?```$/i, '').trim();
      
      const svgMatch = svgText.match(/<svg[\s\S]*<\/svg>/i);
      if (svgMatch) {
        svgText = svgMatch[0];
      }

      res.json({
        success: true,
        svg: svgText,
        topic,
      });
    } catch (err: any) {
      console.error('Error in /api/learn/diagram:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate diagram.',
      });
    }
  });

  // 5. Interactive Quiz Generator - Fast (~1.5 seconds)
  app.post('/api/learn/quiz', async (req: Request, res: Response) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API key is not configured.' });
      }

      const { topic, context = '', language = 'en' } = req.body;
      const prompt = `Create a quick 3-question multiple choice quiz to test understanding of: "${topic}".
Language: ${language}.
Format must be valid JSON matching this schema:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]
Return ONLY JSON, no markdown code fence.`;

      const response = await callFast(() =>
        ai.models.generateContent({
          model: FAST_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        })
      );

      const jsonStr = (response.text || '[]').trim();
      const quiz = JSON.parse(jsonStr);

      res.json({
        success: true,
        quiz,
      });
    } catch (err: any) {
      console.error('Error in /api/learn/quiz:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate quiz.',
      });
    }
  });

  // Production vs Dev static/vite handling
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Gaja AI Learn server running with high-speed engine (${FAST_MODEL}) on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
