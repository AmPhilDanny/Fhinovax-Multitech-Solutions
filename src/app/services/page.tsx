import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as LucideIcons from "lucide-react";
import { getSiteSettings } from "@/app/actions";

export default async function ServicesPage() {
  const allServices = await db.select().from(services).where(eq(services.isActive, true));
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

      {/* Services List */}
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-32">
        {allServices.map((service, idx) => {
          // @ts-ignore
          const IconComp = LucideIcons[service.iconName] || LucideIcons.Wrench;
          // Create anchor ID from title
          const anchorId = service.title.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <section 
              key={service.id} 
              id={anchorId}
              className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center scroll-mt-24`}
            >
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/5 text-brand-blue rounded-full text-xs font-black uppercase tracking-widest">
                  <IconComp size={16} />
                  Specialty Service
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {service.title}
                </h2>
                <div className="w-20 h-1.5 bg-brand-gold rounded-full" />
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {service.description}
                </p>
                {service.detailedContent ? (
                  <div 
                    className="prose prose-blue max-w-none text-gray-700 leading-relaxed bg-gray-50 p-8 rounded-[2rem] border border-gray-100"
                    dangerouslySetInnerHTML={{ __html: service.detailedContent }}
                  />
                ) : (
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center">
                     <p className="text-sm text-gray-400 italic">Detailed technical documentation is currently being updated by our engineers.</p>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 rounded-[3rem] flex items-center justify-center p-12 border border-brand-blue/5 relative group">
                   <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                   <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-brand-blue group-hover:scale-110 transition-transform duration-500">
                      <IconComp size={100} strokeWidth={1.5} />
                   </div>
                   
                   {/* Decorative elements */}
                   <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-brand-gold animate-ping" />
                   <div className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-brand-blue/20" />
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
             <a href="/contact" className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-800 transition-all shadow-lg active:scale-95">Book Inspection</a>
             <a href="/diagnosis" className="bg-white border-2 border-brand-blue text-brand-blue px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-brand-blue hover:text-white transition-all active:scale-95">Open AI Diag Lab</a>
           </div>
        </div>
      </div>
    </div>
  );
}
