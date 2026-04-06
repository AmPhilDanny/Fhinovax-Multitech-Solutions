import { getSiteSettings } from "@/app/actions";
import { saveSiteSettings } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">FHINOVAX Admin Panel</h1>
          <p className="text-gray-500 mt-2">Manage your mobile-first website content from here.</p>
        </div>

        <form action={saveSiteSettings} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-blue">Global Settings & Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (HTML allowed for colors)</label>
              <input 
                name="heroTitle" 
                defaultValue={settings.heroTitle} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea 
                name="heroSubtitle" 
                defaultValue={settings.heroSubtitle} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue h-24" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (For Call Button)</label>
                <input 
                  name="phoneNumber" 
                  defaultValue={settings.phoneNumber} 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input 
                  name="whatsappNumber" 
                  defaultValue={settings.whatsappNumber} 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <input 
                name="address" 
                defaultValue={settings.address} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                required 
              />
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-gray-100">
            <button type="submit" className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors">
              Save All Changes to Live Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
