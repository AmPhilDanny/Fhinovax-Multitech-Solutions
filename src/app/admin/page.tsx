import { getSiteSettings } from "@/app/actions";
import { saveSiteSettings } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">FHINOVAX Admin Panel</h1>
        <p className="text-gray-500 mt-2">Manage your mobile-first website content from here.</p>
      </div>

      <form action={saveSiteSettings} className="space-y-8">
        {/* BRAND IDENTITY */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-blue border-b pb-2">Brand Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site / Business Name</label>
              <input 
                name="siteName" 
                defaultValue={settings.siteName} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image URL</label>
              <input 
                name="logoUrl" 
                defaultValue={settings.logoUrl || ''} 
                placeholder="e.g. /logo.png or https://..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
              />
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-blue border-b pb-2">Hero Section</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (HTML allowed for colors)</label>
            <input 
              name="heroTitle" 
              defaultValue={settings.heroTitle} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea 
              name="heroSubtitle" 
              defaultValue={settings.heroSubtitle} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50 h-24" 
              required 
            />
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-blue border-b pb-2">Contact & Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (For Call Button)</label>
              <input 
                name="phoneNumber" 
                defaultValue={settings.phoneNumber} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (No + sign)</label>
              <input 
                name="whatsappNumber" 
                defaultValue={settings.whatsappNumber} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                name="emailAddress" 
                defaultValue={settings.emailAddress || ''} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
              <input 
                name="operatingHours" 
                defaultValue={settings.operatingHours || ''} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input 
              name="address" 
              defaultValue={settings.address} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" 
              required 
            />
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-gray-200">
          <button type="submit" className="w-full md:w-auto px-8 bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-md">
            Save All Backend Changes
          </button>
        </div>
      </form>
    </div>
  );
}
