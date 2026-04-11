import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as LucideIcons from "lucide-react";
import { getSiteSettings } from "@/app/actions";

export default async function ServicesPage() {
  let allServices = await db.select().from(services).where(eq(services.isActive, true));
  
  // Self-seeding logic if the database is fresh/empty
  if (allServices.length === 0) {
     const defaults = [
        { title: "Generator Diagnostic Lab", description: "Advanced electronic troubleshooting and load testing for industrial power sets.", iconName: "Zap", isActive: true },
        { title: "Precision Micro-Engineering", description: "High-tolerance component fabrication and engine block recovery.", iconName: "Cpu", isActive: true },
        { title: "Industrial Electrical Sytems", description: "Design, installation, and maintenance of heavy-duty power distribution networks.", iconName: "Layers", isActive: true },
        { title: "Hydraulic System Recovery", description: "Specialized repair and optimization for heavy machinery hydraulic circuits.", iconName: "Activity", isActive: true }
     ];
     await db.insert(services).values(defaults);
     allServices = await db.select().from(services).where(eq(services.isActive, true));
  }

  const settings = await getSiteSettings();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-blue py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase">
            Technical <span className="text-brand-gold">Capabilities</span>
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl font-medium">
            Advanced diagnostic solutions and mechanical excellence for generators and vehicles.
          </p>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tight">Our Core Specialties</h2>
            <div className="w-20 h-1.5 bg-brand-gold mx-auto mt-4 rounded-full" />
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allServices.map((service) => {
               // @ts-ignore
               const IconComp = LucideIcons[service.iconName] || LucideIcons.Wrench;
               const anchorId = service.title.toLowerCase().replace(/\s+/g, '-');
               return (
                  <a 
                    key={service.id} 
                    href={`#${anchorId}`}
                    className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center gap-4 hover:bg-white hover:shadow-xl transition-all group"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                        <IconComp size={32} />
                     </div>
                     <div className="font-black text-gray-900 uppercase text-xs tracking-widest">{service.title}</div>
                  </a>
               );
            })}
         </div>
      </div>

      {/* Elaborative Details Sections */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-40 mb-20">
        {allServices.map((service, idx) => {
          // @ts-ignore
          const IconComp = LucideIcons[service.iconName] || LucideIcons.Wrench;
          const anchorId = service.title.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <section 
              key={service.id} 
              id={anchorId}
              className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center scroll-mt-32`}
            >
              <div className="w-full md:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-blue/20">
                  <IconComp size={14} />
                  Phinovax Technical Specialty
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase italic">
                  {service.title}
                </h2>
                <div className="w-24 h-2 bg-brand-gold rounded-full" />
                <p className="text-xl text-gray-600 leading-relaxed font-medium italic border-l-4 border-gray-100 pl-6">
                  "{service.description}"
                </p>
                
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue">Detailed Technical Exposition</h3>
                  {service.detailedContent ? (
                    <div 
                      className="prose prose-blue max-w-none text-gray-700 leading-relaxed bg-brand-blue/[0.02] p-10 rounded-[3rem] border border-brand-blue/5 shadow-inner"
                      dangerouslySetInnerHTML={{ __html: service.detailedContent }}
                    />
                  ) : (
                    <div className="p-12 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                       <LucideIcons.Construction size={40} className="text-gray-300" />
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Awaiting Specialized Documentation</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="aspect-square bg-white rounded-[4rem] flex items-center justify-center p-16 relative shadow-2xl border border-gray-50 overflow-hidden group">
                   {/* Background logic/branding */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/[0.03] to-transparent" />
                   
                   <div className="relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3">
                      <div className="bg-brand-blue text-white p-16 rounded-[3.5rem] shadow-2xl shadow-brand-blue/30 relative">
                         <IconComp size={120} strokeWidth={1} />
                         <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-blue shadow-lg">
                           <LucideIcons.Cpu size={24} />
                         </div>
                      </div>
                   </div>

                   {/* Floating accents */}
                   <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse" />
                   <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-brand-blue/20" />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
           <h2 className="text-3xl font-black text-gray-900 uppercase italic">Ready to fix your asset?</h2>
           <p className="text-gray-500 font-medium">Contact our technical team or use our AI Diagnostic Lab for an instant assessment.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="/book" className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-800 transition-all shadow-lg active:scale-95">Book Inspection</a>
              <a href="/" className="bg-white border-2 border-brand-blue text-brand-blue px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-brand-blue hover:text-white transition-all active:scale-95">Open AI Diag Lab</a>
            </div>
        </div>
      </div>
    </div>
  );
}
