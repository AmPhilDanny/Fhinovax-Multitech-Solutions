import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { artisans } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('artisan_session')?.value;

  if (!sessionId) {
    redirect('/artisan/login');
  }

  const results = await db
    .select()
    .from(artisans)
    .where(eq(artisans.id, parseInt(sessionId)))
    .limit(1);

  const artisan = results[0];

  if (!artisan || artisan.status !== 'active') {
    redirect('/artisan/login');
  }

  async function logout() {
    'use server';
    const cookiesList = await cookies();
    cookiesList.set('artisan_session', '', { maxAge: 0, path: '/' });
    redirect('/artisan/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <Link href="/" className="flex items-center gap-3 group mb-4">
            <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-blue/20">
              F
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-tight">Fhinovax</div>
              <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Artisan Portal</div>
            </div>
          </Link>

          {/* Artisan Chip */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black text-lg flex-shrink-0">
              {artisan.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-black text-gray-900 text-sm truncate">{artisan.name}</div>
              <div className="text-[10px] text-gray-400 font-bold truncate">{artisan.specialty}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 px-3 mb-2">My Account</p>
          <Link
            href="/artisan"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
          >
            <span className="text-base">📊</span> Dashboard
          </Link>
          <Link
            href="/artisan?tab=profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
          >
            <span className="text-base">👤</span> My Profile
          </Link>
          <Link
            href="/artisan?tab=jobs"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
          >
            <span className="text-base">📋</span> My Jobs
          </Link>
          <Link
            href="/artisan?tab=password"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
          >
            <span className="text-base">🔑</span> Change Password
          </Link>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
            >
              <span className="text-base">🌐</span> View Site
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 py-2 transition-colors rounded-xl hover:bg-red-50"
            >
              🔒 Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
