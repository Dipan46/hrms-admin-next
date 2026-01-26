"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function EmployeeLeavePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, typeRes] = await Promise.all([
          fetch("/api/leave/request"),
          fetch("/api/leave/types")
      ]);

      if (reqRes.ok) setRequests(await reqRes.json());
      if (typeRes.ok) setLeaveTypes(await typeRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        const res = await fetch("/api/leave/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        if (res.ok) {
            setShowModal(false);
            setFormData({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
            fetchData();
        } else {
            alert("Failed to submit request");
        }
    } catch(e) {
        alert("Error submitting request");
    } finally {
        setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
};

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaves</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your time off</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Plus className="h-5 w-5 mr-1" />
          Apply
        </button>
      </div>

      <div className="space-y-4">
        {requests.length > 0 ? (
            requests.map(req => (
                <div key={req.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{req.leaveType.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                            </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                            {req.status}
                        </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-3 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                            {format(new Date(req.startDate), 'MMM dd')} - {format(new Date(req.endDate), 'MMM dd, yyyy')}
                        </span>
                    </div>

                    {req.reason && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                            "{req.reason}"
                        </p>
                    )}
                </div>
            ))
        ) : (
            <div className="text-center py-10">
                <div className="inline-flex bg-gray-100 dark:bg-zinc-900 p-4 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No leave requests found.</p>
            </div>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-xl w-full max-w-md p-6 animate-slide-up sm:animate-none">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Apply for Leave</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Leave Type</label>
                        <select 
                            required
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg dark:text-white"
                            value={formData.leaveTypeId}
                            onChange={e => setFormData({...formData, leaveTypeId: e.target.value})}
                        >
                            <option value="">Select Type</option>
                            {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">From</label>
                            <input 
                                required
                                type="date"
                                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg dark:text-white"
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">To</label>
                            <input 
                                required
                                type="date"
                                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg dark:text-white"
                                value={formData.endDate}
                                onChange={e => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Reason</label>
                        <textarea 
                            required
                            rows={3}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg dark:text-white"
                            value={formData.reason}
                            onChange={e => setFormData({...formData, reason: e.target.value})}
                            placeholder="Why do you need leave?"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-xl font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Apply Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
