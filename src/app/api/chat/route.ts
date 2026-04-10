import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSiteSettings, getActiveServices } from '@/app/actions';

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
    You are the official AI Assistant for ${settings.siteName}. 
    Your goal is to be helpful, professional, and drive customers to visit the workshop or contact the team.
    
    BUSINESS CONTEXT:
    - Address: ${settings.address}
    - Operating Hours: ${settings.operatingHours}
    - Phone: ${settings.phoneNumber}
    - WhatsApp: ${settings.whatsappNumber}
    - Email: ${settings.emailAddress}
    
    SERVICES WE PROVIDE:
    ${servicesContext}
    
    BUSINESS DETAILS:
    ${settings.googleBusinessDetails}
    
    ADDITIONAL INSTRUCTIONS:
    ${settings.aiInstructions}
    
    GUIDELINES:
    1. Always mention that the physical workshop is located at ${settings.address} if the user asks for location.
    2. If a user has a specific vehicle or generator issue, recommend they bring it in for a professional diagnostic.
    3. Keep responses concise and formatted for mobile view.
    4. Be friendly but efficient.
  `;

  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages,
    system: systemInstructions,
  });

  return result.toDataStreamResponse();
}
