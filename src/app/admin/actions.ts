'use server';

import { db } from "@/db";
import { siteSettings, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(formData: FormData) {
  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const address = formData.get("address") as string;
  const siteName = formData.get("siteName") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const operatingHours = formData.get("operatingHours") as string;

  // Check if a row exists
  const existing = await db.select().from(siteSettings).limit(1);

  if (existing.length === 0) {
    await db.insert(siteSettings).values({
      heroTitle, heroSubtitle, phoneNumber, whatsappNumber, address, siteName, logoUrl, emailAddress, operatingHours
    });
  } else {
    await db.update(siteSettings).set({
      heroTitle, heroSubtitle, phoneNumber, whatsappNumber, address, siteName, logoUrl, emailAddress, operatingHours, updatedAt: new Date()
    }).where(eq(siteSettings.id, existing[0].id));
  }

  // Refresh the main page cache so users see updates instantly
  revalidatePath("/");
  revalidatePath("/admin");
}
