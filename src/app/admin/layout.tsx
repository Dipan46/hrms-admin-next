"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarClock, 
  Settings, 
  LogOut,
  Clock,
  Smartphone,
  MapPin,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Clients", href: "/admin/clients", icon: Building2 },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Attendance", href: "/admin/attendance", icon: CalendarClock },
    { name: "Leaves", href: "/admin/leaves", icon: Clock },
    { name: "Shifts", href: "/admin/shifts", icon: Clock },
    { name: "Branches", href: "/admin/branches", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-bold text-blue-600">HRMS Admin</h1>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300">
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-shrink-0 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-blue-600">HRMS Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Super Admin Console</p>
        </div>

        <nav className="mt-4 space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 dark:bg-zinc-700 rounded-full h-10 w-10 flex items-center justify-center">
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    {session?.user?.name?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.role}</p>
                </div>
              </div>
              <ThemeToggle />
          </div>
          
          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
          <Link
            href="/employee"
            className="flex items-center justify-center w-full px-4 py-2 mt-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50 transition"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Open Employee App
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full px-4 py-2 mt-2 border border-transparent rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            ← Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        {children}
      </main>
    </div>
  );
}
