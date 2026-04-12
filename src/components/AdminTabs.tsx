"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
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
  ExternalLink,
  Activity,
  Image as ImageIcon,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Search,
  Share2,
  Globe,
  Upload,
  Loader2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  MousePointer2,
  Users,
  Hammer,
  ClipboardList,
  Calendar,
  Construction,
  Cpu,
  ArrowRight,
  Map,
  GripHorizontal,
  PanelBottom,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { Facebook, Instagram, Twitter, Linkedin } from "./Icons";
import MediaPicker from "./MediaPicker";
import { 
  saveSiteSettings, 
  savePage, 
  deletePage, 
  saveService, 
  deleteService, 
  saveNavItem,
  updateNavItem,
  updateNavItemsBatch,
  deleteNavItem,
  approveAiPost,
  discardAiPost,
  deleteLead,
  updateLeadStatus,
  updateArtisanStatus,
  updateBookingStatus,
  assignArtisanToBooking
} from "@/app/admin/actions";

export default function AdminTabs({ 
  initialTab = "dashboard",
  settings, 
  servicesList, 
  pagesList, 
  navItemsList,
  aiPostsList = [],
  leadsList = [],
  metrics = { dailyHits: 0, totalHits: 0, totalLeads: 0, seoScore: 0, aiStatus: "Key Missing", marketingHealth: "Neutral" },
  mediaAssetsList = [],
  artisansList = [],
  bookingsList = []
}: { 
  initialTab?: string,
  settings: any, 
  servicesList: any[], 
  pagesList: any[], 
  navItemsList: any[],
  aiPostsList?: any[],
  leadsList?: any[],
  metrics?: any,
  mediaAssetsList?: any[],
  artisansList?: any[],
  bookingsList?: any[]
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab || "dashboard");

  // Sync tab to URL so layout sidebar stays in context
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/admin?tab=${tabId}`, { scroll: false });
  };

  // Ensure internal state updates when the URL changes (prop change)
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [uploading, setUploading] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedMediaTarget, setSelectedMediaTarget] = useState<string | null>(null);
  const [bgType, setBgType] = useState(settings.heroBgType || "color");
  const [editingService, setEditingService] = useState<any>(null);

  // Controlled state for all settings forms — synced from server props after each save
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const updateField = (field: string, value: string) =>
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }));

  const [previews, setPreviews] = useState({
    logoUrl: settings.logoUrl || "",
    faviconUrl: settings.faviconUrl || "",
    heroBgValue: settings.heroBgValue || "",
    ogImageUrl: settings.ogImageUrl || "",
    aiApiKey: settings.aiApiKey || ""
  });

  // Local state for dragging (optimistic UI)
  const [localNavItems, setLocalNavItems] = useState(navItemsList);

  useEffect(() => {
    setLocalNavItems(navItemsList);
  }, [navItemsList]);

  const handleNavReorder = async (newOrder: any[]) => {
    setLocalNavItems(newOrder); // Instant UI update
    
    // Create batch and save
    const batch = newOrder.map((item, idx) => ({
      id: item.id,
      orderIndex: idx
    }));

    setUploading('menu');
    try {
      await updateNavItemsBatch(batch);
      router.refresh(); // Sync potential server changes
    } catch (e) {
      console.error(e);
      alert("Failed to sync new order.");
    } finally {
      setUploading(null);
    }
  };

  const handleSubReorder = async (parentId: number, newSubOrder: any[]) => {
    // Merge new sub order back into the master list
    const otherItems = localNavItems.filter(i => i.parentId !== parentId);
    const updatedMaster = [...otherItems, ...newSubOrder];
    setLocalNavItems(updatedMaster);

    const batch = newSubOrder.map((item, idx) => ({
      id: item.id,
      orderIndex: idx
    }));

    setUploading('menu');
    try {
      await updateNavItemsBatch(batch);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  const handleMoveNavItem = async (id: number, direction: 'up' | 'down') => {
    // Old button logic (kept for fallback but will be replaced by DND UI)
    if (id >= 990) {
      alert("This is a system default link. Default links (Home, Services, etc.) should stay fixed for UX consistency. Use the Navigator to order custom pages.");
      return;
    }

    const filtered = navItemsList
      .filter((i: any) => !i.parentId)
      .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      
    const currentIndex = filtered.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    // Build the new sequence
    const newList = [...filtered];
    const item = newList.splice(currentIndex, 1)[0];
    newList.splice(targetIndex, 0, item);

    setUploading('menu');
    try {
      // Create batch update payload
      const batch = newList.map((item, idx) => ({
        id: item.id,
        orderIndex: idx
      }));
      
      await updateNavItemsBatch(batch);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to reorder. Check connection.");
    } finally {
      setUploading(null);
    }
  };

  const handleMoveSubItem = async (parentId: number, id: number, direction: 'up' | 'down') => {
    const filtered = navItemsList
      .filter((i: any) => i.parentId === parentId)
      .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    const currentIndex = filtered.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const newList = [...filtered];
    const item = newList.splice(currentIndex, 1)[0];
    newList.splice(targetIndex, 0, item);

    setUploading('menu');
    try {
      const batch = newList.map((item, idx) => ({
        id: item.id,
        orderIndex: idx
      }));
      
      await updateNavItemsBatch(batch);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  // Keep internal state in sync with server-side props after a refresh
  useEffect(() => {
    setLocalSettings({ ...settings });
    setPreviews({
      logoUrl: settings.logoUrl || "",
      faviconUrl: settings.faviconUrl || "",
      heroBgValue: settings.heroBgValue || "",
      ogImageUrl: settings.ogImageUrl || "",
      aiApiKey: settings.aiApiKey || ""
    });
    setBgType(settings.heroBgType || "color");
  }, [settings]);
  const [testResult, setTestResult] = useState<{ success: boolean, message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testPrompt, setTestPrompt] = useState("");
  const [explorerResult, setExplorerResult] = useState<{ success: boolean, message: string, response?: string } | null>(null);
  const [exploring, setExploring] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const newBlob = await response.json();
      
      // Sync with React State (This automatically updates hidden inputs)
      if (fieldName in previews) {
        setPreviews(prev => ({ ...prev, [fieldName]: newBlob.url }));
        alert(`New ${fieldName} uploaded! Don't forget to click Save below.`);
      }

      // Special case for media library (Gallery)
      if (fieldName === 'media_library') {
        alert("Image uploaded to library! Refreshing gallery...");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("AI CHAT ERROR:", error);
      const errorMessage = error.message || "An unexpected error occurred with the AI connection.";
      alert(errorMessage);
    } finally {
       setUploading(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await saveSiteSettings(formData);
      if (result.success) {
        setSaveStatus('success');
        router.refresh(); // Force re-fetching of server components
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveError(result.error || "Unknown error");
      }
    } catch (err) {
      setSaveStatus('error');
      setSaveError(String(err));
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/chat/test', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) 
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: "Network error calling diagnostic." });
    } finally {
      setTesting(false);
    }
  };

  const handleExplorerTest = async () => {
    if (!testPrompt.trim()) return;
    setExploring(true);
    setExplorerResult(null);
    try {
      const res = await fetch('/api/chat/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt })
      });
      const data = await res.json();
      setExplorerResult(data);
    } catch (err) {
      setExplorerResult({ success: false, message: "Network error calling Explorer." });
    } finally {
      setExploring(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard Home", icon: Activity },
    { id: "technical_services", label: "Technical Services", icon: Hammer },
    { id: "pages", label: "Pages Architect", icon: FileText },
    { id: "bookings", label: "Inspection & Service Feed", icon: ClipboardList },
    { id: "artisans", label: "Artisan Network", icon: Users },
    { id: "navigator", label: "Menu Architect", icon: Layout },
    { id: "identity", label: "Branding & Style", icon: Settings },
    { id: "media", label: "Media Repository", icon: ImageIcon },
    { id: "footer", label: "Footer Settings", icon: PanelBottom },
    { id: "agent", label: "AI & System", icon: Bot }
  ];

  // Auto-test connection on mount
  useEffect(() => {
    handleTestConnection();
  }, []);

  return (
    <div className="w-full">
      {/* Content Area */}
      <main className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] w-full">
        <div className="p-4 md:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="mb-6">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Site Operation Metrics</h1>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time multitech solution monitoring</p>
               </div>
               
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <Activity size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Live Site Status</h2>
                        <p className="text-xs text-gray-500">Real-time metrics and system health monitoring.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        System Online
                     </span>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div className="p-4 md:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Traffic (24h)</span>
                        <TrendingUp size={14} className="text-brand-blue" />
                     </div>
                     <div className="text-2xl font-black text-gray-900 tracking-tight">{metrics.dailyHits}</div>
                     <p className="text-[9px] text-gray-400 font-bold uppercase italic">Unique visitors today</p>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Lifetime Hits</span>
                        <Zap size={14} className="text-brand-gold" />
                     </div>
                     <div className="text-2xl font-black text-gray-900">{metrics.totalHits}</div>
                     <p className="text-[10px] text-gray-400">Total requests logged</p>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gray-400">SEO Strength</span>
                        <Search size={14} className="text-green-500" />
                     </div>
                     <div className="text-2xl font-black text-gray-900">{metrics.seoScore}%</div>
                     <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${metrics.seoScore}%` }} />
                     </div>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gray-400">AI Health</span>
                        <Bot size={14} className={testResult?.success ? "text-green-500" : "text-brand-blue"} />
                     </div>
                     <div className={`text-sm font-bold flex items-center gap-2 ${
                       testing ? 'text-gray-400' :
                       testResult?.success ? 'text-green-600' : 
                       'text-red-500'
                     }`}>
                        <ShieldCheck size={14} />
                        {testing ? 'Checking...' : testResult?.success ? 'Connected' : 'Offline'}
                     </div>
                     <p className="text-[10px] text-gray-400">{testResult?.message || 'Google Gemini API'}</p>
                  </div>

               </div>

               <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                     <Zap size={18} className="text-brand-gold" />
                     Marketing Pulse
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Marketing Runs</span>
                        <div className="font-bold text-sm text-gray-700">{settings.lastMarketingRun ? new Date(settings.lastMarketingRun).toLocaleDateString() : 'Never'}</div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">AI Core Agent</span>
                        <div className={`font-bold text-sm ${metrics.aiStatus === "Active" ? "text-green-600" : "text-red-500"}`}>{metrics.aiStatus}</div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Media Storage</span>
                        {/* @ts-ignore */}
                        <div className={`font-bold text-sm ${metrics.mediaStatus.includes("Active") ? "text-green-600" : "text-red-500"}`}>{metrics.mediaStatus}</div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "identity" && (
            <div className="space-y-12">
               {/* Site Identity */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold text-gray-900">Site Identity & Global Settings</h2>
                     <div className="flex gap-2">
                        {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ Saved!</span>}
                        <button onClick={() => {
                          const form = document.getElementById('identity-form') as HTMLFormElement;
                          form.requestSubmit();
                        }} className="admin-btn-save-sm">
                           <Save size={16} /> Save Changes
                        </button>
                     </div>
                  </div>
                  
                  <form id="identity-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Site Branding Name</label>
                        <input name="siteName" value={localSettings.siteName || ''} onChange={e => updateField('siteName', e.target.value)} className="admin-input" required />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400">Logo</label>
                           <div className="flex gap-2">
                              <input type="hidden" name="logoUrl" value={previews.logoUrl} />
                              <button type="button" onClick={() => setSelectedMediaTarget('logoUrl')} className="flex-1 p-2 bg-gray-50 border rounded-xl hover:border-brand-blue text-[10px] font-black uppercase text-gray-400">
                                 {previews.logoUrl ? "Change" : "Upload"}
                              </button>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400">Favicon</label>
                           <div className="flex gap-2">
                              <input type="hidden" name="faviconUrl" value={previews.faviconUrl} />
                              <button type="button" onClick={() => setSelectedMediaTarget('faviconUrl')} className="flex-1 p-2 bg-gray-50 border rounded-xl hover:border-brand-blue text-[10px] font-black uppercase text-gray-400">
                                 {previews.faviconUrl ? "Change" : "Upload"}
                              </button>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Global Contact (Phone)</label>
                        <input name="phoneNumber" value={localSettings.phoneNumber || ''} onChange={e => updateField('phoneNumber', e.target.value)} className="admin-input" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">WhatsApp (intl format)</label>
                        <input name="whatsappNumber" value={localSettings.whatsappNumber || ''} onChange={e => updateField('whatsappNumber', e.target.value)} className="admin-input" />
                     </div>
                     
                     <div className="md:col-span-2 pt-6 border-t mt-4">
                        <h3 className="text-sm font-black uppercase text-gray-900 mb-4 italic">Public Landing Customization</h3>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-400">Hero Main Title</label>
                              <input name="heroTitle" value={localSettings.heroTitle || ''} onChange={e => updateField('heroTitle', e.target.value)} className="admin-input font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-400">Hero Subtitle</label>
                              <textarea name="heroSubtitle" value={localSettings.heroSubtitle || ''} onChange={e => updateField('heroSubtitle', e.target.value)} className="admin-input h-20" />
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                 <label className="text-xs font-bold uppercase text-gray-400 px-1">Background Type</label>
                                 <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                    {["image", "color", "gradient"].map(t => (
                                       <button 
                                         key={t}
                                         type="button" 
                                         onClick={() => setBgType(t)}
                                         className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                                           bgType === t ? "bg-brand-blue text-white shadow-lg" : "text-gray-400 hover:text-brand-blue"
                                         }`}
                                       >
                                          {t}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                              
                              <div className="space-y-1">
                                 <label className="text-xs font-bold uppercase text-gray-400 px-1">
                                    {bgType === 'image' ? 'Pick Image' : bgType === 'gradient' ? 'Gradient Code' : 'Solid Color Hex'}
                                 </label>
                                 <div className="flex gap-2">
                                    <input 
                                      name="heroBgValue" 
                                      value={previews.heroBgValue} 
                                      onChange={(e) => setPreviews(prev => ({ ...prev, heroBgValue: e.target.value }))}
                                      className="admin-input flex-1 bg-white text-xs border-gray-200" 
                                      placeholder={bgType === 'gradient' ? 'linear-gradient(...)' : '#000000'}
                                    />
                                    {bgType === 'image' && (
                                       <button type="button" onClick={() => setSelectedMediaTarget('heroBgValue')} className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all">
                                          <Upload size={18} />
                                       </button>
                                    )}
                                    {bgType === 'gradient' && (
                                       <button 
                                         type="button" 
                                         onClick={() => setPreviews(prev => ({ ...prev, heroBgValue: "linear-gradient(135deg, #1E40AF 0%, #D4AF37 100%)" }))} 
                                         className="p-2 bg-brand-gold/10 text-brand-gold text-[8px] font-black uppercase rounded-xl border border-brand-gold/20 hover:bg-brand-gold hover:text-white transition-all"
                                       >
                                          Logo Gradient
                                       </button>
                                    )}
                                 </div>
                              </div>
                              <input type="hidden" name="heroBgType" value={bgType} />
                           </div>
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-1 pt-4">
                        <label className="text-xs font-bold uppercase text-gray-400">Workshop Address</label>
                        <input name="address" value={localSettings.address || ''} onChange={e => updateField('address', e.target.value)} className="admin-input" />
                     </div>
                  </form>
               </div>

             </div>
          )}

          {activeTab === "media" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Central Media Repository</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage all site branding and service assets</p>
                  </div>
                  <label className="bg-brand-blue text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-brand-blue/20 active:scale-95">
                     <Upload size={14} /> Upload New Asset
                     <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'media_library')} accept="image/*" />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                   {mediaAssetsList.length === 0 && (
                     <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <ImageIcon size={40} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400 font-medium font-bold uppercase tracking-widest text-[10px]">Vault is Empty</p>
                     </div>
                   )}
                   {mediaAssetsList.map((asset: any) => (
                      <div key={asset.id} className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-brand-blue transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-brand-blue/10">
                         <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                navigator.clipboard.writeText(asset.url); 
                                alert("Direct Asset Link Copied!"); 
                              }} 
                              className="p-3 bg-white text-brand-blue rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
                              title="Copy Public URL"
                            >
                               <Copy size={18} />
                            </button>
                         </div>
                         <div className="absolute bottom-2 left-0 right-0 px-2 opacity-0 group-hover:opacity-100 transition-all">
                            <div className="bg-white/90 backdrop-blur-md rounded-xl py-1 px-2 text-[8px] font-black uppercase tracking-widest text-center truncate italic">
                               {asset.fileName}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === "navigator" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Navigation Architect</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage site hierarchy and link ordering</p>
                </div>
                <div className="flex gap-2">
                   <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm border border-brand-blue/10">Dynamic Engine</span>
                </div>
              </div>

              {/* Up/Down Arrow Reorder Tree */}
              <div className="space-y-4">
                 {localNavItems.filter((i: any) => !i.parentId).length === 0 && (
                   <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                      <Layout size={40} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400 font-medium">No menu nodes detected. Build your first link below.</p>
                   </div>
                 )}
                 
                 {(() => {
                   const rootItems = [...localNavItems]
                     .filter((i: any) => !i.parentId)
                     .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                   
                   return rootItems.map((parent: any, idx: number) => (
                     <div key={parent.id} className="space-y-2">
                       {/* Top Level Item */}
                       <div className="flex flex-wrap items-center justify-between p-4 bg-white border border-gray-100 rounded-[2rem] group transition-all hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5">
                          <div className="flex items-center gap-4">
                             <div className="w-6 text-center text-[10px] font-black text-gray-300">{idx + 1}</div>
                             <div>
                                <div className="font-black text-gray-900 flex items-center gap-3 text-base">
                                   {parent.label}
                                   {parent.isActive === false && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Hidden</span>}
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono tracking-tight bg-gray-50 px-2 py-0.5 rounded-md mt-1 w-fit">{parent.href}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 sm:mt-0">
                             {uploading === 'menu' ? (
                               <div className="flex items-center gap-2 text-[10px] text-brand-blue font-black uppercase px-3 py-2 bg-brand-blue/5 rounded-xl"><Loader2 size={14} className="animate-spin" /> Saving…</div>
                             ) : (
                               <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100">
                                  <button 
                                    onClick={() => handleMoveNavItem(parent.id, 'up')}
                                    disabled={idx === 0}
                                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-brand-blue transition-all disabled:opacity-20"
                                    title="Move Up"
                                  >
                                    <ChevronDown size={16} className="rotate-180" />
                                  </button>
                                  <div className="w-px h-4 bg-gray-200 mx-1" />
                                  <button 
                                    onClick={() => handleMoveNavItem(parent.id, 'down')}
                                    disabled={idx === rootItems.length - 1}
                                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-brand-blue transition-all disabled:opacity-20"
                                    title="Move Down"
                                  >
                                    <ChevronDown size={16} />
                                  </button>
                               </div>
                             )}
                             <button onClick={() => deleteNavItem(parent.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>

                       {/* Sub Items */}
                       {localNavItems.filter((i: any) => i.parentId === parent.id).length > 0 && (
                         <div className="ml-8 sm:ml-16 space-y-2 relative before:absolute before:left-[-1.5rem] before:top-[-0.5rem] before:bottom-[0.5rem] before:w-0.5 before:bg-brand-blue/10">
                           {(() => {
                             const subItems = [...localNavItems]
                               .filter((i: any) => i.parentId === parent.id)
                               .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                             
                             return subItems.map((sub: any, subIdx: number) => (
                               <div key={sub.id} className="flex flex-wrap items-center justify-between p-4 bg-brand-blue/[0.02] border border-blue-100/50 rounded-[1.5rem] group/sub transition-all hover:bg-white hover:shadow-lg">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-blue-50/50 flex items-center justify-center text-brand-blue/30 group-hover/sub:text-brand-blue transition-colors">
                                        <ChevronRight size={16} />
                                     </div>
                                     <div>
                                        <div className="font-extrabold text-gray-800 text-sm">{sub.label}</div>
                                        <div className="text-[10px] text-gray-400 font-mono italic">{sub.href}</div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-40 group-hover/sub:opacity-100 transition-opacity">
                                     <div className="flex items-center p-1 bg-white rounded-lg border border-gray-100">
                                        <button onClick={() => handleMoveSubItem(parent.id, sub.id, 'up')} disabled={subIdx === 0} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-brand-blue disabled:opacity-20"><ChevronDown size={14} className="rotate-180" /></button>
                                        <button onClick={() => handleMoveSubItem(parent.id, sub.id, 'down')} disabled={subIdx === subItems.length - 1} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-brand-blue disabled:opacity-20"><ChevronDown size={14} /></button>
                                     </div>
                                     <button onClick={() => deleteNavItem(sub.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                  </div>
                               </div>
                             ));
                           })()}
                         </div>
                       )}
                     </div>
                   ));
                 })()}
              </div>

              {/* Add New Item Form */}
              <div className="pt-10 border-t border-gray-100">
                 <div className="mb-6">
                    <h3 className="text-sm font-black uppercase text-gray-900 tracking-widest flex items-center gap-3">
                       <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px]">
                          <Plus size={14} />
                       </span>
                       Register New System Node
                    </h3>
                 </div>
                 <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      await saveNavItem(fd);
                      e.currentTarget.reset();
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 shadow-inner"
                 >
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Node Name</label>
                       <input name="label" placeholder="e.g. History" className="admin-input bg-white text-xs py-3" required />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Internal Path</label>
                       <input name="href" placeholder="/history" className="admin-input bg-white text-xs py-3" required />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Hierarchy Parent</label>
                       <select name="parentId" className="admin-input bg-white text-xs appearance-none py-3 h-[42px]">
                          <option value="">Root Level</option>
                          {navItemsList.filter((i: any) => !i.parentId).map((i: any) => <option key={i.id} value={i.id}>{i.label}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Order Logic</label>
                       <input name="orderIndex" type="number" defaultValue="0" className="admin-input bg-white text-xs py-3" />
                    </div>
                    <button type="submit" className="bg-brand-blue text-white rounded-2xl h-[46px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-tighter hover:bg-blue-800 transition-all shadow-xl shadow-brand-blue/20 active:scale-95 group">
                       <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                       Inject Node
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

          {activeTab === "technical_services" && (
            <div className="space-y-12">
               {/* Specialist Capabilities (Existing Services) */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                           <Hammer size={24} />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-gray-900 leading-tight">Specialist Capabilities</h2>
                           <p className="text-xs text-gray-500">Manage the core technical services offered by Phinovax.</p>
                        </div>
                     </div>
                  </div>
                  
                  <form action={saveService} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                     <input type="hidden" name="id" value={editingService?.id || ""} />
                     <div className="md:col-span-1 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Specialty Title</label>
                        <input name="title" defaultValue={editingService?.title || ""} className="admin-input bg-white" required />
                     </div>
                     <div className="md:col-span-1 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Icon Key (Lucide)</label>
                        <input name="iconName" defaultValue={editingService?.iconName || "Wrench"} className="admin-input bg-white" />
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Summary Teaser</label>
                        <textarea name="description" defaultValue={editingService?.description || ""} className="admin-input bg-white h-20" required />
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 font-bold text-brand-blue">Detailed exposition (HTML)</label>
                        <textarea name="detailedContent" defaultValue={editingService?.detailedContent || ""} className="admin-input bg-white h-40 font-mono text-xs" />
                     </div>
                     <div className="space-y-1 flex items-center gap-4">
                        <button type="submit" className="admin-btn-save-sm w-full py-3">
                           <Save size={18} /> {editingService ? "Update Specialty" : "Add New Specialty"}
                        </button>
                        {editingService && (
                           <button type="button" onClick={() => setEditingService(null)} className="w-full bg-white border border-gray-200 text-gray-400 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                        )}
                     </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {servicesList.map(service => (
                        <div key={service.id} className="p-5 border rounded-3xl flex flex-col gap-3 relative group bg-white hover:border-brand-blue transition-all">
                           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingService(service)} className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                 <MousePointer2 size={14} />
                              </button>
                              <button onClick={() => deleteService(service.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                           <div className="text-brand-blue font-black text-sm uppercase tracking-tight">{service.title}</div>
                           <p className="text-xs text-gray-500 line-clamp-3">{service.description}</p>
                           {service.detailedContent && (
                              <div className="text-[8px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-black uppercase w-fit border border-green-500/20">Technical Detail Active</div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === "artisans" && (
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <Users size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Artisan Network</h2>
                        <p className="text-xs text-gray-500">Manage mechanics and technicians who have joined your network.</p>
                     </div>
                  </div>
               </div>

               {/* Onboarding Page Content */}
               <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <Users size={20} />
                     </div>
                     <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight italic">Onboarding Page Content</h3>
                  </div>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400 px-1">Hero Title</label>
                           <input name="onboardPageTitle" defaultValue={localSettings.onboardPageTitle || ''} className="admin-input bg-white" placeholder="Elevate Your Engineering Career" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400 px-1">Hero Subtitle</label>
                           <textarea name="onboardPageSubtitle" defaultValue={localSettings.onboardPageSubtitle || ''} className="admin-input bg-white h-24" placeholder="Why should artisans join your network?" />
                        </div>
                     </div>
                     <button type="submit" className="admin-btn-save-sm w-fit mt-2">
                        <Save size={14} /> Update Onboarding Page
                     </button>
                  </form>
               </div>

               <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-gray-50 border-b">
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Technician Info</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Specialty / Experience</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Location</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Approval</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {artisansList.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No technicians have registered yet.</td>
                           </tr>
                        ) : (
                           artisansList.map((artisan: any) => (
                              <tr key={artisan.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       {artisan.photoUrl && <img src={artisan.photoUrl} className="w-10 h-10 rounded-full object-cover border" alt="" />}
                                       <div>
                                          <div className="font-black text-gray-900 text-sm">{artisan.name}</div>
                                          <div className="text-xs text-gray-500">{artisan.phoneNumber}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-xs font-bold text-gray-700">{artisan.specialty}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-black">{artisan.yearsExperience} Years Exp</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-xs text-gray-600 font-medium">{artisan.location}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button 
                                         onClick={() => updateArtisanStatus(artisan.id, 'active')}
                                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${artisan.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                                       >
                                          {artisan.status === 'active' ? 'Approved' : 'Approve'}
                                       </button>
                                       <button 
                                         onClick={() => updateArtisanStatus(artisan.id, 'rejected')}
                                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${artisan.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'}`}
                                       >
                                          Reject
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center gap-3">
                  <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold">
                     <ClipboardList size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 leading-tight">Inspection & Service Feed</h2>
                     <p className="text-xs text-gray-500">Real-time requests for technical inspections and repairs.</p>
                  </div>
               </div>

               {/* Page Content Settings */}
               <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <FileText size={20} />
                     </div>
                     <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight italic">Booking Page Content</h3>
                  </div>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400 px-1">Main Heading</label>
                           <input name="bookPageTitle" defaultValue={localSettings.bookPageTitle || ''} className="admin-input bg-white" placeholder="Request a Technical Inspection Today" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400 px-1">Subtitle / Description</label>
                           <textarea name="bookPageSubtitle" defaultValue={localSettings.bookPageSubtitle || ''} className="admin-input bg-white h-24" placeholder="Describe your inspection services..." />
                        </div>
                     </div>
                     <button type="submit" className="admin-btn-save-sm w-fit mt-2">
                        <Save size={14} /> Update Booking Page
                     </button>
                  </form>
               </div>

               <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-gray-50 border-b">
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Client Info</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Issue / Location</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Assigned</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {bookingsList.length === 0 ? (
                            <tr>
                               <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No technical bookings recorded yet.</td>
                            </tr>
                         ) : (
                            bookingsList.map((booking: any) => (
                               <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                     <div className="font-black text-gray-900 text-sm">{booking.clientName}</div>
                                     <div className="text-xs text-brand-blue font-bold">{booking.clientPhone}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="text-xs text-gray-700 font-bold line-clamp-1">{booking.issueDescription}</div>
                                     <div className="text-[10px] text-gray-400 flex items-center gap-1"><Map size={10} /> {booking.location}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <select 
                                       value={booking.assignedArtisanId || ""} 
                                       onChange={(e) => assignArtisanToBooking(booking.id, parseInt(e.target.value))}
                                       className="text-[10px] font-black uppercase text-brand-blue bg-blue-50 border-none rounded-lg px-2 py-1 focus:ring-brand-blue cursor-pointer"
                                     >
                                        <option value="">No Mechanic Linked</option>
                                        {artisansList.filter(a => a.status === 'active').map(a => (
                                           <option key={a.id} value={a.id}>{a.name} ({a.specialty})</option>
                                        ))}
                                     </select>
                                  </td>
                                  <td className="px-6 py-4">
                                     <select 
                                       value={booking.status}
                                       onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                                       className="text-[10px] font-black uppercase border-none bg-gray-100 rounded-lg px-2 py-1 focus:ring-brand-blue"
                                     >
                                        <option value="new">New Request</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                     </select>
                                  </td>
                               </tr>
                            ))
                         )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <PanelBottom size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Footer & Contact Details</h2>
                        <p className="text-xs text-gray-500">Manage site-wide footer content and social media presence.</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ Saved!</span>}
                     <button onClick={() => {
                       const form = document.getElementById('footer-form') as HTMLFormElement;
                       form.requestSubmit();
                     }} className="admin-btn-save-sm">
                        <Save size={16} /> Save Footer
                     </button>
                  </div>
               </div>

               <form id="footer-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                  <div className="md:col-span-2 space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-400 px-1">Footer Main Text (Bio)</label>
                     <textarea 
                        name="footerText" 
                        value={localSettings.footerText || ''} 
                        onChange={e => updateField('footerText', e.target.value)} 
                        className="admin-input bg-white h-24" 
                        placeholder="e.g. Leading the way in multitech solutions..."
                     />
                  </div>
                  
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-400 px-1">Copyright Statement</label>
                     <input 
                        name="copyrightText" 
                        value={localSettings.copyrightText || ''} 
                        onChange={e => updateField('copyrightText', e.target.value)} 
                        className="admin-input bg-white" 
                        placeholder="Fhinovax Multitech Solutions Ltd"
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-400 px-1">Public Email Address</label>
                     <input 
                        name="emailAddress" 
                        value={localSettings.emailAddress || ''} 
                        onChange={e => updateField('emailAddress', e.target.value)} 
                        className="admin-input bg-white" 
                        placeholder="info@fhinovax.com"
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-400 px-1">Operating Hours</label>
                     <input 
                        name="operatingHours" 
                        value={localSettings.operatingHours || ''} 
                        onChange={e => updateField('operatingHours', e.target.value)} 
                        className="admin-input bg-white" 
                        placeholder="Mon-Sat: 8am - 6pm"
                     />
                  </div>

                  <div className="md:col-span-2 pt-6 border-t mt-4">
                     <h3 className="text-sm font-black uppercase text-gray-900 mb-4 italic flex items-center gap-2">
                        <Share2 size={16} /> Social Media Connectivity
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 px-1">
                              <Facebook size={12} /> Facebook URL
                           </label>
                           <input 
                              name="facebookUrl" 
                              value={localSettings.facebookUrl || ''} 
                              onChange={e => updateField('facebookUrl', e.target.value)} 
                              className="admin-input bg-white" 
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 px-1">
                              <Instagram size={12} /> Instagram URL
                           </label>
                           <input 
                              name="instagramUrl" 
                              value={localSettings.instagramUrl || ''} 
                              onChange={e => updateField('instagramUrl', e.target.value)} 
                              className="admin-input bg-white" 
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 px-1">
                              <Twitter size={12} /> Twitter (X) URL
                           </label>
                           <input 
                              name="twitterUrl" 
                              value={localSettings.twitterUrl || ''} 
                              onChange={e => updateField('twitterUrl', e.target.value)} 
                              className="admin-input bg-white" 
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 px-1">
                              <Linkedin size={12} /> LinkedIn URL
                           </label>
                           <input 
                              name="linkedinUrl" 
                              value={localSettings.linkedinUrl || ''} 
                              onChange={e => updateField('linkedinUrl', e.target.value)} 
                              className="admin-input bg-white" 
                           />
                        </div>
                     </div>
                  </div>
               </form>
            </div>
          )}

          {activeTab === "agent" && (
             <div className="space-y-12">
                {/* AI & Business Logic */}
                <div className="space-y-8">
                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                             <Bot size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-bold text-gray-900 leading-tight">AI & Business Context</h2>
                             <p className="text-xs text-gray-500">Configure how Gemini interacts with your customers.</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-gray-400">Google Maps Embed URL</label>
                          <input name="googleMapsEmbed" value={localSettings.googleMapsEmbed || ''} onChange={e => updateField('googleMapsEmbed', e.target.value)} className="admin-input" placeholder="https://www.google.com/maps/embed?..." />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-gray-400">AI Agent Display Name</label>
                          <input name="aiName" value={localSettings.aiName || ''} onChange={e => updateField('aiName', e.target.value)} className="admin-input" placeholder="e.g. Phinovax Rep" />
                       </div>
                    </div>

                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">Google Business Details</label>
                      <textarea name="googleBusinessDetails" 
                        value={localSettings.googleBusinessDetails || ''}
                        onChange={e => updateField('googleBusinessDetails', e.target.value)}
                        className="admin-input h-24" 
                      />
                   </div>

                    <div className="space-y-1 rounded-2xl border-2 border-brand-blue/20 p-4 bg-brand-blue/5">
                        <label className="text-[10px] font-extrabold uppercase text-brand-blue flex items-center gap-2 mb-2">
                           Essential: Google Gemini API Key
                        </label>
                        <input 
                          type="password"
                          name="aiApiKey" 
                          value={previews.aiApiKey} 
                          onChange={(e) => setPreviews(prev => ({ ...prev, aiApiKey: e.target.value }))}
                          className="admin-input bg-white border-brand-blue/20 text-xs" 
                        />
                     </div>

                    <button type="submit" className="admin-btn-save-sm">
                       <Save size={16} /> Save AI & Context
                    </button>
                  </form>

                  {/* Diagnosis Page Content */}
                  <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] space-y-6 mt-10 border-t pt-10">
                     <div className="flex items-center gap-3">
                        <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                           <Cpu size={20} />
                        </div>
                        <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight italic">Diagnosis Page Header Content</h3>
                     </div>
                     <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-gray-400 px-1">Main Page Heading</label>
                              <input name="diagnosisPageTitle" defaultValue={localSettings.diagnosisPageTitle || ''} className="admin-input bg-white" placeholder="Intelligent Online Fault Diagnosis" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-gray-400 px-1">Main Page Subtitle</label>
                              <textarea name="diagnosisPageSubtitle" defaultValue={localSettings.diagnosisPageSubtitle || ''} className="admin-input bg-white h-24" placeholder="How does the AI help in diagnosis?" />
                           </div>
                        </div>
                        <button type="submit" className="admin-btn-save-sm w-fit mt-2">
                           <Save size={14} /> Update Diagnosis Page
                        </button>
                     </form>
                  </div>
                </div>

                {/* AI Lab Diagnostic Restoration */}
                <div className="pt-10 border-t space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold">
                         <Zap size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-gray-900 leading-tight">AI Diagnostic Lab</h2>
                         <p className="text-xs text-gray-500">Test your AI brain connection and inspect raw responses in real-time.</p>
                      </div>
                   </div>
                   
                   <div className="bg-white border-2 border-dashed border-gray-100 p-8 rounded-[2.5rem] space-y-6">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <button 
                          onClick={handleTestConnection} 
                          disabled={testing}
                          className="bg-brand-blue text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-2"
                        >
                          {testing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                          Quick System Pulse
                        </button>
                        {testResult && (
                           <div className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border flex items-center gap-2 ${testResult.success ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                              {testResult.success ? <CheckCircle size={14} /> : <Trash2 size={14} />}
                              {testResult.message}
                           </div>
                        )}
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400 px-1">Test Inquiry (Custom Prompt Explorer)</label>
                         <div className="flex gap-2">
                           <textarea 
                              value={testPrompt}
                              onChange={(e) => setTestPrompt(e.target.value)}
                              className="admin-input flex-1 h-24 text-xs font-medium" 
                              placeholder="e.g. Can you confirm you are connected and summarized Phinovax specialties?"
                           />
                           <button 
                             onClick={handleExplorerTest}
                             disabled={exploring || !testPrompt.trim()}
                             className="bg-gray-900 text-white px-6 rounded-2xl font-black uppercase text-[10px] hover:bg-black disabled:opacity-20 transition-all active:scale-95"
                           >
                              {exploring ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Run Explorer"}
                           </button>
                         </div>
                      </div>

                      {explorerResult?.response && (
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-[10px] font-black uppercase text-brand-blue px-1">Raw Brain Response</label>
                            <div className="p-6 bg-brand-blue/[0.02] border border-brand-blue/10 rounded-2xl text-xs text-gray-700 leading-relaxed italic shadow-inner">
                               "{explorerResult.response}"
                            </div>
                         </div>
                      )}
                      
                      {explorerResult && !explorerResult.success && (
                         <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                            {explorerResult.message}
                         </div>
                      )}
                   </div>
                </div>

                {/* SEO Sub-section */}
                <div className="pt-10 border-t space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                         <Globe size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-gray-900 leading-tight">SEO & Marketing Pulse</h2>
                         <p className="text-xs text-gray-500">Search engine optimization and daily marketing drafts.</p>
                      </div>
                   </div>

                   <form onSubmit={handleFormSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Meta Description</label>
                        <textarea name="metaDescription" value={localSettings.metaDescription || ''} onChange={e => updateField('metaDescription', e.target.value)} className="admin-input bg-white h-20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <label className="text-xs font-bold uppercase text-gray-400">Facebook</label>
                             <input name="facebookUrl" value={localSettings.facebookUrl || ''} onChange={e => updateField('facebookUrl', e.target.value)} className="admin-input bg-white" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-xs font-bold uppercase text-gray-400">Instagram</label>
                             <input name="instagramUrl" value={localSettings.instagramUrl || ''} onChange={e => updateField('instagramUrl', e.target.value)} className="admin-input bg-white" />
                         </div>
                      </div>
                      <button type="submit" className="admin-btn-save-sm">
                         <Save size={16} /> Save SEO Links
                      </button>
                   </form>

                   {/* AI Post Review */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase text-gray-900 italic">Daily AI Marketing Drafts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {aiPostsList.slice(0, 4).map((post: any) => (
                            <div key={post.id} className="bg-white border p-4 rounded-xl shadow-sm relative group">
                               <p className="text-[11px] text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => approveAiPost(post.id)} className="text-[10px] font-black uppercase text-green-600 hover:underline">Approve</button>
                                  <button onClick={() => discardAiPost(post.id)} className="text-[10px] font-black uppercase text-red-400">Discard</button>
                               </div>
                            </div>
                         ))}
                         {aiPostsList.length === 0 && <p className="text-xs text-gray-400 italic">No marketing data yet.</p>}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </main>

      {/* Media Picker Portal */}
      {selectedMediaTarget && (
        <MediaPicker 
           mediaList={mediaAssetsList}
           onClose={() => setSelectedMediaTarget(null)}
           onSelect={(url) => {
             setPreviews(prev => ({ ...prev, [selectedMediaTarget]: url }));
             setSelectedMediaTarget(null);
           }}
        />
      )}
    </div>

  );
}
