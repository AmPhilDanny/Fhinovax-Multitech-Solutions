import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSiteSettings } from "@/app/actions";
import { Shield, Target, Award, Users, CheckCircle2 } from "lucide-react";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-brand-blue py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
           </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Engineering <span className="text-brand-gold">Trust</span> since inception
          </h1>
          <div className="mt-6 w-24 h-1 bg-brand-gold mx-auto" />
          <p className="mt-8 text-xl text-blue-100 font-medium leading-relaxed">
            Fhinovax Multitech Solutions Ltd is the leading technical hub in Makurdi, dedicated to precision diagnostics and professional mechanical integrity.
          </p>
        </div>
      </div>

      {/* Story & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 uppercase">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                 We exist to bridge the gap between complex technical failures and reliable solutions. By combining state-of-the-art AI diagnostics with years of hands-on mechanical expertise, we ensure that your vehicles and generators perform at their peak.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 {[
                   "Advanced AI Diagnostics",
                   "Professional Mechanical Staff",
                   "Transparent Pricing",
                   "Makurdi's Technical Hub"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-2 text-sm font-bold text-brand-blue">
                      <CheckCircle2 size={16} />
                      {text}
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                 <div className="absolute inset-0 bg-brand-blue opacity-10" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={120} className="text-brand-blue/20" />
                 </div>
                 {/* Floating badge */}
                 <div className="absolute bottom-10 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-[200px] animate-bounce">
                    <p className="text-brand-blue font-black text-2xl">100%</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Client Satisfaction</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 px-4">
         <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
               <h2 className="text-3xl font-black text-gray-900 uppercase italic">The Fhinovax Standard</h2>
               <p className="text-gray-500 mt-2 font-medium">Built on four pillars of engineering excellence.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: Shield, title: "Integrity", desc: "Honest assessments and verified repairs, always." },
                 { icon: Target, title: "Precision", desc: "AI-driven diagnostics for pinpoint accuracy." },
                 { icon: Award, title: "Quality", desc: "OEM-standard parts and technical procedures." },
                 { icon: Users, title: "Partnership", desc: "We are your technical allies long-term." }
               ].map((val, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all mb-6">
                       <val.icon size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 uppercase text-lg mb-2">{val.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{val.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team/Location CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-brand-blue rounded-[3rem] p-12 text-center text-white space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">Visit our physical workshop</h2>
           <p className="text-blue-100 text-lg font-medium opacity-80">
              We aren't just an online platform. Visit us at No. 83 Ankpa Road, Makurdi for professional hands-on care.
           </p>
           <a href="/contact" className="inline-block bg-brand-gold text-brand-dark px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all">Get Directions</a>
        </div>
      </section>
    </div>
  );
}
