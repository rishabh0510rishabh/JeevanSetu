import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body limits for base64 camera image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Lazy Google GenAI initialization with error handling
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'jeevansetu',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    hasEmergencyWebhook: !!process.env.EMERGENCY_WEBHOOK_URL,
    isDemoWebhook: !process.env.EMERGENCY_WEBHOOK_URL,
  });
});

// 1. Multimodal First-Aid Guidance API
app.post('/api/guidance', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Please provide a situation description or an image.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are JeevanSetu, an Accessible Emergency Health & Safety First-Aid Assistant designed for campus and daily emergencies.
Your primary role is to provide rapid, plain-language, step-by-step first-aid guidance.
CRITICAL SAFETY DIRECTIVES:
1. CONSERVATIVE SEVERITY ESCALATION: Always evaluate severity conservatively. If there is ANY indication of severe bleeding, chemical eye/skin splash, anaphylaxis/difficulty breathing, head trauma with loss of consciousness, choking, severe third-degree burns, sudden chest pain, or open fractures, set severity to "CRITICAL_EMERGENCY" or "HIGH", set isEmergency to true, and provide an immediate critical action advising calling local emergency services (911/112/Campus Security).
2. NEVER REPLACE PROFESSIONAL MEDICAL CARE: Emphasize that instructions are immediate stabilization bridge steps before emergency professionals arrive.
3. PLAIN LANGUAGE & SHORT SENTENCES: Use 5th-to-8th grade reading level, short numbered steps, zero unnecessary medical jargon, clear "DO NOT" warnings.
4. If an image is provided, inspect visible signs: bleeding color/flow, burn depth/blistering, swelling, rash distribution, chemical stains, or foreign objects.`;

    const parts: any[] = [];
    if (imageBase64) {
      // Strip data url prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const userText = prompt
      ? `Assess this emergency/first-aid situation and provide immediate step-by-step guidance:\n${prompt}`
      : `Analyze this image of the injury/situation and provide immediate first-aid guidance.`;
    parts.push({ text: userText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'Classified first-aid category (e.g., Thermal Burn, Chemical Exposure, Deep Laceration, Allergic Reaction, Sprain, Choking, Fainting, Heat Stroke, Head Trauma, Insect Bite, etc.)',
            },
            severity: {
              type: Type.STRING,
              description: 'One of: LOW, MEDIUM, HIGH, CRITICAL_EMERGENCY',
            },
            isEmergency: {
              type: Type.BOOLEAN,
              description: 'True if high or critical emergency requiring immediate 911 / emergency services escalation',
            },
            summary: {
              type: Type.STRING,
              description: '1-sentence clear assessment of what happened / what is observed',
            },
            immediateCriticalAction: {
              type: Type.STRING,
              description: 'Single most critical 0-second action (e.g., "Flush eyes with continuous water for 15 minutes and call 911" or "Apply direct firm pressure with clean cloth")',
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Numbered, ordered, actionable first-aid steps in simple language',
            },
            doNots: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Crucial actions to avoid (e.g. do not pop blisters, do not apply ice directly, do not remove embedded object)',
            },
            warningSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Red flag signs that require immediate paramedic or emergency room evaluation',
            },
            whenToSeekCare: {
              type: Type.STRING,
              description: 'Guidance on whether and when to visit urgent care, clinic, or emergency department',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Standard medical disclaimer: This is immediate first-aid bridge guidance, not professional medical diagnosis. Call local emergency services for life-threatening situations.',
            },
          },
          required: [
            'category',
            'severity',
            'isEmergency',
            'summary',
            'immediateCriticalAction',
            'steps',
            'doNots',
            'warningSigns',
            'whenToSeekCare',
            'disclaimer',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    // Validate severity fallback
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL_EMERGENCY'];
    if (!validSeverities.includes(parsedData.severity)) {
      parsedData.severity = parsedData.isEmergency ? 'HIGH' : 'MEDIUM';
    }

    return res.json({
      id: `fa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Error generating first-aid guidance:', error);
    return res.status(500).json({
      error: 'Failed to generate guidance. Please follow basic emergency protocol or call emergency services immediately.',
      details: error.message,
    });
  }
});

