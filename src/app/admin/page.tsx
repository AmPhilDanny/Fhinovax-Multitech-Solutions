import { getSiteSettings, getActiveServices, getAllPages, getAllNavItems, getAiPosts, getLeads, getSystemMetrics, getMediaAssets, getArtisans, getBookings } from "@/app/actions";

import AdminTabs from "@/components/AdminTabs";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const settings = await getSiteSettings();
  const servicesList = await getActiveServices();
  const pagesList = await getAllPages();
  const navItemsList = await getAllNavItems();
  const aiPostsList = await getAiPosts();
  const leadsList = await getLeads();
  const metrics = await getSystemMetrics();
  const mediaAssets = await getMediaAssets();
  const artisansList = await getArtisans(false); // Fetch all for management
  const bookingsList = await getBookings();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Fhinovax Control Center</h1>
        <p className="text-gray-500 mt-2 font-medium">Fully dynamic management for your multitech solutions platform.</p>
      </div>

      <AdminTabs 
        settings={settings} 
        servicesList={servicesList} 
        pagesList={pagesList} 
        navItemsList={navItemsList} 
        aiPostsList={aiPostsList}
        leadsList={leadsList}
        metrics={metrics}
        mediaAssetsList={mediaAssets}
        artisansList={artisansList}
        bookingsList={bookingsList}
      />
    </div>
  );
}



