'use server';

import { db } from "@/db";
import { siteSettings, services, pages, navItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSiteSettings() {
  const settings = await db.select().from(siteSettings).limit(1);
  if (settings.length === 0) {
    return {
      heroTitle: "Generator & Vehicle Diagnostics in Makurdi",
      heroSubtitle: "Professional diagnostics, honest repairs, physical workshop available at Ankpa Road.",
      phoneNumber: "+2348000000000",
      whatsappNumber: "2348000000000",
      emailAddress: "info@fhinovax.com",
      operatingHours: "Mon-Sat: 8am - 6pm",
      address: "No. 83 Ankpa Road, Makurdi, Benue State",
      siteName: "Fhinovax Multitech Solutions Ltd",
      logoUrl: "",
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
  return await db.select().from(navItems).orderBy(navItems.orderIndex);
}

