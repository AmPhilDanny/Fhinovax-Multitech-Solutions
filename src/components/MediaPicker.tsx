"use client";

import { useState } from "react";
import { Image as ImageIcon, Search, X, Check, Copy } from "lucide-react";

export default function MediaPicker({ 
  mediaList, 
  onSelect, 
  onClose 
}: { 
  mediaList: any[], 
  onSelect: (url: string) => void, 
  onClose: () => void 
}) {
  const [search, setSearch] = useState("");

  const filtered = mediaList.filter(m => 
    m.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-brand-blue/10 p-2 rounded-xl text-brand-blue">
                <ImageIcon size={20} />
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Media Library Picker</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select an existing asset to use</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
           <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              />
           </div>
        </div>

        {/* Grid */}
        <div className="flex-grow p-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <ImageIcon size={48} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 italic">No media found matching "{search}"</p>
              </div>
            )}
            {filtered.map((asset) => (
              <div 
                key={asset.id} 
                className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-blue transition-all cursor-pointer shadow-sm hover:shadow-lg active:scale-95"
                onClick={() => onSelect(asset.url)}
              >
                <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/10 transition-colors flex items-center justify-center">
                   <div className="bg-white/95 scale-0 group-hover:scale-100 p-2 rounded-full text-brand-blue shadow-xl transition-all">
                      <Check size={20} />
                   </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-[10px] text-white font-black truncate text-center">{asset.fileName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Double click or click to select and apply</p>
        </div>
      </div>
    </div>
  );
}
