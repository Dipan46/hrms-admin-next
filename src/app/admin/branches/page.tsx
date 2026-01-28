"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin, Loader2, Navigation, Trash2, Pencil } from "lucide-react";

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        radius: "100"
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch("/api/admin/branches");
            if (res.ok) {
                setBranches(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingId ? `/api/admin/branches/${editingId}` : "/api/admin/branches";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                setEditingId(null);
                setFormData({ name: "", latitude: "", longitude: "", radius: "100" });
                fetchBranches();
            } else {
                alert("Failed to save branch");
            }
        } catch (e) {
            alert("Error saving branch");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (branch: any) => {
        setEditingId(branch.id);
        setFormData({
            name: branch.name,
            latitude: branch.latitude || "",
            longitude: branch.longitude || "",
            radius: branch.radius || "100"
        });
        setShowModal(true);
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage office locations and geofences</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Branch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(branch)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!confirm("Are you sure?")) return;
                                        await fetch(`/api/admin/branches/${branch.id}`, { method: "DELETE" });
                                        fetchBranches();
                                    }}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{branch.name}</h3>
                        {branch.client && (
                            <span className="inline-block mb-2 text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                {branch.client.name}
                            </span>
                        )}

                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <Navigation className="h-4 w-4 mr-2" />
                                {branch.latitude && branch.longitude ? (
                                    <span>{branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}</span>
                                ) : (
                                    <span className="italic">No coordinates set</span>
                                )}
                            </div>
                            {branch.radius && (
                                <div className="flex items-center pl-6">
                                    <span>Radius: {branch.radius}m</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {branches.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                        No branches found. Create your first office location!
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{editingId ? "Edit Branch" : "Add New Branch"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Branch Name</label>
                                <input
                                    required
                                    placeholder="e.g. New York HQ"
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="40.7128"
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="-74.0060"
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Geofence Radius (meters)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.radius}
                                    onChange={e => setFormData({ ...formData, radius: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : (editingId ? "Update Branch" : "Create Branch")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
