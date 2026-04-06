import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Super simple authentication for immediate protection.
  // In a full production app, you might swap this with NextAuth/Supabase Auth
  
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    // If not authenticated, we actually just render a fast minimal login form here
    // rather than dealing with complex middleware for a fast demo
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form 
          action={async (formData) => {
            'use server';
            const pass = formData.get('password');
            // Hardcoded password for this demo (e.g., 'fhinovax2024')
            if (pass === 'admin@fhinovax') {
              const cookiesList = await cookies();
              cookiesList.set('admin_auth', 'true', { maxAge: 60 * 60 * 24 });
            }
          }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full"
        >
          <div className="w-12 h-12 bg-brand-blue rounded flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
            F
          </div>
          <h2 className="text-xl font-bold text-center mb-6 text-gray-900">Admin Login</h2>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter Admin Password" 
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          />
          <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors">
            Login
          </button>
          <p className="text-xs text-gray-400 mt-4 text-center">Password is: admin@fhinovax</p>
        </form>
      </div>
    );
  }

  // If authenticated, render the dashboard
  return (
    <>
      {children}
    </>
  );
}
