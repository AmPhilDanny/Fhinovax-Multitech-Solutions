'use client';

import { useState, useTransition } from 'react';
import {
  Briefcase, CheckCircle2, Clock, Wrench, User,
  MapPin, Phone, Star, Edit3, Save, X, Key, Eye, EyeOff, Loader2
} from 'lucide-react';
import { updateArtisanProfile, changeArtisanPassword } from './actions';

type Artisan = {
  id: number;
  name: string;
  email: string;
  specialty: string;
  location: string;
  phoneNumber: string;
  bio: string;
  photoUrl: string;
  yearsExperience: number;
  status: string;
};

type Metrics = {
  total: number;
  pending: number;
  completed: number;
  newAssigned: number;
};

type Job = {
  id: number;
  clientName: string;
  location: string;
  issueDescription: string;
  preferredDate: string;
  status: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-100',
  assigned: 'bg-amber-50 text-amber-600 border-amber-100',
  completed: 'bg-green-50 text-green-600 border-green-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default function ArtisanDashboardClient({
  artisan,
  metrics,
  jobs,
  activeTab,
}: {
  artisan: Artisan;
  metrics: Metrics;
  jobs: Job[];
  activeTab: string;
}) {
  const [tab, setTab] = useState(activeTab);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPw, setShowPw] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('artisanId', String(artisan.id));
    startTransition(async () => {
      const res = await updateArtisanProfile(formData);
      if (res.success) {
        showToast('Profile updated successfully!');
        setEditMode(false);
      } else {
        showToast(res.error || 'Update failed', 'error');
      }
    });
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('artisanId', String(artisan.id));
    const newPw = formData.get('newPassword') as string;
    const confirm = formData.get('confirmPassword') as string;
    if (newPw !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    startTransition(async () => {
      const res = await changeArtisanPassword(formData);
      if (res.success) {
        showToast('Password changed successfully!');
        (e.target as HTMLFormElement).reset();
      } else {
        showToast(res.error || 'Failed to change password', 'error');
      }
    });
  };

  const NavBtn = ({ id, label, icon }: { id: string; label: string; icon: string }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        tab === id
          ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl border transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Hello, {artisan.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-1">{artisan.specialty} · {artisan.location}</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
          artisan.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          {artisan.status === 'active' ? '● Active' : '○ ' + artisan.status}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex flex-wrap gap-2 bg-gray-100/60 p-1.5 rounded-2xl w-fit">
        <NavBtn id="dashboard" label="Dashboard" icon="📊" />
        <NavBtn id="profile" label="My Profile" icon="👤" />
        <NavBtn id="jobs" label="My Jobs" icon="📋" />
        <NavBtn id="password" label="Change Password" icon="🔑" />
      </div>

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <div className="space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Jobs', value: metrics.total, icon: Briefcase, color: 'blue' },
              { label: 'New / Unread', value: metrics.newAssigned, icon: Star, color: 'purple' },
              { label: 'In Progress', value: metrics.pending, icon: Clock, color: 'amber' },
              { label: 'Completed', value: metrics.completed, icon: CheckCircle2, color: 'green' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                  color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="text-3xl font-black text-gray-900">{value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent Jobs Preview */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-black text-gray-900">Recent Assignments</h2>
              <button onClick={() => setTab('jobs')} className="text-xs font-black text-brand-blue hover:underline">
                View All →
              </button>
            </div>
            {jobs.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-medium text-sm">
                <Wrench className="mx-auto mb-3 opacity-30" size={32} />
                No jobs assigned yet. Check back soon!
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 font-black text-sm">
                      #{job.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm truncate">{job.clientName}</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5 truncate">{job.issueDescription}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPin size={10} /> {job.location}
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${STATUS_STYLES[job.status] || STATUS_STYLES.new}`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-gray-900">My Profile</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                editMode ? 'bg-gray-100 text-gray-600' : 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
              }`}
            >
              {editMode ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'name', label: 'Full Name', icon: User, defaultValue: artisan.name },
                { name: 'specialty', label: 'Specialty', icon: Wrench, defaultValue: artisan.specialty },
                { name: 'location', label: 'Location', icon: MapPin, defaultValue: artisan.location },
                { name: 'phoneNumber', label: 'Phone Number', icon: Phone, defaultValue: artisan.phoneNumber },
                { name: 'email', label: 'Email Address', icon: User, defaultValue: artisan.email },
                { name: 'yearsExperience', label: 'Years of Experience', icon: Star, defaultValue: String(artisan.yearsExperience) },
              ].map(({ name, label, icon: Icon, defaultValue }) => (
                <div key={name} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-1.5">
                    <Icon size={10} /> {label}
                  </label>
                  <input
                    name={name}
                    defaultValue={defaultValue}
                    disabled={!editMode}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Bio / About Me</label>
              <textarea
                name="bio"
                defaultValue={artisan.bio}
                disabled={!editMode}
                rows={4}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Profile Photo URL</label>
              <input
                name="photoUrl"
                defaultValue={artisan.photoUrl}
                disabled={!editMode}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            {editMode && (
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            )}
          </form>
        </div>
      )}

      {/* ── JOBS TAB ── */}
      {tab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-black text-gray-900">All Assigned Jobs</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">{metrics.total} total assignments</p>
          </div>
          {jobs.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-medium text-sm">
              <Wrench className="mx-auto mb-4 opacity-30" size={40} />
              <p className="font-black text-gray-500">No jobs yet</p>
              <p className="mt-1">Jobs assigned to you by admin will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <div key={job.id} className="p-5 md:p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 font-black">
                      #{job.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="font-black text-gray-900">{job.clientName}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLES[job.status] || STATUS_STYLES.new}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-2">{job.issueDescription}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-bold">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                        {job.preferredDate && <span className="flex items-center gap-1">📅 {job.preferredDate}</span>}
                        <span>🕒 {new Date(job.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PASSWORD TAB ── */}
      {tab === 'password' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-lg">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-black text-gray-900 flex items-center gap-2"><Key size={18} /> Change Password</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Keep your account secure with a strong password.</p>
          </div>
          <form onSubmit={handlePasswordChange} className="p-6 md:p-8 space-y-5">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((fieldName) => (
              <div key={fieldName} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {fieldName === 'currentPassword' ? 'Current Password' :
                   fieldName === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <input
                    name={fieldName}
                    type={showPw ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                  {fieldName === 'currentPassword' && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 mt-2"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
