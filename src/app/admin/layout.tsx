import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

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

  // If authenticated, render the dashboard with a sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-gray-900">Admin</span>
          </div>
          <Link href="/" className="text-xs text-blue-600 hover:underline">View Site &rarr;</Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-lg bg-blue-50 text-brand-blue font-bold text-sm">
            Dashboard Home
          </Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/" className="px-4 py-2 text-xs text-gray-500 hover:text-brand-blue flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Live Site
            </Link>
          </div>
        </nav>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
