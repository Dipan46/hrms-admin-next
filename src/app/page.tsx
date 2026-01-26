"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Smartphone, 
  MapPin, 
  Clock,
  ArrowRight,
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">HRMS Pro</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Features</a>
              <ThemeToggle />
              <Link 
                href="/login" 
                target="_blank"
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-4 py-4 space-y-4">
            <Link 
                href="/employee" 
                className="block px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium"
            >
                Employee App
            </Link>
            <Link 
                href="/admin" 
                className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
                Admin Console
            </Link>
            <Link 
                href="/login" 
                className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-center"
            >
                Login
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
            Version 2.0 Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            Workforce Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Reimagined.</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The all-in-one HR platform for modern enterprises. Track attendance with geofencing, manage shifts, and streamline leaves—all from one beautiful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
                href="/employee"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 dark:shadow-blue-900/20 flex items-center justify-center"
            >
                <Smartphone className="h-5 w-5 mr-2" />
                Employee App
            </Link>
            <Link 
                href="/admin"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center justify-center"
            >
                Admin Console
                <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why choose HRMS Pro?</h2>
                <p className="text-gray-500 dark:text-gray-400">Everything you need to manage your team effectively.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 dark:border-zinc-800">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Geofenced Attendance</h3>
                    <p className="text-gray-600 dark:text-gray-400">Ensure employees are on-site before they punch in. Precise GPS validation with configurable radius.</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 dark:border-zinc-800">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Rosters</h3>
                    <p className="text-gray-600 dark:text-gray-400">Manage multiple shifts easily. Assign rotational duties and track late arrivals automatically.</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 dark:border-zinc-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                        <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Enterprise Grade</h3>
                    <p className="text-gray-600 dark:text-gray-400">Multi-tenant architecture with role-based access control. Secure, scalable, and reliable.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 HRMS Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
