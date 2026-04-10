"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const chatParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatParent.current) {
      chatParent.current.scrollTop = chatParent.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-blue p-5 text-white flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                     <Bot size={20} />
                  </div>
                  <div>
                     <div className="font-extrabold text-sm leading-tight">Fhinovax Assistant</div>
                     <div className="text-[10px] opacity-80 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Online & Ready to Help
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
                      Hello! I'm your Phinovax Assistant. How can I help you today?
                   </p>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === "user" 
                      ? "bg-brand-blue text-white rounded-tr-none shadow-md" 
                      : "bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                       {m.role === 'user' ? <User size={12} className="opacity-50" /> : <Bot size={12} className="text-brand-blue" />}
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{m.role === 'user' ? 'You' : 'AI'}</span>
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
               <input
                 value={input}
                 onChange={handleInputChange}
                 placeholder="Type your question..."
                 className="flex-grow bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all"
               />
               <button 
                 type="submit" 
                 disabled={!input || isLoading}
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
