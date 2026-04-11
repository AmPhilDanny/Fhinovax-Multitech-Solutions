"use client";

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef } from 'react';
import { Wrench, Car, Zap, History, Send, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiagnosisPage() {
  const [userId, setUserId] = useState<string>('');
  const [input, setInput] = useState('');
  
  useEffect(() => {
    let id = localStorage.getItem('phino_diag_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('phino_diag_id', id);
    }
    setUserId(id);
  }, []);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/diagnosis',
      body: { userId },
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const onFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      {/* HEADERBAR */}
      <div className="bg-brand-blue/10 border-b border-brand-blue/20 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue p-2 rounded-lg shadow-lg shadow-brand-blue/20">
             <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">AI Diagnostic Lab</h1>
            <p className="text-[10px] text-brand-blue font-bold uppercase tracking-widest leading-none">Phinovax Digital Assistance</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             AI SYSTEM: ONLINE
           </div>
           <div className="flex items-center gap-2">
             <History size={14} />
             MEMORY ACTIVE
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR - Technical Sidebar */}
        <div className="hidden lg:flex w-80 bg-black/20 border-r border-white/5 flex-col p-6 gap-8">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-blue uppercase tracking-widest">Diagnostic Domains</h3>
              <div className="space-y-2">
                 {[
                   { icon: Car, label: "Automobile Service", desc: "Engines, Gearboxes, ECU" },
                   { icon: Zap, label: "Generator Logic", desc: "AVR, Fuel Line, Alternators" },
                   { icon: Wrench, label: "Technical Support", desc: "General Mechanical Assistance" }
                 ].map((item, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-default">
                      <div className="flex items-center gap-3 mb-2">
                         <item.icon size={18} className="text-brand-blue" />
                         <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-none">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-auto bg-brand-blue/5 border border-brand-blue/20 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-brand-blue">
                 <AlertTriangle size={18} />
                 <span className="font-extrabold text-xs uppercase tracking-tighter">Emergency?</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">If your asset is leaking oil rapidly or showing fire signs, disconnect power and call us immediately.</p>
              <Link href="tel:+2348000000000" className="block text-center py-2 bg-brand-blue text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-brand-blue/80 transition-all">
                Call Workshop
              </Link>
           </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
          {/* BACKGROUND DECOR */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-blue/20 blur-3xl rounded-full" />
                  <Cpu className="text-brand-blue relative z-10" size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Initiate Diagnosis</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Welcome to the Phinovax Assistant. I specialize in identifying technical faults in **Generators** and **Motor Vehicles**. 
                    What issue are you experiencing today?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => { setInput("Generator won't start"); sendMessage({ role: 'user', content: "Generator won't start" }); }} className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-colors uppercase">
                    Generator won't start
                  </button>
                  <button onClick={() => { setInput("Car engine knocking sound"); sendMessage({ role: 'user', content: "Car engine knocking sound" }); }} className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-colors uppercase">
                    Engine Knocking Sound
                  </button>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-2xl ${
                  m.role === 'user' 
                    ? 'bg-brand-blue text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
                }`}>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">
                    {m.role === 'user' ? 'Operator' : 'AI Diagnostic System'}
                  </div>
                  <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {m.content}
                  </div>
                  
                  {m.toolInvocations?.map((tool) => (
                    <div key={tool.toolCallId} className="mt-4 pt-4 border-t border-white/10">
                       {tool.state === 'result' && (
                         <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                            <CheckCircle2 size={14} />
                            Memory Updated: Findings Synchronized
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Analyzing patterns...</span>
                 </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-4 md:p-8 pt-0 relative z-20">
             <form 
               onSubmit={onFormSubmit}
               className="max-w-4xl mx-auto flex items-end gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-brand-blue/50 transition-all shadow-2xl backdrop-blur-lg"
             >
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the mechanical symptom or fault code..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 resize-none py-3 px-4 text-sm max-h-32 min-h-[50px] font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onFormSubmit();
                    }
                  }}
                />
                <button 
                  type="submit"
                  disabled={!input || isLoading}
                  className="bg-brand-blue text-white p-3 rounded-xl hover:bg-brand-blue/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </form>
             <div className="text-center mt-3">
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                 System v2.5.0 // Advanced Fault Recognition Active
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
