import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { db } from '@/db';
import { aiPosts } from '@/db/schema';
import { getSiteSettings, getActiveServices } from '@/app/actions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Simple check for authorization (e.g., Vercel Cron Secret)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    const services = await getActiveServices();

    const context = `
      Business Name: ${settings.siteName}
      Specialties: ${services.map(s => s.title).join(', ')}
      Location: ${settings.address}
      Details: ${settings.googleBusinessDetails}
    `;

    const platforms = ['Facebook', 'Instagram', 'LinkedIn'];
    
    for (const platform of platforms) {
      const google = createGoogleGenerativeAI({
        apiKey: settings.aiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });

      const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        system: `You are a social media marketing expert for a technical mechanical company. 
                Generate a catchy, professional post for ${platform}. Include relevant emojis and hashtags.
                Focus on trust, precision, and availability. Use this context: ${context}`,
        prompt: `Generate a daily marketing post for ${platform} to drive business success.`,
      });

      await db.insert(aiPosts).values({
        platform: platform.toLowerCase(),
        content: text,
        isApproved: false,
        status: 'draft',
      });
    }

    return NextResponse.json({ success: true, message: 'Posts generated successfully' });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
