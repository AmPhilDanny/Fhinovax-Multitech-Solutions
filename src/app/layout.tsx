import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings, getAllNavItems } from "./actions";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteName,
    description: settings.heroSubtitle,
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const navItems = await getAllNavItems();

  return (
    <html lang="en" className="scroll-smooth h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-full flex flex-col bg-white">
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} navItems={navItems} />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <ChatWidget />
        
        <footer className="bg-brand-dark text-gray-400 text-center py-12 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto space-y-4">
             <div className="text-white font-bold text-lg">{settings.siteName}</div>
             <p className="text-sm max-w-md mx-auto">{settings.footerText || "Leading the way in multitech solutions and professional diagnostics."}</p>
             <div className="pt-4 border-t border-gray-800/50 mt-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-600">
                   &copy; {new Date().getFullYear()} {settings.copyrightText || "Fhinovax Multitech Solutions Ltd"}
                </p>
                <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
                   <a href="/admin" className="hover:text-brand-gold transition-colors underline underline-offset-4">Admin Dashboard</a>
                </div>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

