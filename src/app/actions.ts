'use server';

import { db } from "@/db";
import { siteSettings, services, pages, navItems, aiPosts, leads, mediaAssets, pageHits } from "@/db/schema";

import { eq, sql, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  const settings = await db.select().from(siteSettings).limit(1);
  if (settings.length === 0) {
    return {
      id: 0,
      siteName: "Fhinovax Multitech Solutions Ltd",
      logoUrl: "",
      faviconUrl: "",
      heroTitle: "Generator & Vehicle Diagnostics in Makurdi",
      heroSubtitle: "Professional diagnostics, honest repairs, physical workshop available at Ankpa Road.",
      heroBgType: "color",
      heroBgValue: "#1c519d",
      phoneNumber: "+2348000000000",
      whatsappNumber: "2348000000000",
      emailAddress: "info@fhinovax.com",
      operatingHours: "Mon-Sat: 8am - 6pm",
      address: "No. 83 Ankpa Road, Makurdi, Benue State",
      googleMapsEmbed: "",
      googleBusinessDetails: "",
      aiName: "Phinovax Agent",
      aiInstructions: "",
      aiTrainingData: "",

      metaDescription: "Professional generator and vehicle diagnostics in Makurdi, Benue State.",
      metaKeywords: "generator repair, vehicle diagnostics, mechanic makurdi, fhinovax",
      ogImageUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      footerText: "Leading the way in multitech solutions and professional diagnostics.",
      copyrightText: "Fhinovax Multitech Solutions Ltd",
      aiApiKey: "",
      labSystemPrompt: "",
      labWelcomeMessage: "",
      lastMarketingRun: null as Date | null,
      updatedAt: new Date(),
    };


  }
  return settings[0];
}

export async function getActiveServices() {
  const activeServices = await db.select().from(services); // Fetch all for admin, but can filter for frontend
  
  if (activeServices.length === 0) {
    // Return defaults if database is empty initially
    return [
      {
        id: 1,
        title: "Generator Servicing",
        description: "Expert repairs & maintenance for all generator brands.",
        iconName: "Wrench",
        isActive: true,
      },
      {
        id: 2,
        title: "Vehicle Diagnostics",
        description: "Advanced computer troubleshooting & mechanical fixes.",
        iconName: "Car",
        isActive: true,
      },
      {
        id: 3,
        title: "Pre-Purchase Exam",
        description: "Complete mechanical inspection before you buy.",
        iconName: "Search",
        isActive: true,
      },
      {
        id: 4,
        title: "Mechanical Consulting",
        description: "Expert advice for heavy machinery and vehicle fleets.",
        iconName: "Settings",
        isActive: true,
      }
    ];
  }
  
  return activeServices;
}

export async function getAllPages() {
  return await db.select().from(pages);
}

export async function getAllNavItems() {
  const items = await db.select().from(navItems).orderBy(navItems.orderIndex);
  
  // Virtual defaults if DB is empty or missing core items
  const virtualDefaults = [
    { id: 991, label: "Services", href: "/services", parentId: null, orderIndex: 1, isActive: true, createdAt: null },
    { id: 992, label: "About Us", href: "/about", parentId: null, orderIndex: 2, isActive: true, createdAt: null },
    { id: 993, label: "Contact Us", href: "/contact", parentId: null, orderIndex: 3, isActive: true, createdAt: null },
    { id: 999, label: "Online Diagnosis", href: "/diagnosis", parentId: null, orderIndex: 9, isActive: true, createdAt: null },
  ];

  // Merge items: prefer items from DB if they have matching hrefs
  const finalItems = [...items];
  
  for (const def of virtualDefaults) {
    if (!finalItems.some(i => i.href === def.href)) {
      finalItems.push(def);
    }
  }
  
  return finalItems.sort((a, b) => a.orderIndex - b.orderIndex);
}


export async function getAiPosts() {
  return await db.select().from(aiPosts).orderBy(aiPosts.createdAt);
}

export async function getLeads() {
  return await db.select().from(leads).orderBy(desc(leads.createdAt));
}

/* --- MEDIA & TRACKING --- */

export async function getMediaAssets() {
  return await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function registerMediaAsset(url: string, fileName: string, fileSize?: number, mimeType?: string) {
  await db.insert(mediaAssets).values({
    url,
    fileName,
    fileSize,
    mimeType
  });
  revalidatePath("/admin");
}

export async function trackPageHit(slug: string, userAgent?: string) {
  try {
     await db.insert(pageHits).values({
       slug,
       userAgent
     });
  } catch (e) {
     console.error("Hit tracking failed", e);
  }
}

export async function getSystemMetrics() {
  const settings = await getSiteSettings();
  
  // Get hits in last 24h
  const dailyHits = await db.select({ count: count() })
    .from(pageHits)
    .where(sql`created_at > now() - interval '24 hours'`);
    
  // Get total hits
  const totalHits = await db.select({ count: count() }).from(pageHits);
  
  // Total leads
  const totalLeads = await db.select({ count: count() }).from(leads);
  
  // SEO Score (basic heuristic)
  let seoScore = 0;
  if (settings.metaDescription) seoScore += 30;
  if (settings.metaKeywords) seoScore += 20;
  if (settings.ogImageUrl) seoScore += 20;
  if (settings.faviconUrl) seoScore += 10;
  if (settings.siteName !== "webapp") seoScore += 20;

  return {
    dailyHits: dailyHits[0]?.count || 0,
    totalHits: totalHits[0]?.count || 0,
    totalLeads: totalLeads[0]?.count || 0,
    seoScore,
    aiStatus: settings.aiApiKey ? "Active" : "Key Missing",
    mediaStatus: "Database Storage (Active)",
    marketingHealth: settings.lastMarketingRun ? "Healthy" : "Neutral"
  };
}



