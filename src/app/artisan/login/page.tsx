'use server';

import { cookies } from 'next/headers';
import { db } from '@/db';
import { artisans } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ArtisanLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  async function handleLogin(formData: FormData) {
    'use server';
    const phone = (formData.get('phone') as string)?.trim();
    const password = formData.get('password') as string;

    if (!phone || !password) {
      redirect('/artisan/login?error=Please+fill+in+all+fields');
    }

    const hash = createHash('sha256').update(password).digest('hex');
    const results = await db
      .select()
      .from(artisans)
      .where(eq(artisans.phoneNumber, phone))
      .limit(1);

    const artisan = results[0];

    if (!artisan) {
      redirect('/artisan/login?error=No+account+found+with+that+phone+number');
    }
    if (artisan.status !== 'active') {
      redirect('/artisan/login?error=Your+account+is+pending+admin+approval');
    }
    if (artisan.passwordHash !== hash) {
      redirect('/artisan/login?error=Incorrect+password');
    }

    const cookieStore = await cookies();
    cookieStore.set('artisan_session', String(artisan.id), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
    });

    redirect('/artisan');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-blue/30">
              F
            </div>
            <div className="text-left">
              <div className="font-black text-gray-900 text-lg leading-tight">Fhinovax</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Artisan Portal</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10">
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-400 font-medium mb-8">Sign in to your artisan account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-bold">
              ⚠️ {decodeURIComponent(error)}
            </div>
          )}

          <form action={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+2348012345678"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-brand-blue/20 mt-2"
            >
              Sign In →
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-400 font-medium">
              Not yet registered?{' '}
              <Link href="/onboard" className="text-brand-blue font-black hover:underline">
                Join the Network
              </Link>
            </p>
            <p className="text-[10px] text-gray-300">
              Your account is activated after admin approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
