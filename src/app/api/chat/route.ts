import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';

import { getSiteSettings, getActiveServices } from '@/app/actions';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch latest business context from DB
  const settings = await getSiteSettings();
  const services = await getActiveServices();

  const servicesContext = services
    .map((s: any) => `- ${s.title}: ${s.description}`)
    .join('\n');

  const systemInstructions = `
    Your name is ${settings.aiName}. You are the Senior Business Representative for ${settings.siteName}. 
    Your goal is to be helpful, professional, and efficiently handle customer inquiries.

    
    CORE MISSION:
    If a user expresses interest in a service, repair, or needs a follow-up, you MUST capture their details using the 'recordCustomerLead' tool.
    Politely ask for:
    1. Their Name
    2. Best contact method (WhatsApp or Phone number)
    3. The specific issue they are facing.

    BUSINESS CONTEXT:
    - Address: ${settings.address}
    - Operating Hours: ${settings.operatingHours}
    - Phone: ${settings.phoneNumber}
    - WhatsApp: ${settings.whatsappNumber}
    - Email: ${settings.emailAddress}
    
    SERVICES WE PROVIDE:
    ${servicesContext}
    
    DEEP TRAINING DATA / CONTEXT:
    ${settings.aiInstructions}
    ${settings.aiTrainingData}
    
    GUIDELINES:
    1. Always mention that the physical workshop is located at ${settings.address} if the user asks for location.
    2. When you capture a lead, inform the user that a human expert will contact them shortly.
    3. Keep responses concise and formatted for mobile view.
    4. Be a proactive sales agent while maintaining professional integrity.
  `;

  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages,
    system: systemInstructions,
    tools: {
      recordCustomerLead: tool({
        description: 'Save customer details for human contact follow-up when they express interest in services or repairs.',
        parameters: z.object({
          name: z.string().describe('The name of the customer'),
          contactMethod: z.string().describe('Their phone number or WhatsApp handle'),
          issueType: z.string().describe('Brief description of the problem (e.g., Generator service, Vehicle diagnostic)'),
          urgency: z.string().optional().describe('How quickly they need a response (Low, Medium, High)'),
          location: z.string().optional().describe('User current location if relevant'),
        }),
        execute: async ({ name, contactMethod, issueType, urgency, location }) => {
          try {
            await db.insert(leads).values({
              name,
              contactMethod,
              issueType,
              urgency: urgency || 'Medium',
              location: location || 'Not provided',
            });
            return {
              success: true,
              message: `Lead for ${name} recorded successfully.`,
            };
          } catch (error) {
            console.error('Failed to record lead:', error);
            return { success: false, message: 'Internal error recording lead.' };
          }
        },
      }),

    },
  });

  return result.toTextStreamResponse();
}


