'use server';

import { db } from "@/db";
import { siteSettings, services, pages, navItems, aiPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(formData: FormData) {
  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const heroBgType = formData.get("heroBgType") as string;
  const heroBgValue = formData.get("heroBgValue") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const address = formData.get("address") as string;
  const siteName = formData.get("siteName") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const faviconUrl = formData.get("faviconUrl") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const operatingHours = formData.get("operatingHours") as string;
  const googleMapsEmbed = formData.get("googleMapsEmbed") as string;
  const googleBusinessDetails = formData.get("googleBusinessDetails") as string;
  const aiName = formData.get("aiName") as string;
  const aiInstructions = formData.get("aiInstructions") as string;
  const aiTrainingData = formData.get("aiTrainingData") as string;
  const aiApiKey = formData.get("aiApiKey") as string;

  const metaDescription = formData.get("metaDescription") as string;
  const metaKeywords = formData.get("metaKeywords") as string;
  const ogImageUrl = formData.get("ogImageUrl") as string;
  const facebookUrl = formData.get("facebookUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const twitterUrl = formData.get("twitterUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const footerText = formData.get("footerText") as string;
  const copyrightText = formData.get("copyrightText") as string;

  // Check if a row exists
  const existing = await db.select().from(siteSettings).limit(1);

  const values = {
    heroTitle, heroSubtitle, heroBgType, heroBgValue, 
    phoneNumber, whatsappNumber, address, siteName, 
    logoUrl, faviconUrl, emailAddress, operatingHours,
    googleMapsEmbed, googleBusinessDetails, 
    aiName, aiInstructions, aiTrainingData, aiApiKey,
    metaDescription, metaKeywords, ogImageUrl,
    facebookUrl, instagramUrl, twitterUrl, linkedinUrl,

    footerText, copyrightText,
    updatedAt: new Date()
  };


  if (existing.length === 0) {
    await db.insert(siteSettings).values(values);
  } else {
    await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing[0].id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

/* --- DYNAMIC PAGES ACTIONS --- */

export async function savePage(formData: FormData) {
  const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const isPublished = formData.get("isPublished") === "on";


  if (id) {
    await db.update(pages).set({ title, slug, content, isPublished }).where(eq(pages.id, id));
  } else {
    await db.insert(pages).values({ title, slug, content, isPublished });
  }

  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
}

export async function deletePage(id: number) {
  const page = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (page.length > 0) {
    await db.delete(pages).where(eq(pages.id, id));
    revalidatePath("/admin");
    revalidatePath(`/${page[0].slug}`);
  }
}

/* --- NAVIGATION / MENU BUILDER ACTIONS --- */

export async function saveNavItem(formData: FormData) {
  const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
  const label = formData.get("label") as string;
  const href = formData.get("href") as string;
  const parentId = formData.get("parentId") ? parseInt(formData.get("parentId") as string) : null;
  const orderIndex = formData.get("orderIndex") ? parseInt(formData.get("orderIndex") as string) : 0;
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === null; // Default to true if not present, but handle "on" correctly


  if (id) {
    await db.update(navItems).set({ label, href, parentId, orderIndex, isActive }).where(eq(navItems.id, id));
  } else {
    await db.insert(navItems).values({ label, href, parentId, orderIndex, isActive });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteNavItem(id: number) {
  await db.delete(navItems).where(eq(navItems.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

/* --- SERVICES ACTIONS --- */

export async function saveService(formData: FormData) {
  const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const iconName = formData.get("iconName") as string;
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === null;


  if (id) {
    await db.update(services).set({ title, description, iconName, isActive }).where(eq(services.id, id));
  } else {
    await db.insert(services).values({ title, description, iconName, isActive });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

/* --- MARKETING & POSTS ACTIONS --- */

export async function approveAiPost(id: number) {
  await db.update(aiPosts)
    .set({ isApproved: true, status: 'approved' })
    .where(eq(aiPosts.id, id));
  revalidatePath("/admin");
}

export async function discardAiPost(id: number) {
  await db.delete(aiPosts).where(eq(aiPosts.id, id));
  revalidatePath("/admin");
}

export async function updatePostStatus(id: number, status: string) {
  await db.update(aiPosts).set({ status }).where(eq(aiPosts.id, id));
  revalidatePath("/admin");
}

