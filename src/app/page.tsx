import Link from "next/link";
import { getSiteSettings, getActiveServices } from "./actions";
import * as LucideIcons from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSiteSettings();
  const servicesList = await getActiveServices();

  const heroStyle = settings.heroBgType === 'image' 
    ? { backgroundImage: `url(${settings.heroBgValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : settings.heroBgType === 'gradient'
    ? { background: settings.heroBgValue }
    : { backgroundColor: settings.heroBgValue };

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section 
        className="relative px-4 py-24 text-white overflow-hidden min-h-[500px] flex items-center"
        style={heroStyle}
      >
        <div className="absolute inset-0 bg-brand-dark/60 z-0" />
        
        <div className="relative z-10 max-w-lg mx-auto md:max-w-4xl w-full flex flex-col gap-6 text-center md:text-left">
          <h1 
            className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md" 
            dangerouslySetInnerHTML={{ __html: settings.heroTitle }} 
          />
          
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl drop-shadow-sm">
            {settings.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <Link href={`tel:${settings.phoneNumber}`} className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-dark font-extrabold rounded-2xl shadow-xl hover:bg-yellow-500 transition-all active:scale-95 touch-manipulation hover:shadow-yellow-500/20">
              <LucideIcons.Phone size={20} />
              Call Now
            </Link>
            <Link href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-blue border-2 border-transparent font-extrabold rounded-2xl shadow-xl hover:bg-gray-50 transition-all active:scale-95 touch-manipulation">
              <LucideIcons.MessageSquare size={20} />
              WhatsApp Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* SMART AI DIAGNOSIS TEASER */}
      <section className="relative -mt-10 mb-10 px-4 z-20">
         <div className="max-w-6xl mx-auto">
            <div className="bg-brand-dark rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/40 flex flex-col md:flex-row items-center gap-8 border border-white/10 relative overflow-hidden group">
               {/* Decorative background circle */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl group-hover:bg-brand-blue/30 transition-colors" />
               
               <div className="relative z-10 bg-brand-blue/20 p-6 rounded-[2rem] text-white">
                  <div className="relative">
                    <LucideIcons.Cpu size={48} className="animate-pulse" />
                    <LucideIcons.Activity size={24} className="absolute -bottom-2 -right-2 text-brand-gold" />
                  </div>
               </div>
               
               <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/30 border border-brand-blue/50 text-[10px] font-black uppercase tracking-widest text-brand-light">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     Live Fault Scanner Active
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Instant Online Diagnosis</h2>
                  <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl">
                    Facing a technical fault? Our AI Assistant can scan your symptoms and profer immediate mechanical or generator solutions using long-term learning patterns.
                  </p>
               </div>
               
               <div className="relative z-10">
                  <Link href="/diagnosis" className="flex items-center gap-3 px-8 py-5 bg-white text-brand-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-gold hover:scale-105 transition-all shadow-xl active:scale-95">
                    Start Scanning
                    <LucideIcons.ArrowRight size={18} />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* SERVICES QUICK CARDS */}
      <section id="services" className="px-4 py-20 bg-brand-light">
        <div className="max-w-lg mx-auto md:max-w-6xl">
          <div className="text-center mb-16 space-y-3">
             <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">Technical Specialties</h2>
             <p className="text-gray-500 max-w-xl mx-auto">Professional and reliable diagnostics for a wide range of mechanical and electrical systems.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.filter(s => s.isActive).map((service) => {
              // @ts-ignore
              const IconComp = LucideIcons[service.iconName] || LucideIcons.Wrench;
              const anchorId = service.title.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Link 
                  key={service.id} 
                  href={`/services#${anchorId}`}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="bg-brand-blue/5 p-4 rounded-2xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                    <IconComp size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-2 text-xl">{service.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                     Learn More <LucideIcons.ChevronRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENGAGEMENT HUB (CTA BOTS) */}
      <section className="px-4 py-20 bg-white overflow-hidden relative">
         {/* Decorative background gradients */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-full bg-brand-blue/5 rounded-full blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-full bg-brand-gold/5 rounded-full blur-[120px]" />
         </div>

         <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
               
               {/* BOT 1: BOOKING INSPECTION */}
               <Link href="/book" className="group relative block p-1 rounded-[3rem] bg-gradient-to-br from-brand-blue to-blue-900 shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="relative bg-brand-dark/40 backdrop-blur-sm p-8 md:p-12 rounded-[2.9rem] flex flex-col h-full border border-white/10">
                     <div className="flex justify-between items-start mb-12">
                        <div className="bg-white/10 p-5 rounded-[2rem] border border-white/20 text-white shadow-xl">
                           <LucideIcons.Calendar size={40} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           Slot Booking Open
                        </div>
                     </div>
                     
                     <div className="mt-auto space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tighter">Precision <br />Inspection Bot</h3>
                        <p className="text-gray-300 text-sm font-medium max-w-sm">
                           Schedule a professional diagnostic session for your automobile, generator, or industrial machinery. Secure your technical asset health today.
                        </p>
                        <div className="pt-6 flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                           <span className="flex-1 h-px bg-white/20" />
                           <span className="flex items-center gap-2 group-hover:gap-4 transition-all bg-white text-brand-dark px-6 py-4 rounded-2xl shadow-xl">
                              Book Now <LucideIcons.ArrowRight size={18} />
                           </span>
                        </div>
                     </div>
                  </div>
               </Link>

               {/* BOT 2: JOIN NETWORK */}
               <Link href="/onboard" className="group relative block p-1 rounded-[3rem] bg-gradient-to-br from-brand-gold/80 to-yellow-700 shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10" />
                  <div className="relative bg-brand-dark/40 backdrop-blur-sm p-8 md:p-12 rounded-[2.9rem] flex flex-col h-full border border-white/10">
                     <div className="flex justify-between items-start mb-12">
                        <div className="bg-white/10 p-5 rounded-[2rem] border border-white/20 text-brand-gold shadow-xl">
                           <LucideIcons.Users size={40} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-brand-gold/20 rounded-full border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                           <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                           Network Expanding
                        </div>
                     </div>
                     
                     <div className="mt-auto space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tighter text-shadow-xl">Collaborative <br />Artisan Hive</h3>
                        <p className="text-gray-300 text-sm font-medium max-w-sm">
                           Are you a skilled technician? Join our elite local network of professionals and scale your service reach through the Phinovax ecosystem.
                        </p>
                        <div className="pt-6 flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                           <span className="flex-1 h-px bg-white/20" />
                           <span className="flex items-center gap-2 group-hover:gap-4 transition-all bg-brand-gold text-brand-dark px-6 py-4 rounded-2xl shadow-xl">
                              Join Network <LucideIcons.ArrowRight size={18} />
                           </span>
                        </div>
                     </div>
                  </div>
               </Link>

            </div>
         </div>
      </section>

      {/* MAPS & CONTACT SECTION */}
      <section id="contact" className="px-4 py-20 bg-white border-t border-gray-50">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">Visit Our Workshop</h2>
                  <p className="text-gray-500">We are conveniently located along Ankpa Road. Experience precision and care for your technical assets.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                 {[
                   { icon: LucideIcons.MapPin, label: "Location", value: settings.address },
                   { icon: LucideIcons.Mail, label: "Email Address", value: settings.emailAddress },
                   { icon: LucideIcons.Clock, label: "Operating Hours", value: settings.operatingHours },
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-brand-blue">
                         <item.icon size={22} />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</div>
                         <div className="text-gray-800 font-semibold">{item.value}</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group relative">
               {settings.googleMapsEmbed ? (
                 <iframe 
                   src={settings.googleMapsEmbed} 
                   className="w-full h-full border-none" 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade" 
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-4 bg-gray-50">
                    <div className="bg-white p-6 rounded-full shadow-lg text-gray-400 group-hover:scale-110 transition-transform">
                       <LucideIcons.Map size={48} />
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm font-black uppercase text-gray-900 tracking-tight italic">Workshop Coordinates</p>
                       <p className="text-xs text-gray-500 font-medium max-w-[200px] mx-auto">Open Google Maps to view our physical location and get directions.</p>
                    </div>
                    <Link 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all"
                    >
                       Open In Maps <LucideIcons.ExternalLink size={14} />
                    </Link>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

