import { cookies } from 'next/headers';
import Link from 'next/link';

const NAV_SECTIONS = [
  {
    group: "Overview",
    items: [
      { href: "/admin?tab=dashboard", label: "Dashboard Home", icon: "📊" },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin?tab=technical_services", label: "Technical Services", icon: "🔧" },
      { href: "/admin?tab=pages", label: "Pages Architect", icon: "📄" },
      { href: "/admin?tab=navigator", label: "Menu Architect", icon: "🗂️" },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/admin?tab=bookings", label: "Inspection & Service Feed", icon: "📋" },
      { href: "/admin?tab=artisans", label: "Artisan Network", icon: "👷" },
    ],
  },
  {
    group: "Customization",
    items: [
      { href: "/admin?tab=identity", label: "Branding & Media", icon: "🎨" },
      { href: "/admin?tab=footer", label: "Footer Settings", icon: "🏠" },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { href: "/admin?tab=agent", label: "AI & System", icon: "🤖" },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          action={async (formData) => {
            'use server';
            const pass = formData.get('password');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col md:min-h-screen">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-black text-sm">F</div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-tight">Fhinovax</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
          <Link href="/" className="text-[10px] font-bold text-brand-blue hover:underline whitespace-nowrap">
            View Site →
          </Link>
        </div>

        {/* Live Status */}
        <div className="px-5 py-3 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Live Site Online</span>
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.group}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 px-3 mb-1.5">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <span className="text-base leading-none w-5 text-center">{item.icon}</span>
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <form
            action={async () => {
              'use server';
              const cookiesList = await cookies();
              cookiesList.set('admin_auth', '', { maxAge: 0 });
            }}
          >
            <button
              type="submit"
              className="w-full text-[10px] font-black uppercase text-gray-400 hover:text-red-500 py-2 transition-colors tracking-widest rounded-xl hover:bg-red-50"
            >
              🔒 Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
