"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget({ agentName = "Phinovax AI" }: { agentName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    api: "/api/chat",
  });
  const [errorVisible, setErrorVisible] = useState(false);
  const chatParent = useRef<HTMLDivElement>(null);

  const isTyping = (status as string) === "submitted" || (status as string) === "streaming";

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    setErrorVisible(false);
    const currentInput = input;
    setInput(""); 
    
    // Safety timeout for mobile users
    const timer = setTimeout(() => {
      if ((status as string) === "submitted" || (status as string) === "streaming") {
         setErrorVisible(true);
      }
    }, 20000);

    try {
      await sendMessage({ content: currentInput, role: 'user' } as any);
      clearTimeout(timer);
    } catch (err) {
      console.error("Chat Error:", err);
      setErrorVisible(true);
      clearTimeout(timer);
    }
  };

  useEffect(() => {
    if (chatParent.current) {
      chatParent.current.scrollTop = chatParent.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)]">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full sm:w-[380px] h-[500px] sm:h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-blue p-5 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">{agentName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]"></span>
                    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Active Specialist</span>
                  </div>
                </div>
              </div>

               <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <ChevronDown size={20} />
               </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatParent}
              className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50/50"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-3">
                   <div className="bg-brand-blue/5 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-brand-blue">
                      <Bot size={24} />
                   </div>
                   <p className="text-sm text-gray-400 font-medium px-6">
                      Hello! I'm your {agentName}. How can I help you today?
                   </p>
                </div>
              )}
              
              <div className="space-y-4">
                {messages.map((m: any, i: number) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-br-none border-t border-l border-white/10' 
                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                    }`}>
                       <div className="flex items-center gap-1.5 mb-1 opacity-70">
                          {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                          <span className="text-[9px] font-black uppercase tracking-widest">{m.role === 'user' ? 'You' : agentName}</span>
                       </div>
                       {m.content}
                    </div>
                  </div>
                ))}
                {isTyping && !errorVisible && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-[0_4px_15px_rgba(0,0,0,0.05)] space-y-2">
                       <div className="flex gap-1.5 px-1 pt-1">
                          <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" />
                       </div>
                       <p className="text-[9px] text-brand-blue font-black uppercase tracking-widest opacity-40">Phinovax Thinking...</p>
                    </div>
                  </div>
                )}
                {errorVisible && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="p-5 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-3xl text-center space-y-3 shadow-xl"
                   >
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                         <Bot size={20} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs text-red-700 font-black uppercase tracking-tight">Technical Delay Detected</p>
                         <p className="text-[10px] text-red-600/70 font-medium">The AI is taking longer than usual to respond. This might be due to server load or a key issue.</p>
                      </div>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="w-full text-[10px] bg-red-600 text-white py-2.5 rounded-xl font-black uppercase tracking-tighter hover:bg-red-700 transition-all shadow-md active:scale-95"
                      >
                        Try Refreshing Assistant
                      </button>
                   </motion.div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={onFormSubmit} className="p-4 bg-white border-t flex gap-2">
               <input
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Type your question..."
                 className="flex-grow bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all"
               />
                <button 
                  type="submit" 
                  disabled={!input || isTyping}
                 className="bg-brand-blue text-white p-3 rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-md active:scale-95"
               >
                 <Send size={18} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-blue text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-all border-4 border-white group relative"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
           <span className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}
