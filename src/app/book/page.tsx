import { getActiveServices, getSiteSettings } from "@/app/actions";
import BookingForm from "./BookingForm";
import Link from "next/link";
import { Hammer } from "lucide-react";

export default async function BookPage() {
  const services = await getActiveServices();
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-brand-blue p-2 rounded-lg text-white group-hover:bg-blue-800 transition-all">
                <Hammer size={18} />
              </div>
              <span className="font-black uppercase tracking-widest text-gray-900">{settings.siteName.split(' ')[0]} <span className="text-brand-blue">Booking</span></span>
           </Link>
           <Link href="/services" className="text-xs font-black uppercase text-gray-500 hover:text-brand-blue transition-all">
              View All Specialties
           </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           
           <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest">
                 Professional Technical Services
              </div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight underline decoration-brand-blue decoration-4 underline-offset-8">
                {settings.bookPageTitle || "Request a Precision Technical Inspection Today."}
              </h1>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {settings.bookPageSubtitle || "Whether it's a generator fault or a complex vehicle diagnostic, our verified technicians are ready to deploy to your location."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-brand-blue font-black text-2xl mb-1">24h</div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Rapid Response Team</p>
                 </div>
                 <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-brand-gold font-black text-2xl mb-1">100%</div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Verified Professionals</p>
                 </div>
              </div>
           </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-5">
              <BookingForm 
                services={services} 
                successTitle={settings.bookSuccessTitle || "Request Seeded"}
                successMessage={settings.bookSuccessMessage || "We have received your technical inspection request. A Phinovax representative will call you shortly to confirm the appointment."}
              />
            </div>

        </div>
      </main>

      <footer className="py-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} Phinovax Multitech Solutions Ltd
      </footer>
    </div>
  );
}
