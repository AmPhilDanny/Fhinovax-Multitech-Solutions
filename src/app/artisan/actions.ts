'use server';

import { db } from '@/db';
import { artisans } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { revalidatePath } from 'next/cache';

export async function updateArtisanProfile(formData: FormData) {
  const artisanId = parseInt(formData.get('artisanId') as string);
  if (!artisanId) return { success: false, error: 'Invalid session.' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const specialty = formData.get('specialty') as string;
  const location = formData.get('location') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const bio = formData.get('bio') as string;
  const photoUrl = formData.get('photoUrl') as string;
  const yearsExperience = parseInt(formData.get('yearsExperience') as string) || 0;

  try {
    await db
      .update(artisans)
      .set({ name, email, specialty, location, phoneNumber, bio, photoUrl, yearsExperience })
      .where(eq(artisans.id, artisanId));

    revalidatePath('/artisan');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function changeArtisanPassword(formData: FormData) {
  const artisanId = parseInt(formData.get('artisanId') as string);
  if (!artisanId) return { success: false, error: 'Invalid session.' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  try {
    const results = await db.select().from(artisans).where(eq(artisans.id, artisanId)).limit(1);
    const artisan = results[0];
    if (!artisan) return { success: false, error: 'Account not found.' };

    const currentHash = createHash('sha256').update(currentPassword).digest('hex');
    if (artisan.passwordHash && artisan.passwordHash !== currentHash) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    const newHash = createHash('sha256').update(newPassword).digest('hex');
    await db.update(artisans).set({ passwordHash: newHash }).where(eq(artisans.id, artisanId));

    revalidatePath('/artisan');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
