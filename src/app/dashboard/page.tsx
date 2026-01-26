import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Shield, Smartphone, ArrowRight, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative">
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl w-full text-center mb-12">
        <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {session.user?.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400">Select where you want to go today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        
        {/* Admin Card - Only for Admins */}
        {["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user?.role || "") ? (
            <Link
                href="/admin"
                className="group relative bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 text-left"
            >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                </div>
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Admin Console</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage employees, attendance, payroll, and settings.</p>
            </Link>
        ) : (
            <div className="opacity-50 cursor-not-allowed bg-gray-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 text-left">
                 <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">Admin Console</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">You do not have permission to access the admin area.</p>
            </div>
        )}

        {/* Employee Card - For Everyone */}
        <Link
            href="/employee"
            className="group relative bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 text-left"
        >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Employee App</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check in/out, view payslips, and request leaves.</p>
        </Link>

      </div>

      <div className="mt-12">
        <Link
            href="/api/auth/signout"
            className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition flex items-center"
        >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
        </Link>
      </div>
    </div>
  );
}
