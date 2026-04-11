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
  MousePointer2
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
  updateLeadStatus
} from "@/app/admin/actions";

export default function AdminTabs({ 
  settings, 
  servicesList, 
  pagesList, 
  navItemsList,
  aiPostsList = [],
  leadsList = [],
  metrics = { dailyHits: 0, totalHits: 0, totalLeads: 0, seoScore: 0, aiStatus: "Key Missing", marketingHealth: "Neutral" },
  mediaAssetsList = []
}: { 
  settings: any, 
  servicesList: any[], 
  pagesList: any[], 
  navItemsList: any[],
  aiPostsList?: any[],
  leadsList?: any[],
  metrics?: any,
  mediaAssetsList?: any[]
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
      alert("This is a system default link. To rearrange it, please create a new 'Home' link manually with your preferred order.");
      return;
    }

    const filtered = navItemsList.filter((i: any) => !i.parentId).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const currentIndex = filtered.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const currentItem = filtered[currentIndex];
    const targetItem = filtered[targetIndex];

    setUploading('menu');
    try {
      const oldIndex = currentItem.orderIndex || 0;
      const newIndex = targetItem.orderIndex || 0;
      
      await updateNavItem(currentItem.id, { orderIndex: newIndex });
      if (targetItem.id < 990) {
        await updateNavItem(targetItem.id, { orderIndex: oldIndex });
      }
      router.refresh();
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
    { id: "dashboard", label: "Live Site Status", icon: Activity },
    { id: "general", label: "Identity", icon: Settings },
    { id: "media", label: "Media Manager", icon: ImageIcon },
    { id: "leads", label: "Inbound Leads", icon: CheckCircle },
    { id: "hero", label: "Hero Design", icon: Layout },
    { id: "menu", label: "Navigator", icon: MenuIcon },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "services", label: "Capabilities", icon: Wrench },
    { id: "ai", label: "AI & Logic", icon: Bot },
    { id: "marketing", label: "Daily Marketing", icon: Share2 },
    { id: "seo", label: "Global SEO", icon: Globe },
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
            <div className="space-y-8">
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

          {activeTab === "media" && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                        <ImageIcon size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Media File Section</h2>
                        <p className="text-xs text-gray-500">Manage all your local uploads for site branding.</p>
                     </div>
                  </div>
                  <label className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all cursor-pointer flex items-center gap-2">
                     <Upload size={14} /> Upload New Media
                     <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'media_library')} accept="image/*" />
                  </label>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaAssetsList.length === 0 && (
                     <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <ImageIcon size={48} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400 italic">No media files found. Upload your first branding image.</p>
                     </div>
                  )}
                  {mediaAssetsList.map((asset: any) => (
                    <div key={asset.id} className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-brand-blue transition-all cursor-pointer shadow-sm">
                       <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-[8px] text-white font-bold truncate">{asset.fileName}</p>
                       </div>
                       <button 
                         onClick={() => {
                            navigator.clipboard.writeText(asset.url);
                            alert("URL copied to clipboard!");
                         }}
                         className="absolute top-2 right-2 p-1.5 bg-white/90 text-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm active:scale-95"
                       >
                          <Copy size={12} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {activeTab === "general" && (
            <div className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Site Identity & Global Settings</h2>
                  {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ Settings Saved!</span>}
                  {saveStatus === 'error' && <span className="text-xs font-bold text-red-600">⚠ {saveError}</span>}
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Site Name</label>
                  <input name="siteName" defaultValue={settings.siteName} className="admin-input" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Site Logo</label>
                  <div className="flex gap-2">
                     <input type="hidden" name="logoUrl" value={previews.logoUrl} readOnly />
                      <input type="file" onChange={(e) => handleUpload(e, 'logoUrl')} className="admin-input text-xs" accept="image/*" />
                      <button type="button" onClick={() => setSelectedMediaTarget('logoUrl')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500" title="Pick from Library">
                         <ImageIcon size={16} />
                      </button>
                      {uploading === 'logoUrl' && <Loader2 className="animate-spin text-brand-blue" />}
                  </div>
                  {previews.logoUrl && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 inline-block">
                      <img src={previews.logoUrl} className="h-12 w-auto object-contain" alt="logo preview" />
                      <p className="text-[8px] text-gray-400 mt-1 text-center font-bold">PREVIEW</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Favicon</label>
                  <div className="flex gap-2">
                     <input type="hidden" name="faviconUrl" value={previews.faviconUrl} readOnly />
                      <input type="file" onChange={(e) => handleUpload(e, 'faviconUrl')} className="admin-input text-xs" accept="image/*" />
                      <button type="button" onClick={() => setSelectedMediaTarget('faviconUrl')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500" title="Pick from Library">
                         <ImageIcon size={16} />
                      </button>
                      {uploading === 'faviconUrl' && <Loader2 className="animate-spin text-brand-blue" />}
                  </div>
                  {previews.faviconUrl && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 inline-block">
                      <img src={previews.faviconUrl} className="h-6 w-6 object-contain" alt="favicon preview" />
                      <p className="text-[8px] text-gray-400 mt-1 text-center font-bold">PREVIEW</p>
                    </div>
                  )}
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
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-xl font-bold text-gray-900">Hero Section Customization</h2>
                   {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ Hero Updated!</span>}
                   {saveStatus === 'error' && <span className="text-xs font-bold text-red-600">⚠ {saveError}</span>}
                </div>
              
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
                       <input 
                         type="radio" 
                         name="heroBgType" 
                         value="color" 
                         checked={bgType === 'color'} 
                         onChange={() => setBgType('color')}
                       />
                       <span className="text-sm font-medium">Solid Color</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="radio" 
                         name="heroBgType" 
                         value="image" 
                         checked={bgType === 'image'} 
                         onChange={() => setBgType('image')}
                       />
                       <span className="text-sm font-medium">Image</span>
                     </label>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-gray-500">Background Value (Hex or Image URL)</label>
                   {bgType === 'color' ? (
                     <input name="heroBgValue" defaultValue={settings.heroBgValue} className="admin-input" placeholder="#000" />
                   ) : (
                     <div className="flex flex-col gap-2">
                        <input type="hidden" name="heroBgValue" value={previews.heroBgValue} readOnly />
                        <div className="relative">
                          <input type="file" onChange={(e) => handleUpload(e, 'heroBgValue')} className="admin-input text-xs pr-10" accept="image/*" />
                           <button type="button" onClick={() => setSelectedMediaTarget('heroBgValue')} className="absolute right-10 top-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-500">
                              <ImageIcon size={14} />
                           </button>
                           <Upload size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                        {uploading === 'heroBgValue' && <div className="flex items-center gap-2 text-xs text-brand-blue"><Loader2 className="animate-spin" size={12} /> Uploading...</div>}
                        {previews.heroBgValue && (
                          <div className="mt-2 relative aspect-[21/9] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                             <img src={previews.heroBgValue} className="w-full h-full object-cover" alt="hero preview" />
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-brand-blue border border-brand-blue/20">HERO PREVIEW</span>
                             </div>
                          </div>
                        )}
                     </div>
                   )}
                </div>

              </div>

              <button type="submit" className="admin-btn-save">
                <Save size={18} /> Apply Hero Updates
              </button>
             </form>
            </div>
          )}

          {activeTab === "menu" && (
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

          {activeTab === "services" && (
            <div className="space-y-8">
               <h2 className="text-xl font-bold text-gray-900">Services & Specialty Controls</h2>
               
               <form action={saveService} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="md:col-span-2">
                     <label className="text-xs font-bold uppercase text-gray-500">New Service Title</label>
                     <input name="title" className="admin-input" required />
                  </div>
                   <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Description (Quick Teaser)</label>
                      <textarea name="description" className="admin-input h-20" required />
                   </div>
                   <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Detailed Content (Full Service Page)</label>
                      <textarea name="detailedContent" className="admin-input h-40 font-mono text-xs" placeholder="HTML or long text for the specialized service page..." />
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
                         {service.detailedContent && (
                           <div className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black uppercase w-fit">Detailed Content Added</div>
                         )}
                         <div className="text-[10px] text-gray-400 font-mono">Icon: {service.iconName}</div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-6">
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
                   {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ Logic Updated!</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-500">Google Maps Embed URL (Iframe Src)</label>
                      <input name="googleMapsEmbed" defaultValue={settings.googleMapsEmbed} className="admin-input" placeholder="https://www.google.com/maps/embed?..." />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-500 text-brand-blue font-extrabold flex items-center gap-2">
                         AI Agent Display Name
                         <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded text-[8px]">New</span>
                      </label>
                      <input name="aiName" defaultValue={settings.aiName} className="admin-input border-brand-blue/30 focus:border-brand-blue" placeholder="e.g. Phinovax Rep" />
                   </div>
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
                     className="admin-input h-24" 
                     placeholder="Be professional, always mention workshop at Ankpa road, ask for phone number..." 
                   />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase text-brand-blue flex items-center gap-2">
                          <ImageIcon size={14} /> Diagnostic Lab Welcome Message
                       </label>
                       <textarea name="labWelcomeMessage" defaultValue={settings.labWelcomeMessage} className="admin-input h-24" placeholder="e.g. Welcome to the Lab! What seems to be the trouble?" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase text-brand-blue flex items-center gap-2">
                          <Bot size={14} /> Lab Specialized System Prompt
                       </label>
                       <textarea name="labSystemPrompt" defaultValue={settings.labSystemPrompt} className="admin-input h-24" placeholder="Special instructions for the diagnostic engine..." />
                    </div>
                 </div>

                 <div className="space-y-1 rounded-2xl border-2 border-brand-blue/20 p-4 bg-brand-blue/5">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-extrabold uppercase text-brand-blue flex items-center gap-2">
                          <Zap size={14} /> Essential: Google Gemini API Key
                       </label>
                       <button 
                         type="button"
                         onClick={handleTestConnection}
                         disabled={testing}
                         className={`text-[9px] font-black px-3 py-1 rounded-full transition-all border ${
                           testing ? 'bg-gray-100 text-gray-400 border-gray-200' :
                           testResult?.success ? 'bg-green-500 text-white border-green-600 shadow-sm shadow-green-200' :
                           testResult?.success === false ? 'bg-red-500 text-white border-red-600' :
                           'bg-white text-brand-blue border-brand-blue/20 hover:border-brand-blue'
                         }`}
                       >
                         {testing ? 'Testing...' : testResult?.success ? '✓ Connected!' : 'Test Connectivity'}
                       </button>
                    </div>
                    <input 
                      type="password"
                      name="aiApiKey" 
                      value={previews.aiApiKey} 
                      onChange={(e) => setPreviews(prev => ({ ...prev, aiApiKey: e.target.value }))}
                      className="admin-input bg-white border-brand-blue/20" 
                      placeholder="Paste your AI API Key here..." 
                    />
                    {testResult && (
                      <p className={`text-[9px] mt-2 font-bold ${testResult.success ? 'text-green-600' : 'text-red-500'}`}>
                        {testResult.success ? '✓ Google AI Studio Link Verified' : `⚠ ${testResult.message}`}
                      </p>
                    )}
                    <p className="text-[9px] text-brand-blue/60 mt-2 font-medium">This key is required for the AI Chatbot and Marketing Post Generator to function. Get one from Google AI Studio.</p>
                 </div>

                 <div className="space-y-1 border-t pt-4">
                   <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                      Deep Training Data / Business Context
                      <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded text-[8px]">Requirement #3</span>
                   </label>
                   <textarea name="aiTrainingData" 
                     defaultValue={settings.aiTrainingData} 
                     className="admin-input h-48 font-mono text-xs" 
                     placeholder="Paste technical data, history, or deep business context here..." 
                   />
                   <p className="text-[10px] text-gray-400 italic">This data is strictly for the AI logic (Gemini) to learn from and is not visible to public users.</p>
                </div>


                <div className="border-t pt-6">
                   <button type="submit" className="admin-btn-save">
                     <Save size={18} /> Update Business Logic
                   </button>
                </div>
              </form>

              {/* API Explorer / Live Chat Tester */}
              <div className="bg-gray-900 text-gray-100 p-8 rounded-3xl space-y-6 shadow-2xl border-4 border-gray-800">
                 <div className="flex items-center gap-3">
                    <div className="bg-brand-blue/20 p-2 rounded-lg text-brand-blue">
                       <Zap size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white leading-tight">Live AI API Explorer</h3>
                       <p className="text-xs text-gray-400">Request raw data from Google Gemini to verify logic response.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold uppercase text-gray-500">Your Test Payload</label>
                       <div className="flex gap-2">
                          <input 
                            value={testPrompt}
                            onChange={(e) => setTestPrompt(e.target.value)}
                            placeholder="e.g. What services do you provide?"
                            className="flex-1 bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                          />
                          <button 
                            onClick={handleExplorerTest}
                            disabled={exploring}
                            className={`px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                              exploring ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-brand-blue text-white hover:bg-blue-600'
                            }`}
                          >
                             {exploring ? <Activity className="animate-pulse" size={14} /> : <Share2 size={14} />}
                             {exploring ? 'Querying...' : 'Send Query'}
                          </button>
                       </div>
                    </div>

                    {explorerResult && (
                       <div className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in slide-in-from-bottom-2 ${
                         explorerResult.success ? 'bg-gray-800 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                       }`}>
                          <div className="flex items-center justify-between">
                             <span className={`text-[10px] font-black uppercase ${explorerResult.success ? 'text-green-500' : 'text-red-500'}`}>
                                {explorerResult.message}
                             </span>
                             <Bot size={14} className={explorerResult.success ? 'text-green-500' : 'text-red-500'} />
                          </div>
                          
                          {explorerResult.response ? (
                            <div className="text-xs leading-relaxed text-gray-300 font-medium bg-gray-950/50 p-4 rounded-xl border border-white/5">
                               {explorerResult.response}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">No text response returned. Check API usage or prompt constraints.</p>
                          )}
                       </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
                       <span className="text-[9px] text-gray-500 font-bold uppercase">Direct Stream to AI Studio</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={12} className="text-gray-500" />
                       <span className="text-[9px] text-gray-500 font-bold uppercase">Standard Token Encryption</span>
                    </div>
                 </div>
              </div>
            </div>
           )}
           {activeTab === "marketing" && (
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                         <Share2 size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-gray-900 leading-tight">Daily AI Marketing</h2>
                         <p className="text-xs text-gray-500">Auto-generated social media drafts for your review.</p>
                      </div>
                   </div>
                   <button 
                     onClick={async () => {
                        const res = await fetch('/api/cron/generate-posts');
                        if (res.ok) alert("New drafts generated! Refreshing page...");
                        window.location.reload();
                     }}
                     className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all flex items-center gap-2"
                   >
                      <Plus size={14} /> Generate Manual Drafts
                   </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800 flex items-center gap-3">
                      <Bot size={18} />
                      <span>The AI generates 3 new drafts every day automatically. You can approve them here before posting.</span>
                   </div>
                   
                   {aiPostsList.length === 0 ? (
                      <p className="text-sm text-gray-400 italic text-center py-12">No marketing drafts found yet. Click "Generate Manual Drafts" to start.</p>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {aiPostsList.map((post: any) => (
                            <div key={post.id} className="bg-white border p-6 rounded-2xl shadow-sm hover:border-brand-blue transition-all group relative">
                               <div className="flex items-center justify-between mb-4">
                                  <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded font-bold uppercase">{post.platform}</span>
                                  <span className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                               </div>
                               <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                               <div className="mt-6 pt-4 border-t flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex gap-1">
                                     <button 
                                       onClick={() => {
                                          navigator.clipboard.writeText(post.content);
                                          alert("Content copied!");
                                       }}
                                       className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                                       title="Copy to clipboard"
                                     >
                                        <Copy size={14} />
                                     </button>
                                  </div>
                                  <div className="flex gap-2">
                                     <button 
                                       onClick={() => discardAiPost(post.id)}
                                       className="text-[10px] font-bold text-gray-400 hover:text-red-500 px-2"
                                     >
                                       Discard
                                     </button>
                                     <button 
                                       onClick={() => approveAiPost(post.id)}
                                       className="bg-brand-blue text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md hover:bg-blue-800 active:scale-95"
                                     >
                                        Approve Draft
                                     </button>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
           )}

           {activeTab === "leads" && (
             <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                     <CheckCircle size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 leading-tight">Inbound Customer Leads</h2>
                     <p className="text-xs text-gray-500">Captured by the AI representative for follow-up.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {leadsList.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                       <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                       <p className="text-gray-500 font-medium">No leads captured yet. The AI is waiting for customers!</p>
                    </div>
                  ) : (
                    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Customer / Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Issue / Request</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Action</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y">
                             {leadsList.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4">
                                      <div className="font-bold text-gray-900">{lead.name}</div>
                                      <div className="text-xs text-brand-blue font-medium">{lead.contactMethod}</div>
                                      {lead.status === 'new' && (
                                         <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[8px] font-black uppercase rounded">New Lead</span>
                                      )}
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className="text-sm text-gray-700 font-medium">{lead.issueType}</div>
                                      <div className="flex items-center gap-2 mt-1">
                                         <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                            lead.urgency === 'High' ? 'bg-red-100 text-red-600' : 
                                            lead.urgency === 'Medium' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                         }`}>{lead.urgency} Urgency</span>
                                         <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                            lead.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                         }`}>{lead.status || 'new'}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-[10px] text-gray-400">
                                      {new Date(lead.createdAt).toLocaleString()}
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                         <a 
                                           href={`https://wa.me/${lead.contactMethod?.replace(/\D/g, '') || ''}`} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="text-[10px] bg-green-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2"
                                         >
                                            <Share2 size={12} /> Contact
                                         </a>
                                         
                                         <button 
                                           onClick={() => updateLeadStatus(lead.id, lead.status === 'resolved' ? 'new' : 'resolved')}
                                           className={`p-2 rounded-lg transition-colors ${lead.status === 'resolved' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                           title={lead.status === 'resolved' ? "Mark as New" : "Mark as Resolved"}
                                         >
                                            <CheckCircle size={14} />
                                         </button>

                                         <button 
                                           onClick={() => {
                                              if (confirm("Delete this lead?")) deleteLead(lead.id);
                                           }}
                                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                           title="Delete Lead"
                                         >
                                            <Trash2 size={14} />
                                         </button>
                                      </div>
                                   </td>
                                </tr>
                             ))}
                           </tbody>
                       </table>
                    </div>
                  )}
               </div>
             </div>
           )}

           {activeTab === "seo" && (
            <div className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
                         <Globe size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-gray-900 leading-tight">SEO & Global Ranking</h2>
                         <p className="text-xs text-gray-500">Control how Google and Social Media see your site.</p>
                      </div>
                   </div>
                   {saveStatus === 'success' && <span className="text-xs font-bold text-green-600 animate-bounce">✓ SEO Saved!</span>}
                </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-500">Meta Description</label>
                     <textarea name="metaDescription" defaultValue={settings.metaDescription} className="admin-input h-24" placeholder="Describe your business for search engines..." />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-500">Keywords (Comma separated)</label>
                     <input name="metaKeywords" defaultValue={settings.metaKeywords} className="admin-input" placeholder="mechanic, generator, makurdi..." />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase text-gray-500">OpenGraph Image (Shared on Social)</label>
                     <div className="flex gap-2">
                         <input type="hidden" name="ogImageUrl" value={previews.ogImageUrl} readOnly />
                         <input type="file" onChange={(e) => handleUpload(e, 'ogImageUrl')} className="admin-input text-xs" accept="image/*" />
                         <button type="button" onClick={() => setSelectedMediaTarget('ogImageUrl')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500" title="Pick from Library">
                            <ImageIcon size={16} />
                         </button>
                         {uploading === 'ogImageUrl' && <Loader2 className="animate-spin text-brand-blue" />}
                      </div>
                  </div>
               </div>

               <div className="pt-6 border-t">
                  <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Facebook URL</label>
                        <input name="facebookUrl" defaultValue={settings.facebookUrl} className="admin-input" placeholder="https://facebook.com/..." />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Instagram URL</label>
                        <input name="instagramUrl" defaultValue={settings.instagramUrl} className="admin-input" placeholder="https://instagram.com/..." />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Twitter (X) URL</label>
                        <input name="twitterUrl" defaultValue={settings.twitterUrl} className="admin-input" placeholder="https://x.com/..." />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">LinkedIn URL</label>
                        <input name="linkedinUrl" defaultValue={settings.linkedinUrl} className="admin-input" placeholder="https://linkedin.com/..." />
                     </div>
                  </div>
               </div>

               <button type="submit" className="admin-btn-save">
                  <Save size={18} /> Save Global SEO Changes
               </button>
             </form>
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
