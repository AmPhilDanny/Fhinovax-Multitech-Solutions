import { pgTable, text, serial, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";

// Site Settings: Holds hero text, contact numbers, address, and overall site customization text
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 150 }).notNull().default("Fhinovax Multitech Solutions Ltd"),
  logoUrl: text("logo_url").default(""),
  faviconUrl: text("favicon_url").default(""),
  heroTitle: text("hero_title").notNull().default("Generator & Vehicle Diagnostics in Makurdi"),
  heroSubtitle: text("hero_subtitle").notNull().default("Professional diagnostics, honest repairs, physical workshop available at Ankpa Road."),
  heroBgType: varchar("hero_bg_type", { length: 50 }).notNull().default("color"), // "color" or "image"
  heroBgValue: text("hero_bg_value").notNull().default("#003366"),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull().default("+2348000000000"),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).notNull().default("2348000000000"),
  emailAddress: varchar("email_address", { length: 150 }).default("info@fhinovax.com"),
  operatingHours: text("operating_hours").default("Mon-Sat: 8am - 6pm"),
  address: text("address").notNull().default("No. 83 Ankpa Road, Makurdi, Benue State"),
  googleMapsEmbed: text("google_maps_embed").default(""),
  googleBusinessDetails: text("google_business_details").default(""),
  aiInstructions: text("ai_instructions").default(""),
  footerText: text("footer_text").default(""),
  copyrightText: text("copyright_text").default(""),
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

// Dynamic Pages: Users can create custom content pages
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Navigation Items: Supports Dynamic Link creation and Submenus
export const navItems = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  href: varchar("href", { length: 255 }).notNull(),
  parentId: integer("parent_id"), // Self-referencing ID for submenus
  orderIndex: integer("order_index").notNull().default(0),
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

