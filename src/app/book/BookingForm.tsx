'use client';

import { useState } from "react";
import { saveBooking } from "@/app/actions";
import { CheckCircle, Loader2, ArrowRight, Magnet } from "lucide-react";
import Link from "next/link";

export default function BookingForm({ 
  services,
  successTitle,
  successMessage 
}: { 
  services: any[],
  successTitle: string,
  successMessage: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await saveBooking(formData);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(res.error || "Failed to submit request.");
      }
    } catch (err) {
      setStatus('error');
      setError("Network error occurred.");
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
           <CheckCircle size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">{successTitle || "Request Seeded"}</h3>
        <p className="text-gray-500 font-medium mb-8">
           {successMessage || "We have received your technical inspection request. A Phinovax representative will call you shortly to confirm the appointment."}
        </p>
        <Link href="/" className="inline-flex items-center gap-2 text-brand-blue font-black text-xs uppercase tracking-widest hover:underline">
          Return to home <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Your Full Name</label>
         <input name="clientName" required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all" placeholder="e.g. Samuel Ade" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Phone Number</label>
            <input name="clientPhone" required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all" placeholder="080 0000 0000" />
         </div>
         <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Location</label>
            <input name="location" required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all" placeholder="e.g. Wurukum, Makurdi" />
         </div>
      </div>

      <div className="space-y-1.5">
         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Service Category</label>
         <select name="serviceId" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all appearance-none cursor-pointer">
            <option value="">General Technical Support</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
         </select>
      </div>

      <div className="space-y-1.5">
         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Issue Description</label>
         <textarea 
           name="issueDescription" 
           required 
           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all h-32" 
           placeholder="Describe the mechanical or electrical problem..."
         />
      </div>

      <div className="space-y-1.5">
         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Preferred Date</label>
         <input type="date" name="preferredDate" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all" />
      </div>

      <div className="pt-4">
         <button 
           type="submit" 
           disabled={status === 'loading'}
           className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
         >
            {status === 'loading' ? (
              <> <Loader2 className="animate-spin" /> Processing... </>
            ) : (
              <> Confirm Request <Magnet size={16} /> </>
            )}
         </button>
      </div>

      {status === 'error' && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest italic">{error}</p>}
    </form>
  );
}
