import Link from "next/link";
import { getSiteSettings, getActiveServices } from "./actions";
import * as LucideIcons from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSiteSettings();
  const servicesList = await getActiveServices();

  const heroStyle = settings.heroBgType === 'image' 
    ? { backgroundImage: `url(${settings.heroBgValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
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

            <div className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
               {settings.googleMapsEmbed ? (
                 <iframe 
                   src={settings.googleMapsEmbed} 
                   className="w-full h-full border-none" 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade" 
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <LucideIcons.Map size={48} />
                    <p className="text-sm font-medium">Map location not set in admin panel.</p>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

