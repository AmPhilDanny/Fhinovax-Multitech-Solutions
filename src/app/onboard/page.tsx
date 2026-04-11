'use client';

import { useState } from "react";
import { Hammer, ShieldCheck, Zap, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { onboardArtisan } from "@/app/actions";
import Link from "next/link";

export default function OnboardArtisanPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await onboardArtisan(formData);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(res.error || "Failed to submit application.");
      }
    } catch (err) {
      setStatus('error');
      setError("A network error occurred.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Application Received!</h1>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">
            Thank you for joining the Phinovax Network. Our technical team will review your qualifications and contact you shortly.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-brand-blue/20">
            Return Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Branding & Hero */}
      <div className="lg:w-1/2 relative overflow-hidden bg-brand-blue min-h-[40vh] lg:min-h-screen flex flex-col justify-end p-8 md:p-16">
        <img 
          src="/images/onboard-hero.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          alt="Technical Onboarding"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/40 to-transparent" />
        
        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-blue font-black text-xl shadow-lg">F</div>
              <span className="text-white font-black uppercase tracking-widest text-lg">Phinovax <span className="text-brand-gold">Network</span></span>
            </div>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Elevate Your <span className="text-brand-gold">Engineering</span> Career.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
            Join the most advanced technical service network in Nigeria. We link top-tier mechanics and technicians with premium clients.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-8">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Verified Leads</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <Zap size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Fast Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Onboarding Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50/50">
        <div className="max-w-xl w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Artisan Registration</h2>
            <p className="text-gray-500 font-medium">Complete the form below to begin your verification process.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Full Name</label>
                   <input 
                     name="name" 
                     required 
                     placeholder="John Doe"
                     className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Specialty</label>
                   <select 
                     name="specialty" 
                     required
                     className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm appearance-none"
                   >
                      <option value="">Select Specialty</option>
                      <option value="Mechanical Engineer">Mechanical Engineer</option>
                      <option value="Auto Electrician">Auto Electrician</option>
                      <option value="Generator Specialist">Generator Specialist</option>
                      <option value="HVAC Systems">HVAC Systems</option>
                      <option value="Digital Diagnostics">Digital Diagnostics</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Phone Number</label>
                   <input 
                     name="phoneNumber" 
                     required 
                     placeholder="+234..."
                     className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Location (Town/City)</label>
                   <input 
                     name="location" 
                     required 
                     placeholder="e.g. Makurdi"
                     className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Years of Experience</label>
                <input 
                  type="number"
                  name="yearsExperience" 
                  required 
                  min="0"
                  placeholder="5"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Brief Bio / Key Equipment</label>
                <textarea 
                  name="bio" 
                  required 
                  placeholder="Tell us about your workshop or the tools you use..."
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm h-32"
                />
             </div>

             <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-brand-blue text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/30 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {status === 'loading' ? (
                     <> <Loader2 className="animate-spin" /> Verifying... </>
                   ) : (
                     <> Join Network <ArrowRight size={18} /> </>
                   )}
                </button>
             </div>

             {status === 'error' && (
               <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                 <Zap size={14} /> {error}
               </div>
             )}
          </form>

          <p className="mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
            By joining, you agree to Phinovax Multitech technical standards and professional conduct guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
