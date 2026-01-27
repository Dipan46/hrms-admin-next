"use client";

import { useEffect, useState } from "react"; 
import { Check, X, Clock, Calendar, Loader2, Settings, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminLeavesPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Leave Types State
    const [showTypesModal, setShowTypesModal] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [newTypeName, setNewTypeName] = useState("");
    const [addingType, setAddingType] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/leave/request");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const res = await fetch("/api/leave/types");
            if (res.ok) setLeaveTypes(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    // Open modal and fetch types
    const openTypesModal = () => {
        setShowTypesModal(true);
        fetchLeaveTypes();
    };

    const handleAddType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim()) return;

        setAddingType(true);
        try {
            const res = await fetch("/api/leave/types", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTypeName })
            });

            if (res.ok) {
                setNewTypeName("");
                fetchLeaveTypes();
            }
        } catch (e) {
            alert("Failed to add leave type");
        } finally {
            setAddingType(false);
        }
    };

    const handleDeleteType = async (id: string) => {
        if (!confirm("Delete this leave type?")) return;
        try {
            const res = await fetch(`/api/leave/types/${id}`, { method: "DELETE" });
            if (res.ok) fetchLeaveTypes();
            else alert("Failed to delete. It might be in use.");
        } catch (e) {
            alert("Error deleting type");
        }
    };

    const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/leave/request/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Optimistic update or refetch
                fetchRequests();
            } else {
                alert("Failed to update status");
            }
        } catch (e) {
            alert("Error updating status");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    const pendingRequests = requests.filter(r => r.status === 'PENDING');
    const historyRequests = requests.filter(r => r.status !== 'PENDING');

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Approvals</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage employee time-off requests</p>
                </div>
                <button
                    onClick={openTypesModal}
                    className="flex items-center px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition text-gray-700 dark:text-gray-200 shadow-sm"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Leave Types
                </button>
            </div>

            {/* Pending Section */}
            <div className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    Pending Requests ({pendingRequests.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-l-4 border-l-yellow-400 border-gray-100 dark:border-zinc-800">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{req.employee.user.name}</h3>
                                    <span className="text-sm text-gray-500">{req.leaveType.name}</span>
                                </div>
                                <div className="text-right text-xs text-gray-400">
                                    Applied {format(new Date(req.createdAt), 'MMM dd')}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg mb-4 text-sm">
                                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {format(new Date(req.startDate), 'MMM dd')} - {format(new Date(req.endDate), 'MMM dd, yyyy')}
                                </div>
                                <p className="text-gray-500 italic">"{req.reason || 'No reason provided'}"</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(req.id, "REJECTED")}
                                    disabled={!!processingId}
                                    className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 transition flex items-center justify-center disabled:opacity-50"
                                >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, "APPROVED")}
                                    disabled={!!processingId}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
                                >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                    {pendingRequests.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200">
                            No pending requests! 🎉
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-gray-500">
                    History
                </h2>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Employee</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date Range</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {historyRequests.map(req => (
                                    <tr key={req.id} className="text-sm">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white align-middle">{req.employee.user.name}</td>
                                        <td className="p-4 text-gray-500 align-middle">{req.leaveType.name}</td>
                                        <td className="p-4 text-gray-500 align-middle whitespace-nowrap">
                                            {format(new Date(req.startDate), 'MMM dd')} - {format(new Date(req.endDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.status === 'APPROVED'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {historyRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Leave Types Modal */}
            {showTypesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Manage Leave Types</h2>
                            <button onClick={() => setShowTypesModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                            {leaveTypes.map(type => (
                                <div key={type.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg group">
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{type.name}</span>
                                    <button
                                        onClick={() => handleDeleteType(type.id)}
                                        className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                        title="Delete Type"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {leaveTypes.length === 0 && <p className="text-center text-gray-500 italic py-4">No leave types yet.</p>}
                        </div>

                        <form onSubmit={handleAddType} className="flex gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <input
                                className="flex-1 p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                placeholder="New Leave Type (e.g. Sick)"
                                value={newTypeName}
                                onChange={e => setNewTypeName(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={addingType}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {addingType ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
