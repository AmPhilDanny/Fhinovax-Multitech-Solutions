import { getSiteSettings } from "@/app/actions";
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, Map as MapIcon } from "lucide-react";
import Link from "next/link";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const channels = [
    { 
      icon: Phone, 
      label: "Call Support", 
      value: settings.phoneNumber, 
      href: `tel:${settings.phoneNumber}`,
      color: "bg-blue-500" 
    },
    { 
      icon: MessageSquare, 
      label: "WhatsApp Business", 
      value: "Chat Now", 
      href: `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`,
      color: "bg-green-500" 
    },
    { 
      icon: Mail, 
      label: "Email Address", 
      value: settings.emailAddress, 
      href: `mailto:${settings.emailAddress}`,
      color: "bg-brand-gold" 
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-blue py-20 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Get in <span className="text-brand-gold">Touch</span>
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl font-medium">
            Contact the Fhinovax technical team for professional diagnostics and workshop services.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Details Side */}
          <div className="lg:col-span-1 space-y-8">
             <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 uppercase">Contact Channels</h2>
                <p className="text-gray-500 text-sm font-medium">Choose your preferred way to reach out. We typically respond within 15 minutes during operating hours.</p>
             </div>

             <div className="space-y-4">
                {channels.map((chan, idx) => (
                  <a 
                    key={idx} 
                    href={chan.href}
                    className="flex items-center gap-4 p-5 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-brand-blue hover:bg-white hover:shadow-xl transition-all group"
                  >
                     <div className={`${chan.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <chan.icon size={20} />
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{chan.label}</div>
                        <div className="text-gray-900 font-extrabold">{chan.value}</div>
                     </div>
                  </a>
                ))}
             </div>

             <div className="p-8 bg-brand-blue/5 rounded-[2.5rem] border border-brand-blue/10 space-y-4">
                <div className="flex items-center gap-2 text-brand-blue">
                   <Clock size={20} />
                   <span className="font-black uppercase text-xs">Operating Hours</span>
                </div>
                <p className="text-gray-700 font-bold">{settings.operatingHours}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Physical workshop is closed on Sundays and Public Holidays.</p>
             </div>
          </div>

          {/* Map & Location Main */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white border border-gray-100 rounded-[3rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
                         <MapPin size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-900 uppercase">Our Location</h3>
                         <p className="text-xs text-gray-400 font-bold">{settings.address}</p>
                      </div>
                   </div>
                   <a 
                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                     target="_blank"
                     className="text-[10px] font-black uppercase text-brand-blue hover:underline flex items-center gap-1"
                   >
                     Get precise GPS <ExternalLink size={12} />
                   </a>
                </div>

                <div className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group relative">
               {settings.googleMapsEmbed && settings.googleMapsEmbed.includes('google.com/maps/embed') ? (
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
                       <MapIcon size={48} />
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
                       Open In Maps <ExternalLink size={14} />
                    </Link>
                 </div>
               )}
            </div>
             </div>

             <div className="bg-brand-gold p-8 rounded-[3rem] flex items-center justify-between text-brand-dark gap-6">
                <div className="space-y-1">
                   <h4 className="font-black uppercase italic text-xl">Technical issue right now?</h4>
                   <p className="text-sm font-bold opacity-70">Our AI Diagnostic Lab is available 24/7 for instant troubleshooting.</p>
                </div>
                <a href="/diagnosis" className="bg-brand-dark text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">Start Diagnosis</a>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
