"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Mail, Briefcase, Key, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProfilePage() {
  const { data: session } = useSession();

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

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

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-6">
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

      {/* Password Change Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-6">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <div className="flex items-center">
            <Key className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm font-medium dark:text-gray-200">Change Password</span>
          </div>
          <span className="text-gray-400">{showPasswordForm ? "−" : "+"}</span>
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Password changed successfully!
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Current Password</label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
            >
              {passwordLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
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

