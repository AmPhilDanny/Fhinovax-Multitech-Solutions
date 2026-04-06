import Link from "next/link";
import { getSiteSettings, getActiveServices } from "./actions";
import Navbar from "@/components/Navbar";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSiteSettings();
  const servicesList = await getActiveServices();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative px-4 py-16 bg-brand-blue text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-[#11315e] z-0 opacity-90" />
          
          <div className="relative z-10 max-w-lg mx-auto flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: settings.heroTitle }} />
            
            <p className="text-lg text-blue-100 font-medium">
              {settings.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link href={`tel:${settings.phoneNumber}`} className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-gold text-brand-dark font-bold rounded-xl shadow-lg hover:bg-yellow-500 transition-colors active:scale-95 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call Now
              </Link>
              <Link href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-brand-blue border-2 border-transparent font-bold rounded-xl shadow hover:bg-gray-50 transition-colors active:scale-95 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                WhatsApp Us
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES QUICK CARDS */}
        <section id="services" className="px-4 py-16 bg-brand-light">
          <div className="max-w-lg mx-auto md:max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-10 text-brand-dark">Our Specialties</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {servicesList.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 active:scale-[0.98] transition-transform">
                  <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue flex-shrink-0">
                    {/* Fallback Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 15 2-2-2-2"/><path d="M14 11h-2v2h2"/><path d="m20 12-2 2-2-2"/><path d="M22 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/><path d="M2 18v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><path d="M16 6H8"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{service.title}</h3>
                    <p className="text-sm text-gray-500 leading-snug">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT INFO SECTION */}
        <section id="contact" className="px-4 py-16 bg-white border-t border-gray-100">
           <div className="max-w-lg mx-auto text-center space-y-6">
             <h2 className="text-2xl font-bold text-brand-dark">Visit Our Workshop</h2>
             
             <div className="bg-gray-50 p-6 rounded-2xl inline-block text-left w-full space-y-4 shadow-sm border border-gray-100">
               <div className="flex items-start gap-3 text-gray-700">
                 <svg className="flex-shrink-0 text-brand-blue" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 <span>{settings.address}</span>
               </div>
               
               <div className="flex items-start gap-3 text-gray-700">
                 <svg className="flex-shrink-0 text-brand-blue" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                 <span>{settings.emailAddress}</span>
               </div>
               
               <div className="flex items-start gap-3 text-gray-700">
                 <svg className="flex-shrink-0 text-brand-blue" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 <span>{settings.operatingHours}</span>
               </div>
             </div>
           </div>
        </section>
      </main>
      
      {/* Footer Area */}
      <footer className="bg-gray-900 text-gray-400 text-center py-10 px-4 flex flex-col items-center gap-3">
         <div className="text-white font-bold mb-2">{settings.siteName}</div>
         <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
         <Link href="/admin" className="text-xs text-gray-600 hover:text-gray-300 mt-4 underline decoration-gray-700 underline-offset-4">Admin Login</Link>
      </footer>
    </div>
  );
}
