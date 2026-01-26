"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/employee", icon: Home },
    { name: "Leaves", href: "/employee/leaves", icon: Calendar },
    { name: "Profile", href: "/employee/profile", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center px-4 z-30">
        <span className="font-bold text-gray-900 dark:text-white">HRMS Employee</span>
        <ThemeToggle />
      </div>

      <main className="flex-1 pt-16 px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 pb-safe">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
