"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({ siteName, logoUrl }: { siteName: string; logoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
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
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#services" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Services</Link>
          <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Contact</Link>
          <Link href="/admin" className="text-sm font-bold text-brand-blue px-4 py-2 rounded-lg border border-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
            Admin Panel
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-blue p-1 rounded hover:bg-gray-50 focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-white border-b border-gray-100 shadow-md z-40 p-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <Link href="#services" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700 py-2 border-b border-gray-50">Services</Link>
          <Link href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700 py-2 border-b border-gray-50">Contact info</Link>
          <div className="pt-2">
             <Link href="/admin" className="block text-center text-sm font-bold bg-brand-blue text-white px-4 py-3 rounded-lg">
                Admin Panel
              </Link>
          </div>
        </div>
      )}
    </>
  );
}
