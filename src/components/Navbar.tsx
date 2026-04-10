"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export interface NavItem {
  id: number;
  label: string;
  href: string;
  parentId: number | null;
  isActive: boolean;
  orderIndex: number;
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
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-white z-[60] p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          {topLevelItems.map((item) => {
            const subItems = getSubItems(item.id);
            const hasSub = subItems.length > 0;
            const isSubOpen = activeSubmenu === item.id;

            return (
              <div key={item.id} className="flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-50 py-3">
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
                       className={`p-2 rounded-lg bg-gray-50 ${isSubOpen ? 'rotate-180' : ''} transition-transform`}
                     >
                       <ChevronDown size={20} />
                     </button>
                   )}
                </div>
                
                {hasSub && isSubOpen && (
                  <div className="pl-4 mt-2 space-y-3 animate-in slide-in-from-left-2">
                     {subItems.map(sub => (
                       <Link 
                         key={sub.id} 
                         href={sub.href}
                         onClick={() => setIsOpen(false)}
                         className="block text-gray-500 font-medium py-2 border-l-2 border-brand-blue/20 pl-4"
                       >
                         {sub.label}
                       </Link>
                     ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

