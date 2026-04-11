import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getSiteSettings } from '@/app/actions';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const settings = await getSiteSettings();
    const apiKey = settings.aiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "No API Key found in Database or Environment Variables." 
      }), { status: 400 });
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1',
    });

    // Perform a test
    let customPrompt = "";
    try {
      const body = await req.json();
      customPrompt = body.prompt;
    } catch (e) {}

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: customPrompt || 'Respond with exactly the word "CONNECTED" and nothing else.',
    });

    if (customPrompt) {
       return new Response(JSON.stringify({ 
        success: true, 
        message: "API Response received!",
        response: text
      }));
    }

    if (text.trim().includes("CONNECTED")) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Successfully connected to Google AI Studio!",
        keyPreview: apiKey.substring(0, 4) + "..." + apiKey.slice(-4)
      }));
    } else {
       return new Response(JSON.stringify({ 
        success: false, 
        message: "Connected, but received unexpected response: " + text 
      }), { status: 500 });
    }

  } catch (err: any) {
    console.error("Diagnostic Error:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: err.message || "Failed to connect to Google AI.",
      details: err.stack?.split('\n')[0]
    }), { status: 500 });
  }
}
