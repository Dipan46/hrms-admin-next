"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, Building, User, Lock, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    companyCode: "",
    adminName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Start your Journey
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your organization account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Organization Details */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Organization Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                required
                                type="text"
                                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Acme Inc"
                                value={formData.companyName}
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Org Code</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                className="w-full rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white p-2.5 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono"
                                placeholder="ACME"
                                value={formData.companyCode}
                                onChange={e => setFormData({...formData, companyCode: e.target.value.toUpperCase()})}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Admin Account</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            required
                            className="pl-10 w-full rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                            value={formData.adminName}
                            onChange={e => setFormData({...formData, adminName: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            required
                            type="email"
                            className="pl-10 w-full rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="admin@acme.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            required
                            type="password"
                            className="pl-10 w-full rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Sign in
                </Link>
            </p>
        </form>
      </div>
    </div>
  );
}
