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
  aiName: varchar("ai_name", { length: 150 }).notNull().default("Phinovax Agent"),
  aiInstructions: text("ai_instructions").default(""),
  aiTrainingData: text("ai_training_data").default(""), // Deep training context
  metaDescription: text("meta_description").default(""),
  metaKeywords: text("meta_keywords").default(""),
  ogImageUrl: text("og_image_url").default(""),
  facebookUrl: text("facebook_url").default(""),
  instagramUrl: text("instagram_url").default(""),
  twitterUrl: text("twitter_url").default(""),
  linkedinUrl: text("linkedin_url").default(""),
  footerText: text("footer_text").default(""),
  copyrightText: text("copyright_text").default(""),
  aiApiKey: text("ai_api_key"),
  labSystemPrompt: text("lab_system_prompt"), // Specialized prompt for diagnosis
  labWelcomeMessage: text("lab_welcome_message"), // Initial AI message in diagnosis page
  lastMarketingRun: timestamp("last_marketing_run"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media Assets: Center repository for all uploaded files
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Page Hits: Real-time traffic tracking
export const pageHits = pgTable("page_hits", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().default("/"),
  ipHash: varchar("ip_hash", { length: 255 }), // Basic unique tracking
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});


// Services: Allows admin to define any amount of services dynamically
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  detailedContent: text("detailed_content"), // Deep details for specialized page
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
  metaDescription: text("meta_description").default(""),
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
  status: varchar("status", { length: 50 }).default("new"), // "new", "contacted", "resolved"
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Posts: Generated Marketing Content for approval
export const aiPosts = pgTable("ai_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // "facebook", "google", "whatsapp"
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  status: varchar("status", { length: 50 }).default("draft"), // "draft", "approved", "published"
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Memory: Stores long-term context for specialized diagnosis
export const aiMemory = pgTable("ai_memory", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Session focus
  metadata: text("metadata"), // Technical specs (JSON string)
  history: text("history"), // Full troubleshooting logs
  createdAt: timestamp("created_at").defaultNow(),
});
// Artisans: Mechanics and Technicians who join the network
export const artisans = pgTable("artisans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  specialty: text("specialty").notNull(),
  yearsExperience: integer("years_experience"),
  location: text("location").notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "active", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings: Inspection and repair requests
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientPhone: varchar("client_phone", { length: 50 }).notNull(),
  location: text("location").notNull(),
  issueDescription: text("issue_description").notNull(),
  preferredDate: text("preferred_date"),
  serviceId: integer("service_id"), // Optional link to a specific service
  assignedArtisanId: integer("assigned_artisan_id"), // The person doing the work
  status: varchar("status", { length: 50 }).default("new"), // "new", "assigned", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});
