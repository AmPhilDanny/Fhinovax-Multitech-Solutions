'use server';

import { db } from "@/db";
import { siteSettings, services, pages, navItems, aiPosts, leads, mediaAssets, pageHits, artisans, bookings } from "@/db/schema";

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

      // New Page Content Fields
      bookPageTitle: "",
      bookPageSubtitle: "",
      onboardPageTitle: "",
      onboardPageSubtitle: "",
      diagnosisPageTitle: "",
      diagnosisPageSubtitle: "",

      // New Form Customization Fields
      onboardSpecialties: "Mechanical Engineer, Auto Electrician, Generator Specialist, HVAC Systems, Digital Diagnostics",
      bookSuccessTitle: "Request Seeded",
      bookSuccessMessage: "We have received your technical inspection request. A Phinovax representative will call you shortly to confirm the appointment.",
      onboardSuccessTitle: "Application Received!",
      onboardSuccessMessage: "Thank you for joining the Phinovax Network. Our technical team will review your qualifications and contact you shortly.",

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
  const existingItems = await db.select().from(navItems);

  // Default nav items to seed if not yet present
  const defaults = [
    { label: "Home", href: "/", parentId: null, orderIndex: 0, isActive: true },
    { label: "Book Inspection", href: "/book", parentId: null, orderIndex: 1, isActive: true },
    { label: "Services", href: "/services", parentId: null, orderIndex: 2, isActive: true },
    { label: "About Us", href: "/about", parentId: null, orderIndex: 3, isActive: true },
    { label: "Contact Us", href: "/contact", parentId: null, orderIndex: 4, isActive: true },
    { label: "Join Network", href: "/onboard", parentId: null, orderIndex: 5, isActive: true },
    { label: "Online Diagnosis", href: "/diagnosis", parentId: null, orderIndex: 9, isActive: true },
  ];

  // Find which defaults are missing from the DB (match by href)
  const missingDefaults = defaults.filter(
    d => !existingItems.some(i => i.href === d.href)
  );

  // Seed missing defaults into the real DB so they get real IDs
  if (missingDefaults.length > 0) {
    await db.insert(navItems).values(missingDefaults);
  }

  // Now fetch the complete, fully-persisted list from DB
  return await db.select().from(navItems).orderBy(navItems.orderIndex);
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

// --- Artisan Network Actions ---

export async function getArtisans(onlyActive = true) {
  if (onlyActive) {
    return await db.select().from(artisans).where(eq(artisans.status, 'active')).orderBy(desc(artisans.createdAt));
  }
  return await db.select().from(artisans).orderBy(desc(artisans.createdAt));
}

export async function onboardArtisan(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const specialty = formData.get('specialty') as string;
  const location = formData.get('location') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const yearsExperience = parseInt(formData.get('yearsExperience') as string) || 0;
  const bio = formData.get('bio') as string;
  const photoUrl = formData.get('photoUrl') as string;
  const password = formData.get('password') as string;

  // Hash the password using Node.js built-in crypto (no extra deps)
  let passwordHash: string | undefined = undefined;
  if (password) {
    const { createHash } = await import('crypto');
    passwordHash = createHash('sha256').update(password).digest('hex');
  }

  try {
    await db.insert(artisans).values({
      name,
      email: email || null,
      specialty,
      location,
      phoneNumber,
      yearsExperience,
      bio,
      photoUrl,
      passwordHash,
      status: 'pending'
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// --- Booking Actions ---

export async function getBookings() {
  return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function saveBooking(formData: FormData) {
  const clientName = formData.get('clientName') as string;
  const clientPhone = formData.get('clientPhone') as string;
  const location = formData.get('location') as string;
  const issueDescription = formData.get('issueDescription') as string;
  const preferredDate = formData.get('preferredDate') as string;
  const serviceId = parseInt(formData.get('serviceId') as string) || null;

  try {
    await db.insert(bookings).values({
      clientName,
      clientPhone,
      location,
      issueDescription,
      preferredDate,
      serviceId,
      status: 'new'
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
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



