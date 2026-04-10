"use client";

import { useState } from "react";
import { 
  Settings, 
  Layout, 
  Wrench, 
  FileText, 
  Menu as MenuIcon, 
  Bot, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight,
  GripVertical
} from "lucide-react";
import { saveSiteSettings, savePage, deletePage, saveService, deleteService, saveNavItem, deleteNavItem } from "@/app/admin/actions";

export default function AdminTabs({ 
  settings, 
  servicesList, 
  pagesList, 
  navItemsList 
}: { 
  settings: any, 
  servicesList: any[], 
  pagesList: any[], 
  navItemsList: any[] 
}) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General & Branding", icon: Settings },
    { id: "hero", label: "Hero Section", icon: Layout },
    { id: "menu", label: "Menu Builder", icon: MenuIcon },
    { id: "pages", label: "Pages Manager", icon: FileText },
    { id: "services", label: "Services master", icon: Wrench },
    { id: "ai", label: "AI & Business", icon: Bot },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 p-1 bg-gray-100 rounded-xl md:bg-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-brand-blue text-white shadow-md active:scale-95" 
                  : "text-gray-600 hover:bg-gray-100 h-full"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-grow bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
        <div className="p-6 md:p-8">
          {activeTab === "general" && (
            <form action={saveSiteSettings} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Site Identity & Global Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Site Name</label>
                  <input name="siteName" defaultValue={settings.siteName} className="admin-input" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Logo URL</label>
                  <input name="logoUrl" defaultValue={settings.logoUrl} className="admin-input" placeholder="/logo.png" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Favicon URL</label>
                  <input name="faviconUrl" defaultValue={settings.faviconUrl} className="admin-input" placeholder="/favicon.ico" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-gray-500">Phone (Calls)</label>
                   <input name="phoneNumber" defaultValue={settings.phoneNumber} className="admin-input" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-gray-500">WhatsApp (No +)</label>
                   <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="admin-input" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Footer Custom Text</label>
                <textarea name="footerText" defaultValue={settings.footerText} className="admin-input h-20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Copyright Text</label>
                <input name="copyrightText" defaultValue={settings.copyrightText} className="admin-input" />
              </div>

              <button type="submit" className="admin-btn-save">
                <Save size={18} /> Save Identity Changes
              </button>
            </form>
          )}

          {activeTab === "hero" && (
            <form action={saveSiteSettings} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section Customization</h2>
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Hero Main Title</label>
                <input name="heroTitle" defaultValue={settings.heroTitle} className="admin-input font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Hero Subtitle</label>
                <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} className="admin-input h-24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-gray-500 block">Background Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="heroBgType" value="color" defaultChecked={settings.heroBgType === 'color'} />
                      <span className="text-sm font-medium">Solid Color</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="heroBgType" value="image" defaultChecked={settings.heroBgType === 'image'} />
                      <span className="text-sm font-medium">Image</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-gray-500">Background Value (Hex or URL)</label>
                   <input name="heroBgValue" defaultValue={settings.heroBgValue} className="admin-input" placeholder="#000 / /hero-bg.jpg" />
                </div>
              </div>

              <button type="submit" className="admin-btn-save">
                <Save size={18} /> Apply Hero Updates
              </button>
            </form>
          )}

          {activeTab === "menu" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Menu & Submenu Builder</h2>
                <div className="flex gap-2">
                   <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-1 rounded font-bold uppercase">Dynamic Menu</span>
                </div>
              </div>

              {/* Current Menu Items */}
              <div className="space-y-3">
                 {navItemsList.length === 0 && <p className="text-gray-400 italic text-sm">No menu items yet. Add your first link below.</p>}
                 {navItemsList.map((item) => (
                   <div key={item.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 ${item.parentId ? 'ml-8 bg-blue-50/30' : ''}`}>
                      <div className="flex items-center gap-3">
                         {item.parentId ? <ChevronRight size={14} className="text-brand-blue" /> : <GripVertical size={16} className="text-gray-300" />}
                         <div>
                            <span className="font-bold text-gray-700">{item.label}</span>
                            <span className="text-xs text-gray-400 ml-2">{item.href}</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => deleteNavItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Add New Item Form */}
              <div className="pt-6 border-t mt-8">
                 <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Add New Menu Link</h3>
                 <form action={saveNavItem} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-1">
                       <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Label</label>
                       <input name="label" placeholder="e.g. Home" className="admin-input text-xs" required />
                    </div>
                    <div className="md:col-span-1">
                       <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Link (href)</label>
                       <input name="href" placeholder="/" className="admin-input text-xs" required />
                    </div>
                    <div className="md:col-span-1">
                       <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Parent Link</label>
                       <select name="parentId" className="admin-input text-xs appearance-none">
                          <option value="">None (Top Level)</option>
                          {navItemsList.filter(i => !i.parentId).map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                       </select>
                    </div>
                    <div className="md:col-span-1">
                       <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Order</label>
                       <input name="orderIndex" type="number" defaultValue="0" className="admin-input text-xs" />
                    </div>
                    <button type="submit" className="bg-brand-blue text-white rounded-lg h-[42px] flex items-center justify-center gap-2 font-bold text-xs hover:bg-blue-800 transition-colors px-4">
                       <Plus size={16} /> Add Link
                    </button>
                 </form>
              </div>
            </div>
          )}

          {activeTab === "pages" && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Custom Pages Manager</h2>
              
              {/* Add/Edit Page Area */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                 <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Create New Page</h3>
                 <form action={savePage} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input name="title" placeholder="Page Title (e.g. About Us)" className="admin-input" required />
                       <input name="slug" placeholder="Slug (e.g. about-us)" className="admin-input" required />
                    </div>
                    <textarea name="content" placeholder="Page Content (HTML support)" className="admin-input h-48" required />
                    <div className="flex items-center justify-between">
                       <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="checkbox" name="isPublished" className="w-4 h-4" />
                          <span>Publish immediately</span>
                       </label>
                       <button type="submit" className="admin-btn-save-sm">
                          <Plus size={16} /> Create Page
                       </button>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Note: Dynamic pages created here are hidden until added to the Menu Builder.</p>
                 </form>
              </div>

              {/* List of Pages */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold uppercase text-gray-500">Existing Pages</h3>
                 <div className="grid grid-cols-1 gap-3">
                    {pagesList.map(page => (
                       <div key={page.id} className="flex items-center justify-between p-4 border rounded-xl hover:border-brand-blue transition-colors">
                          <div className="flex flex-col">
                             <span className="font-bold text-gray-800">{page.title}</span>
                             <span className="text-xs text-gray-400">/{page.slug} • {page.isPublished ? 'Published' : 'Hidden'}</span>
                          </div>
                          <button onClick={() => deletePage(page.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8">
               <h2 className="text-xl font-bold text-gray-900">Services & Specialty Controls</h2>
               
               <form action={saveService} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="md:col-span-2">
                     <label className="text-xs font-bold uppercase text-gray-500">New Service Title</label>
                     <input name="title" className="admin-input" required />
                  </div>
                  <div className="md:col-span-2">
                     <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                     <textarea name="description" className="admin-input h-20" required />
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500">Lucide Icon Name</label>
                     <input name="iconName" placeholder="Wrench, Car, Search..." className="admin-input" defaultValue="Wrench" />
                  </div>
                  <div className="flex items-end">
                     <button type="submit" className="admin-btn-save-sm w-full">
                        <Plus size={18} /> Add Specialty
                     </button>
                  </div>
               </form>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicesList.map(service => (
                    <div key={service.id} className="p-5 border rounded-2xl flex flex-col gap-3 relative group">
                        <button onClick={() => deleteService(service.id)} className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 size={14} />
                        </button>
                        <div className="text-brand-blue font-bold text-lg">{service.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{service.description}</div>
                        <div className="text-[10px] text-gray-400 font-mono">Icon: {service.iconName}</div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "ai" && (
            <form action={saveSiteSettings} className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                     <Bot size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 leading-tight">AI & Business Context</h2>
                     <p className="text-xs text-gray-500">Configure how Gemini interacts with your customers.</p>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Google Maps Embed URL (Iframe Src)</label>
                  <input name="googleMapsEmbed" defaultValue={settings.googleMapsEmbed} className="admin-input" placeholder="https://www.google.com/maps/embed?..." />
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Google Business Details (SEO & AI Context)</label>
                  <textarea name="googleBusinessDetails" 
                    defaultValue={settings.googleBusinessDetails} 
                    className="admin-input h-32" 
                    placeholder="Provide full description of the business, registered name, services depth..." 
                  />
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">AI Personality & Hidden Instructions</label>
                  <textarea name="aiInstructions" 
                    defaultValue={settings.aiInstructions} 
                    className="admin-input h-32" 
                    placeholder="Be professional, always mention workshop at Ankpa road, ask for phone number..." 
                  />
                  <p className="text-[10px] text-gray-400 italic">This content is injected into the Gemini API system prompt but never shown to users.</p>
               </div>

               <div className="border-t pt-6">
                  <button type="submit" className="admin-btn-save">
                    <Save size={18} /> Update Business Logic
                  </button>
               </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
