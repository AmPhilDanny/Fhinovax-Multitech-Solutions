import type { Metadata } from "next";
import "./globals.css";
import { ExternalLink } from "lucide-react";
import { Facebook, Instagram, Twitter, Linkedin } from "@/components/Icons";


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`
    },
    description: settings.metaDescription || settings.heroSubtitle,
    keywords: settings.metaKeywords,
    openGraph: {
      title: settings.siteName,
      description: settings.metaDescription || settings.heroSubtitle,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : [],
    },
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

  const socialLinks = [
    { icon: Facebook, href: settings.facebookUrl, label: "Facebook" },
    { icon: Instagram, href: settings.instagramUrl, label: "Instagram" },
    { icon: Twitter, href: settings.twitterUrl, label: "Twitter" },
    { icon: Linkedin, href: settings.linkedinUrl, label: "LinkedIn" },
  ].filter(link => link.href);

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
        
        <ChatWidget agentName={settings.aiName} />

        
        <footer className="bg-brand-dark text-gray-400 py-16 px-4 border-t border-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
             <div className="space-y-6">
                <div className="text-white font-extrabold text-2xl tracking-tight">{settings.siteName}</div>
                <p className="text-sm leading-relaxed max-w-sm">{settings.footerText || "Leading the way in multitech solutions and professional diagnostics."}</p>
                
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-4 pt-4">
                    {socialLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-blue hover:text-white transition-all transform hover:-translate-y-1"
                        aria-label={link.label}
                      >
                        <link.icon size={18} />
                      </a>
                    ))}
                  </div>
                )}
             </div>

             <div className="space-y-6">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Reach Out</h3>
                <div className="space-y-3 text-sm">
                   <p>{settings.address}</p>
                   <p className="text-brand-blue font-bold">{settings.phoneNumber}</p>
                   <p>{settings.emailAddress}</p>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Platform</h3>
                <div className="flex flex-col gap-3 text-sm">
                   <a href="/admin" className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                      <div className="w-1 h-1 bg-brand-blue rounded-full" />
                      Admin Terminal
                   </a>
                   <div className="flex items-center gap-2 text-gray-600 text-[10px] mt-4 uppercase tracking-tighter">
                      &copy; {new Date().getFullYear()} {settings.copyrightText || "Fhinovax Multitech Solutions Ltd"}
                   </div>
                </div>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


