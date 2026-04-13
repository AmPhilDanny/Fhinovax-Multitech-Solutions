'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function artisanLogout() {
  const cookiesList = await cookies();
  cookiesList.set('artisan_session', '', { maxAge: 0, path: '/' });
  redirect('/artisan/login');
}
