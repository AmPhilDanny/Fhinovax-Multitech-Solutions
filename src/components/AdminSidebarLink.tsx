"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AdminSidebarLink({ 
  href, 
  label, 
  icon 
}: { 
  href: string, 
  label: string, 
  icon: string 
}) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  
  // Extract tab from href (e.g. /admin?tab=xxx -> xxx)
  const targetTab = href.split("tab=")[1] || "dashboard";
  const isActive = currentTab === targetTab;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
        isActive 
          ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
          : "text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue"
      }`}
    >
      <span className={`text-base leading-none w-5 text-center transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
        {icon}
      </span>
      <span className="leading-tight">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      )}
    </Link>
  );
}
