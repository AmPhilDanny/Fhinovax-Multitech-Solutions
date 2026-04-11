import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { getSiteSettings } from '@/app/actions';
import { db } from '@/db';
import { aiMemory } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  const settings = await getSiteSettings();

  // 1. Fetch AI Memory for this user
  let userContext = "";
  if (userId) {
    const memory = await db.select()
      .from(aiMemory)
      .where(eq(aiMemory.userId, userId))
      .orderBy(desc(aiMemory.createdAt))
      .limit(3); 
    
    if (memory.length > 0) {
      userContext = "\nPREVIOUS DIAGNOSTIC HISTORY FOR THIS USER:\n" + 
        memory.map(m => `- Date: ${m.createdAt}\n  Context: ${m.metadata}\n  Findings: ${m.history}`).join("\n\n");
    }
  }

  const systemInstructions = `
    You are the "Phinovax AI Diagnostic Lab Assistant". Your role is to provide technical and mechanical assistance for Generators and Vehicles.
    
    CORE PROTOCOL:
    1. You are a diagnostic specialist. You must ask clarifying questions to narrow down technical faults.
    2. Ask about symbols, colors of smoke, sounds (clicking, knocking, grinding), and when the issue started.
    3. Memory Check: ${userContext ? "The user has previous history below. Use it to see if this is a recurring issue." : "This is a new user."}
    ${userContext}
    
    ADDITIONAL CUSTOMER CONTEXT:
    ${settings.labSystemPrompt || "Be professional and thorough."}

    SPECIALIZED DOMAINS:
    - VEHICLES: OBD-II codes, mechanical engine issues, electrical faults, transmission, suspension.
    - GENERATORS: Diesel/Petrol engines, Alternators, Control panels (Deep Sea, etc.), Fuel systems, AVR issues.

    GOAL:
    Provide a step-by-step diagnostic solution. If the issue is severe, advise them to visit the Phinovax workshop at Ankpa Road.
    Always be extremely technical but explain terms for the user.
    
    MEMORY LEARNING:
    Use the 'saveDiagnosticMemory' tool once you have successfully identified a likely cause or completed a session info capture.
  `;

  const google = createGoogleGenerativeAI({
    apiKey: settings.aiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: await convertToModelMessages(messages),
    system: systemInstructions,
    tools: {
      saveDiagnosticMemory: tool({
        description: 'Store technical findings and vehicle/generator specs to improve future diagnosis for this user.',
        inputSchema: z.object({
          userId: z.string().describe('The session or user ID'),
          metadata: z.string().describe('JSON string of specs: e.g. { "type": "vehicle", "brand": "Toyota", "year": 2015 }'),
          history: z.string().describe('Summary of the fault and proposed solution'),
        }),
        execute: async ({ userId, metadata, history }) => {
          try {
            await db.insert(aiMemory).values({
              userId,
              metadata,
              history,
            });
            return { success: true, message: "Diagnostic memory updated." };
          } catch (e) {
            return { success: false, message: "Failed to save memory." };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
