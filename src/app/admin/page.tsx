import { getSiteSettings, getActiveServices, getAllPages, getAllNavItems, getAiPosts, getLeads, getSystemMetrics, getMediaAssets, getArtisans, getBookings } from "@/app/actions";

import AdminTabs from "@/components/AdminTabs";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialTab = resolvedParams?.tab || "dashboard";

  const settings = await getSiteSettings();
  const servicesList = await getActiveServices();
  const pagesList = await getAllPages();
  const navItemsList = await getAllNavItems();
  const aiPostsList = await getAiPosts();
  const leadsList = await getLeads();
  const metrics = await getSystemMetrics();
  const mediaAssets = await getMediaAssets();
  const artisansList = await getArtisans(false);
  const bookingsList = await getBookings();

  return (
    <div className="max-w-6xl mx-auto pt-4 md:pt-0">
      <AdminTabs
        initialTab={initialTab}
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



