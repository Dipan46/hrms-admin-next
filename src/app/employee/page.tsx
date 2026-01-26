"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2, MapPin, Camera, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [punchedIn, setPunchedIn] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [lastLog, setLastLog] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
    getLocation();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/attendance/punch");
      if (res.ok) {
        const data = await res.json();
        setPunchedIn(data.punchedIn);
        setLastLog(data.lastLog);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError("");
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location services.");
      }
    );
  };

  const handlePunch = async (action: "IN" | "OUT") => {
    if (!location) {
        setError("Waiting for location...");
        getLocation();
        return;
    }
    
    setPunching(true);
    setError("");
    setStatusMessage("");

    try {
        const res = await fetch("/api/attendance/punch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                latitude: location.lat,
                longitude: location.lng,
                locationType: "OFFICE", // Default for now, should be selectable
                image: "placeholder_base64", // TODO: Add Camera logic
                action
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Punch failed");
        } else {
            setStatusMessage(data.message);
            fetchStatus(); // Refresh status
        }
    } catch (e) {
        setError("Network error");
    } finally {
        setPunching(false);
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    );
  }

  // Check if user is an Admin (no employeeId)
  if (session?.user && !session.user.employeeId) {
     // Allow admins to view for demo purposes, but warn them
     // Or we could auto-create a dummy profile? 
     // For now, let's just show a specific Admin View of the Employee App
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-zinc-950">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
          <Camera className="h-8 w-8 text-blue-600 dark:text-blue-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Employee View Preview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
          You are logged in as <b>Admin</b>. You can explore the interface, but you cannot mark attendance without an Employee Profile.
        </p>
        <div className="flex gap-4">
             <button
              onClick={() => router.push("/admin")}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to Admin Console
            </button>
             <button
              onClick={() => router.push("/api/auth/signout")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sign Out
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hi, {session?.user?.name?.split(" ")[0]} 👋</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>
            <button onClick={() => router.push('/api/auth/signout')} className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-full">
                <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
            </button>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 mb-6 text-center">
            <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-colors ${
                punchedIn ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            }`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    punchedIn ? "bg-green-500 shadow-green-200" : "bg-red-500 shadow-red-200"
                } shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                        {punchedIn ? "Present" : "Absent"}
                    </span>
                </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium">
                {punchedIn 
                    ? `Punched In at ${lastLog ? new Date(lastLog.inTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}` 
                    : "You have not punched in yet"}
            </p>

            {/* Error / Success Messages */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {statusMessage && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg text-sm">
                    {statusMessage}
                </div>
            )}
        </div>

        {/* Action Button */}
        <div className="mb-6">
            {!punchedIn ? (
                <button
                    onClick={() => handlePunch("IN")}
                    disabled={punching || !location}
                    className="w-full py-4 bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {punching ? <Loader2 className="animate-spin" /> : <Camera className="h-6 w-6" />}
                    <span>Swipe to Punch In</span>
                </button>
            ) : (
                <button
                    onClick={() => handlePunch("OUT")}
                    disabled={punching || !location}
                    className="w-full py-4 bg-red-600 active:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {punching ? <Loader2 className="animate-spin" /> : <LogOut className="h-6 w-6" />}
                    <span>Punch Out</span>
                </button>
            )}
        </div>

        {/* Location Debug */}
        <div className="text-center">
            <div className="inline-flex items-center text-xs text-gray-400 bg-gray-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3 mr-1" />
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring location..."}
            </div>
        </div>
    </div>
  );
}
