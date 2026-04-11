"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Bot } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export interface NavItem {
  id: number;
  label: string;
  href: string;
  parentId: number | null;
  isActive: boolean | null;
  orderIndex: number;
  createdAt?: Date | null;
}


export default function Navbar({ 
  siteName, 
  logoUrl, 
  navItems = [] 
}: { 
  siteName: string; 
  logoUrl?: string;
  navItems?: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  // Filter top-level items
  const topLevelItems = navItems
    .filter(item => !item.parentId && item.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const getSubItems = (parentId: number) => 
    navItems.filter(item => item.parentId === parentId && item.isActive)
           .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-10 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold text-sm">
                {siteName.charAt(0)}
              </div>
              <span className="font-extrabold text-brand-blue uppercase tracking-tight text-lg truncate max-w-[200px]">{siteName}</span>
            </div>
          )}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {topLevelItems.map((item) => {
            const subItems = getSubItems(item.id);
            const hasSub = subItems.length > 0;

            return (
              <div key={item.id} className="relative group">
                <Link 
                  href={item.href} 
                  className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-brand-blue transition-colors py-2"
                >
                  {item.label}
                  {hasSub && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                </Link>

                {hasSub && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-xl py-2 min-w-[200px]">
                      {subItems.map(sub => (
                        <Link 
                          key={sub.id} 
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue font-medium"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Nav Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-blue p-2 rounded-xl hover:bg-gray-50 focus:outline-none transition-colors">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[60px] bg-white z-[60] overflow-y-auto p-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
            {/* Optional: Add Home link specifically for mobile if needed, or ensure it's in navItems */}
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between border-b border-gray-50 py-4 text-xl font-black text-brand-blue italic uppercase tracking-tighter"
            >
              Home
            </Link>

            {topLevelItems.map((item) => {
              const subItems = getSubItems(item.id);
              const hasSub = subItems.length > 0;
              const isSubOpen = activeSubmenu === item.id;

              return (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-50 py-4">
                     <Link 
                       href={item.href} 
                       onClick={() => setIsOpen(false)}
                       className="text-xl font-bold text-gray-800"
                     >
                       {item.label}
                     </Link>
                     {hasSub && (
                       <button 
                         onClick={() => setActiveSubmenu(isSubOpen ? null : item.id)}
                         className={`p-2 rounded-xl bg-gray-50 ${isSubOpen ? 'rotate-180 text-brand-blue' : 'text-gray-400'} transition-all`}
                       >
                         <ChevronDown size={22} />
                       </button>
                     )}
                  </div>
                  
                  {hasSub && isSubOpen && (
                    <div className="pl-6 mt-1 space-y-1 mb-2 animate-in slide-in-from-left-4 duration-300">
                       {subItems.map(sub => (
                         <Link 
                           key={sub.id} 
                           href={sub.href}
                           onClick={() => setIsOpen(false)}
                           className="block text-gray-400 font-bold py-3 border-l-2 border-brand-blue/5 pl-4 hover:border-brand-blue hover:text-brand-blue transition-all"
                         >
                           — {sub.label}
                         </Link>
                       ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Support/Call CTA in Mobile Menu */}
            <div className="mt-8 space-y-3">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Technical Assistance</p>
               <Link 
                 href="/diagnosis" 
                 onClick={() => setIsOpen(false)}
                 className="flex items-center justify-center gap-3 w-full bg-brand-blue text-white py-4 rounded-2xl font-black uppercase tracking-tighter shadow-xl shadow-brand-blue/20"
               >
                 <Bot size={20} /> AI Diag Lab
               </Link>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

