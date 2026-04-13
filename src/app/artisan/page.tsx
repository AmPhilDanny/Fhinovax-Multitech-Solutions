import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { artisans, bookings } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import ArtisanDashboardClient from './ArtisanDashboardClient';

export default async function ArtisanPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('artisan_session')?.value;
  if (!sessionId) redirect('/artisan/login');

  const artisanId = parseInt(sessionId);
  const params = await searchParams;
  const tab = params?.tab || 'dashboard';

  // Fetch artisan data
  const results = await db.select().from(artisans).where(eq(artisans.id, artisanId)).limit(1);
  const artisan = results[0];
  if (!artisan) redirect('/artisan/login');

  // Fetch job metrics from bookings
  const [totalJobs] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.assignedArtisanId, artisanId));

  const [pendingJobs] = await db
    .select({ count: count() })
    .from(bookings)
    .where(and(eq(bookings.assignedArtisanId, artisanId), eq(bookings.status, 'assigned')));

  const [completedJobs] = await db
    .select({ count: count() })
    .from(bookings)
    .where(and(eq(bookings.assignedArtisanId, artisanId), eq(bookings.status, 'completed')));

  const [newJobs] = await db
    .select({ count: count() })
    .from(bookings)
    .where(and(eq(bookings.assignedArtisanId, artisanId), eq(bookings.status, 'new')));

  // Fetch all assigned bookings for job list
  const myJobs = await db
    .select()
    .from(bookings)
    .where(eq(bookings.assignedArtisanId, artisanId));

  const metrics = {
    total: Number(totalJobs.count),
    pending: Number(pendingJobs.count),
    completed: Number(completedJobs.count),
    newAssigned: Number(newJobs.count),
  };

  return (
    <ArtisanDashboardClient
      artisan={{
        id: artisan.id,
        name: artisan.name,
        email: artisan.email || '',
        specialty: artisan.specialty,
        location: artisan.location,
        phoneNumber: artisan.phoneNumber,
        bio: artisan.bio || '',
        photoUrl: artisan.photoUrl || '',
        yearsExperience: artisan.yearsExperience || 0,
        status: artisan.status || 'pending',
      }}
      metrics={metrics}
      jobs={myJobs.map(j => ({
        id: j.id,
        clientName: j.clientName,
        location: j.location,
        issueDescription: j.issueDescription,
        preferredDate: j.preferredDate || '',
        status: j.status || 'new',
        createdAt: j.createdAt ? j.createdAt.toISOString() : '',
      }))}
      activeTab={tab}
    />
  );
}
