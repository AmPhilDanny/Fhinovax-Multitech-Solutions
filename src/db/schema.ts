import { pgTable, text, serial, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

// Site Settings: Holds hero text, contact numbers, address, and overall site customization text
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  heroTitle: text("hero_title").notNull().default("Generator & Vehicle Diagnostics in Makurdi"),
  heroSubtitle: text("hero_subtitle").notNull().default("Professional diagnostics, honest repairs, physical workshop available at Ankpa Road."),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull().default("+2348000000000"),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).notNull().default("2348000000000"),
  address: text("address").notNull().default("No. 83 Ankpa Road, Makurdi, Benue State"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services: Allows admin to define any amount of services dynamically
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: varchar("icon_name", { length: 100 }), // Store the string name of the Lucide icon
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leads: Captured by the AI Agent and Forms
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name"),
  contactMethod: text("contact_method"), // "whatsapp" or "call"
  issueType: text("issue_type"), // "generator" or "vehicle"
  location: text("location"),
  urgency: text("urgency"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Posts: Generated Marketing Content for approval
export const aiPosts = pgTable("ai_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // "facebook", "google", "whatsapp"
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
