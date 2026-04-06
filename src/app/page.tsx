import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Placeholder */}
      <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* We will replace this with actual logo image later */}
          <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-extrabold text-brand-blue uppercase tracking-tight text-lg">Fhinovax</span>
        </div>
        <button className="text-brand-blue p-1 rounded hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative px-4 py-16 bg-brand-blue text-white overflow-hidden">
          {/* Subtle background flair */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-[#11315e] z-0 opacity-90" />
          
          <div className="relative z-10 max-w-lg mx-auto flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Generator & <span className="text-brand-gold">Vehicle</span> Diagnostics in Makurdi
            </h1>
            
            <p className="text-lg text-blue-100 font-medium">
              Professional diagnostics, honest repairs, physical workshop available at Ankpa Road.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link href="tel:+2348000000000" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-gold text-brand-dark font-bold rounded-xl shadow-lg hover:bg-yellow-500 transition-colors active:scale-95 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call Now
              </Link>
              <Link href="https://wa.me/2348000000000" target="_blank" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-brand-blue border-2 border-transparent font-bold rounded-xl shadow hover:bg-gray-50 transition-colors active:scale-95 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                WhatsApp Us
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>No. 83 Ankpa Road, Makurdi, Benue State</span>
            </div>
          </div>
        </section>

        {/* SERVICES QUICK CARDS */}
        <section className="px-4 py-12 bg-brand-light">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-brand-dark">Our Specialties</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 active:scale-[0.98] transition-transform">
                <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 15 2-2-2-2"/><path d="M14 11h-2v2h2"/><path d="m20 12-2 2-2-2"/><path d="M22 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/><path d="M2 18v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><path d="M16 6H8"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Generator Servicing</h3>
                  <p className="text-sm text-gray-500 leading-snug">Expert repairs & maintenance for all generator brands.</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 active:scale-[0.98] transition-transform">
                <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Vehicle Diagnostics</h3>
                  <p className="text-sm text-gray-500 leading-snug">Advanced computer troubleshooting & mechanical fixes.</p>
                </div>
              </div>

               {/* Card 3 */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 active:scale-[0.98] transition-transform">
                <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m5 19 5 3 5-3"/><path d="m2 12 20 0"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Pre-Purchase Exam</h3>
                  <p className="text-sm text-gray-500 leading-snug">Complete mechanical inspection before you buy.</p>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 active:scale-[0.98] transition-transform">
                <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M10 16h4"/><path d="M12 14v4"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Mechanical Consulting</h3>
                  <p className="text-sm text-gray-500 leading-snug">Expert advice for heavy machinery and vehicle fleets.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      
      {/* Footer Area Placeholder */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
         <p className="text-sm">&copy; {new Date().getFullYear()} Fhinovax Multitech Solutions Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