// 2. Multimodal Safety Warning Translation API
app.post('/api/translate-warning', async (req: Request, res: Response) => {
  try {
    const {
      text,
      imageBase64,
      mimeType = 'image/jpeg',
      targetLanguageCode = 'es',
      targetLanguageName = 'Spanish',
    } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Please provide warning text or an image of a warning sign.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are JeevanSetu Safety Warning Translator, an urgent multilingual safety translator for students and campus personnel.
Your job is to:
1. Extract ALL text from warning signs, chemical hazard labels, evacuation notices, biohazard placards, or lab protocols.
2. Accurately translate into the requested target language (${targetLanguageName}, code: ${targetLanguageCode}).
3. PRESERVE THE EXACT URGENCY AND TONE: Never soften words like "DANGER", "DEADLY", "POISON", "DO NOT ENTER", "FLAMMABLE", "EVACUATE".
4. Extract hazard symbols and meaning (e.g. corrosive, flammable, laser radiation, high voltage, toxic, biohazard).
5. Produce a simple, 1-2 sentence "actionDirective" in the target language explaining exactly what the user must do right now to stay safe.`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const promptText = text
      ? `Extract and translate this safety warning sign/notice into ${targetLanguageName} (${targetLanguageCode}):\n${text}`
      : `Perform OCR on this safety warning sign/label and translate all contents accurately into ${targetLanguageName} (${targetLanguageCode}), preserving urgency and safety directives.`;
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: {
              type: Type.STRING,
              description: 'Extracted raw original text from the sign or input',
            },
            detectedSourceLanguage: {
              type: Type.STRING,
              description: 'Language of the original text (e.g. English, German, French, etc.)',
            },
            targetLanguage: {
              type: Type.STRING,
              description: 'Target language name',
            },
            translatedText: {
              type: Type.STRING,
              description: 'High-fidelity translation into target language with preserved urgency',
            },
            hazardLevel: {
              type: Type.STRING,
              description: 'One of: DANGER, WARNING, CAUTION, NOTICE, BIOHAZARD, FLAMMABLE, GENERAL_SAFETY',
            },
            urgencyTone: {
              type: Type.STRING,
              description: 'Description of tone (e.g., Critical Immediate Danger, Warning, Informative Caution)',
            },
            actionDirective: {
              type: Type.STRING,
              description: 'Clear, direct instruction for the reader in the target language (e.g., "Do not enter without safety goggles and chemical respirator")',
            },
            symbolsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Names of recognized hazard pictograms or icons (e.g. Fire, Skull & Crossbones, Eye Protection Required, Laser)',
            },
            notes: {
              type: Type.STRING,
              description: 'Additional cultural or campus safety context',
            },
          },
          required: [
            'originalText',
            'detectedSourceLanguage',
            'targetLanguage',
            'translatedText',
            'hazardLevel',
            'urgencyTone',
            'actionDirective',
            'symbolsDetected',
            'notes',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    return res.json({
      id: `wt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Error translating safety warning:', error);
    return res.status(500).json({
      error: 'Failed to translate warning sign.',
      details: error.message,
    });
  }
});

