"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  GripHorizontal
} from "lucide-react";
import MediaPicker from "./MediaPicker";
import { 
  saveSiteSettings, 
  savePage, 
  deletePage, 
  saveService, 
  deleteService, 
  saveNavItem,
  updateNavItem,
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedMediaTarget, setSelectedMediaTarget] = useState<string | null>(null);
  const [bgType, setBgType] = useState(settings.heroBgType || "color");
  const [previews, setPreviews] = useState({
    logoUrl: settings.logoUrl || "",
    faviconUrl: settings.faviconUrl || "",
    heroBgValue: settings.heroBgValue || "",
    ogImageUrl: settings.ogImageUrl || "",
    aiApiKey: settings.aiApiKey || ""
  });

  const handleMoveNavItem = async (id: number, direction: 'up' | 'down') => {
    if (id >= 990) {
      alert("This is a system default link. Use the 'Navigator' to add new links.");
      return;
    }

    const filtered = navItemsList.filter((i: any) => !i.parentId).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const currentIndex = filtered.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    // Create a new array and swap
    const newList = [...filtered];
    const temp = newList[currentIndex];
    newList[currentIndex] = newList[targetIndex];
    newList[targetIndex] = temp;

    setUploading('menu');
    try {
      // Seqentially update all to avoid collisions
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id < 990) {
          await updateNavItem(newList[i].id, { orderIndex: i });
        }
      }
      router.refresh();
      alert("Navigation sequence updated!");
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  const handleMoveSubItem = async (parentId: number, id: number, direction: 'up' | 'down') => {
    const filtered = navItemsList.filter((i: any) => i.parentId === parentId).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const currentIndex = filtered.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const currentItem = filtered[currentIndex];
    const targetItem = filtered[targetIndex];

    setUploading('menu');
    try {
      await updateNavItem(currentItem.id, { orderIndex: targetItem.orderIndex || 0 });
      await updateNavItem(targetItem.id, { orderIndex: currentItem.orderIndex || 0 });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  // Keep internal state in sync with server-side props after a refresh
  useEffect(() => {
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
    { id: "artisans", label: "Artisan Network", icon: Users },
    { id: "navigator", label: "Menu Architect", icon: Layout },
    { id: "identity", label: "Branding & Media", icon: Settings },
    { id: "agent", label: "AI & System", icon: Bot }
  ];

  // Auto-test connection on mount
  useEffect(() => {
    handleTestConnection();
  }, []);




  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="md:sticky md:top-24">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 p-1 bg-gray-100/50 backdrop-blur-sm rounded-2xl md:bg-transparent no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-[11px] md:text-sm font-bold whitespace-nowrap border-2 ${
                  activeTab === tab.id 
                    ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20" 
                    : "text-gray-500 border-transparent hover:bg-white hover:text-brand-blue"
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
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
                        <input name="siteName" defaultValue={settings.siteName} className="admin-input" required />
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
                        <input name="phoneNumber" defaultValue={settings.phoneNumber} className="admin-input" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">WhatsApp (intl format)</label>
                        <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="admin-input" />
                     </div>
                     
                     <div className="md:col-span-2 pt-6 border-t mt-4">
                        <h3 className="text-sm font-black uppercase text-gray-900 mb-4 italic">Public Landing Customization</h3>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-400">Hero Main Title</label>
                              <input name="heroTitle" defaultValue={settings.heroTitle} className="admin-input font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-400">Hero Subtitle</label>
                              <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} className="admin-input h-20" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <label className="text-xs font-bold uppercase text-gray-400">Hero Background</label>
                                 <div className="flex gap-2">
                                    <input type="hidden" name="heroBgValue" value={previews.heroBgValue} />
                                    <button type="button" onClick={() => setSelectedMediaTarget('heroBgValue')} className="flex-1 p-2 bg-gray-50 border rounded-xl hover:border-brand-blue text-[10px] font-black uppercase text-gray-400">
                                       {previews.heroBgValue ? "Change Background" : "Pick Image"}
                                    </button>
                                 </div>
                              </div>
                              <input type="hidden" name="heroBgType" value="image" />
                           </div>
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-1 pt-4">
                        <label className="text-xs font-bold uppercase text-gray-400">Workshop Address</label>
                        <input name="address" defaultValue={settings.address} className="admin-input" />
                     </div>
                  </form>
               </div>

               {/* Media Manager Section */}
               <div className="pt-10 border-t space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                           <ImageIcon size={24} />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-gray-900 leading-tight">Media Repository</h2>
                           <p className="text-xs text-gray-500">All uploaded branding and service assets.</p>
                        </div>
                     </div>
                     <label className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all cursor-pointer flex items-center gap-2">
                        <Upload size={14} /> Upload New
                        <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'media_library')} accept="image/*" />
                     </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                     {mediaAssetsList.map((asset: any) => (
                        <div key={asset.id} className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-blue transition-all cursor-pointer shadow-sm">
                           <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(asset.url); alert("URL copied!"); }} className="absolute top-2 right-2 p-1.5 bg-white/90 text-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                              <Copy size={12} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
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

              {/* Hierarchical Tree Render */}
              <div className="space-y-6">
                 {navItemsList.filter((i: any) => !i.parentId).length === 0 && (
                   <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                      <Layout size={40} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400 font-medium">No menu nodes detected. Build your first link below.</p>
                   </div>
                 )}
                 
                 {navItemsList.filter((i: any) => !i.parentId).sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((parent: any) => (
                   <div key={parent.id} className="space-y-3">
                      {/* Top Level Item */}
                      <div className="flex flex-wrap items-center justify-between p-4 bg-white border border-gray-100 rounded-[2rem] group transition-all hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-brand-blue/5 group-hover:text-brand-blue transition-colors">
                               <GripVertical size={18} />
                            </div>
                            <div>
                               <div className="font-black text-gray-900 flex items-center gap-3 text-base">
                                  {parent.label}
                                  {parent.isActive === false && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Hidden</span>}
                               </div>
                               <div className="text-[11px] text-gray-400 font-mono tracking-tight bg-gray-50 px-2 py-0.5 rounded-md mt-1 w-fit">{parent.href}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100">
                               <button 
                                 onClick={() => handleMoveNavItem(parent.id, 'up')} 
                                 className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-brand-blue transition-all disabled:opacity-20" 
                                 disabled={parent.id >= 990}
                                 title="Move Up"
                               >
                                 <ChevronDown size={14} className="rotate-180" />
                               </button>
                               <div className="w-px h-4 bg-gray-200 mx-1" />
                               <button 
                                 onClick={() => handleMoveNavItem(parent.id, 'down')} 
                                 className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-brand-blue transition-all disabled:opacity-20" 
                                 disabled={parent.id >= 990}
                                 title="Move Down"
                               >
                                 <ChevronDown size={14} />
                               </button>
                            </div>
                            <button onClick={() => deleteNavItem(parent.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>

                      {/* Sub Items */}
                      <div className="ml-8 sm:ml-16 space-y-3 relative before:absolute before:left-[-1.5rem] before:top-[-1rem] before:bottom-[1rem] before:w-0.5 before:bg-brand-blue/10">
                         {navItemsList.filter((i: any) => i.parentId === parent.id).sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((sub: any) => (
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
                               <div className="flex items-center gap-3 mt-4 sm:mt-0 opacity-40 group-hover/sub:opacity-100 transition-opacity">
                                  <div className="flex items-center p-1 bg-white rounded-lg border border-gray-100">
                                     <button onClick={() => handleMoveSubItem(parent.id, sub.id, 'up')} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-brand-blue"><ChevronDown size={14} className="rotate-180" /></button>
                                     <button onClick={() => handleMoveSubItem(parent.id, sub.id, 'down')} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-brand-blue"><ChevronDown size={14} /></button>
                                  </div>
                                  <select 
                                    onChange={(e) => updateNavItem(sub.id, { parentId: e.target.value ? parseInt(e.target.value) : null })}
                                    className="text-[10px] font-black uppercase tracking-tighter bg-gray-50 border-gray-100 rounded-lg focus:ring-brand-blue text-gray-500 hover:text-brand-blue cursor-pointer transition-all"
                                  >
                                    <option value={parent.id}>Parent: {parent.label}</option>
                                    <option value="">Move to Root</option>
                                    {navItemsList.filter((i: any) => i.id !== parent.id && !i.parentId).map((i: any) => (
                                      <option key={i.id} value={i.id}>Move to {i.label}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => deleteNavItem(sub.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 ))}
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
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">New Service Title</label>
                        <input name="title" className="admin-input bg-white" required />
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Description (Quick Teaser)</label>
                        <textarea name="description" className="admin-input bg-white h-20" required />
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 font-bold text-brand-blue">Detailed Content (Full Exposition)</label>
                        <textarea name="detailedContent" className="admin-input bg-white h-40 font-mono text-xs" placeholder="HTML support for deep technical details..." />
                     </div>
                     <div className="space-y-1 flex flex-col justify-end">
                        <button type="submit" className="admin-btn-save-sm w-full py-3">
                           <Plus size={18} /> Add New Specialty
                        </button>
                     </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {servicesList.map(service => (
                        <div key={service.id} className="p-5 border rounded-3xl flex flex-col gap-3 relative group bg-white hover:border-brand-blue transition-all">
                           <button onClick={() => deleteService(service.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                           </button>
                           <div className="text-brand-blue font-black text-sm uppercase tracking-tight">{service.title}</div>
                           <p className="text-xs text-gray-500 line-clamp-3">{service.description}</p>
                           {service.detailedContent && (
                              <div className="text-[8px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-black uppercase w-fit border border-green-500/20">Technical Detail Active</div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Technical Booking Feed (Client Requests) */}
               <div className="pt-10 border-t space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold">
                        <ClipboardList size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Inspection & Service Feed</h2>
                        <p className="text-xs text-gray-500">Real-time requests for technical inspections and repairs.</p>
                     </div>
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
                          <input name="googleMapsEmbed" defaultValue={settings.googleMapsEmbed} className="admin-input" placeholder="https://www.google.com/maps/embed?..." />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-gray-400">AI Agent Display Name</label>
                          <input name="aiName" defaultValue={settings.aiName} className="admin-input" placeholder="e.g. Phinovax Rep" />
                       </div>
                    </div>

                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">Google Business Details</label>
                      <textarea name="googleBusinessDetails" 
                        defaultValue={settings.googleBusinessDetails} 
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
                        <textarea name="metaDescription" defaultValue={settings.metaDescription} className="admin-input bg-white h-20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <label className="text-xs font-bold uppercase text-gray-400">Facebook</label>
                             <input name="facebookUrl" defaultValue={settings.facebookUrl} className="admin-input bg-white" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-xs font-bold uppercase text-gray-400">Instagram</label>
                             <input name="instagramUrl" defaultValue={settings.instagramUrl} className="admin-input bg-white" />
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
