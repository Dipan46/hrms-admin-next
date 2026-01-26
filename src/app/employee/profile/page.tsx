"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Mail, Briefcase } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 text-center mb-6">
        <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{session?.user?.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employee</p>
        <div className="mt-4 flex justify-center">
             <ThemeToggle />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-3" />
            <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium dark:text-gray-200">{session?.user?.email}</p>
            </div>
        </div>
        <div className="p-4 flex items-center">
            <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
            <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-medium dark:text-gray-200">{session?.user?.role}</p>
            </div>
        </div>
      </div>

      {["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session?.user?.role || "") && (
        <Link
          href="/admin"
          className="w-full py-4 mb-4 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Briefcase className="h-5 w-5 mr-2" />
          Go to Admin Console
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full py-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-semibold flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sign Out
      </button>

      <Link 
        href="/"
        className="w-full py-4 mt-4 text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center hover:text-gray-900 dark:hover:text-white transition"
      >
        ← Back to Website
      </Link>

      <div className="text-center mt-8 text-xs text-gray-400">
        v1.0.0
      </div>
    </div>
  );
}