// 3. Emergency Contact Alert Dispatch API
app.post('/api/alerts/send', async (req: Request, res: Response) => {
  try {
    const {
      contacts = [],
      situationSummary,
      severity = 'MEDIUM',
      category = 'Emergency',
      guidanceGiven = [],
      location,
      notes = '',
    } = req.body;

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: 'No emergency contacts specified.' });
    }

    const timestamp = new Date().toISOString();
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Format structured alert message
    const locationString = location
      ? location.approximateAddress
        ? `${location.approximateAddress} (${location.latitude}, ${location.longitude})`
        : location.mapsUrl || `Lat: ${location.latitude}, Lng: ${location.longitude}`
      : 'Location not shared';

    const formattedMessage = `🚨 [JEEVANSETU EMERGENCY ALERT] 🚨
Severity: ${severity}
Situation: ${situationSummary}
Category: ${category}
Timestamp: ${new Date().toLocaleString()}
Location: ${locationString}
Top Guidance Steps:
${guidanceGiven.slice(0, 3).map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}
${notes ? `User Note: ${notes}` : ''}`;

    console.log(`[ALERT DISPATCHED] Alert ID: ${alertId}`);
    console.log(formattedMessage);
    console.log(`Sent to ${contacts.length} contact(s):`, contacts.map((c: any) => `${c.name} (${c.phone || c.email})`));

    // Webhook forwarding if configured in environment, otherwise transparent Demo Mode
    let webhookStatus: 'webhook_delivered' | 'simulated' | 'failed' = 'simulated';
    let deliveryMessage = 'Demo Mode: Emergency alert recorded and simulated successfully. Note: No real SMS or email was transmitted. Configure EMERGENCY_WEBHOOK_URL in environment for live dispatch, or use native device links.';

    const webhookUrl = process.env.EMERGENCY_WEBHOOK_URL;

    if (webhookUrl && webhookUrl.trim() !== '') {
      try {
        console.log(`[ALERT DISPATCH] Attempting POST to configured EMERGENCY_WEBHOOK_URL...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout so app never hangs

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'EMERGENCY_ALERT_TRIGGERED',
            alertId,
            timestamp,
            severity,
            situationSummary,
            category,
            guidanceGiven,
            location,
            notes,
            contactsCount: contacts.length,
            contacts: contacts.map((c: any) => ({
              name: c.name,
              relationship: c.relationship,
              phone: c.phone || undefined,
              email: c.email || undefined,
            })),
            formattedMessage,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (webhookResponse.ok) {
          webhookStatus = 'webhook_delivered';
          deliveryMessage = `Emergency alert payload forwarded to configured webhook (${webhookResponse.status} ${webhookResponse.statusText}).`;
          console.log(`[ALERT DISPATCH] Webhook delivery successful!`);
        } else {
          console.warn(`[ALERT DISPATCH] Webhook responded with status ${webhookResponse.status}. Gracefully falling back to Demo Mode.`);
          webhookStatus = 'simulated';
          deliveryMessage = `Demo Mode: Webhook returned HTTP ${webhookResponse.status}. Alert simulated locally without sending real SMS/email.`;
        }
      } catch (webhookErr: any) {
        console.warn(`[ALERT DISPATCH] Webhook request error (${webhookErr?.name || 'Error'}: ${webhookErr?.message}). Gracefully continuing in Demo Mode.`);
        webhookStatus = 'simulated';
        deliveryMessage = `Demo Mode: Webhook unavailable (${webhookErr?.message || 'network timeout'}). Alert simulated locally without sending real SMS/email.`;
      }
    } else {
      console.log(`[ALERT DISPATCH] No EMERGENCY_WEBHOOK_URL configured. Running in Demo Mode (simulating alert delivery safely).`);
    }

    const isLive = webhookStatus === 'webhook_delivered';

    return res.json({
      success: true,
      alertId,
      timestamp,
      isDemoMode: !isLive,
      deliveryStatus: isLive ? 'sent' : 'demo_delivered',
      dispatchMethod: isLive ? 'webhook' : 'simulated',
      recipientCount: contacts.length,
      formattedMessage,
      recipients: contacts.map((c: any) => ({
        name: c.name,
        contact: c.phone || c.email,
        relationship: c.relationship,
      })),
      notes: deliveryMessage,
    });
  } catch (error: any) {
    console.error('Error dispatching alert:', error);
    return res.status(500).json({ error: 'Failed to dispatch alert.', details: error.message });
  }
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JeevanSetu server running at http://localhost:${PORT}`);
  });
}

startServer();
