"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Search, Loader2, Trash2, Pencil } from "lucide-react";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        clientId: "",
        branchId: "",
        shiftId: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, clientRes, branchRes, shiftRes] = await Promise.all([
                fetch("/api/admin/employees"),
                fetch("/api/admin/clients"),
                fetch("/api/admin/branches"),
                fetch("/api/admin/shifts")
            ]);

            if (empRes.ok) setEmployees(await empRes.json());
            if (clientRes.ok) setClients(await clientRes.json());
            if (branchRes.ok) setBranches(await branchRes.json());
            if (shiftRes.ok) setShifts(await shiftRes.json());

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
            const url = editingId ? `/api/admin/employees/${editingId}` : "/api/admin/employees";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                setEditingId(null);
                setFormData({ name: "", email: "", password: "", clientId: "", branchId: "", shiftId: "" });
                fetchData();
            } else {
                alert("Failed to save employee");
            }
        } catch (e) {
            alert("Error saving employee");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (emp: any) => {
        setEditingId(emp.id);
        setFormData({
            name: emp.name,
            email: emp.email,
            password: "", // Optional, leave blank to keep same
            clientId: emp.clientId || "",
            branchId: emp.employeeProfile?.branchId || "",
            shiftId: emp.employeeProfile?.shiftId || ""
        });
        setShowModal(true);
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage workforce and credentials</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Employee
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Client</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Branch</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Shift</th>
                                <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                    <td className="p-4 align-middle">
                                        <div className="font-medium text-gray-900 dark:text-white">{emp.name}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 align-middle">{emp.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs dark:bg-blue-900/20 dark:text-blue-400">
                                            {emp.client?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 align-middle">
                                        {emp.employeeProfile?.branch?.name || "-"}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 align-middle">
                                        {emp.employeeProfile?.shift?.name || "-"}
                                    </td>
                                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(emp)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm("Are you sure?")) return;
                                                await fetch(`/api/admin/employees/${emp.id}`, { method: "DELETE" });
                                                fetchData();
                                            }}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {employees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No employees found.</div>
                )}
            </div>

            {/* Simple Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{editingId ? "Edit Employee" : "Add New Employee"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
                                    <input
                                        required
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (Username)</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                                    Password {editingId && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                                </label>
                                <input
                                    required={!editingId}
                                    type="password"
                                    placeholder={editingId ? "Enter new password to change" : ""}
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Client</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.clientId}
                                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                                >
                                    <option value="">Select Client</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Branch</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.branchId}
                                        onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                                    >
                                        <option value="">Select Branch</option>
                                        {/* Filter branches by client if client selected, else show all */}
                                        {branches
                                            .filter(b => !formData.clientId || b.clientId === formData.clientId)
                                            .map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Shift</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.shiftId}
                                        onChange={e => setFormData({ ...formData, shiftId: e.target.value })}
                                    >
                                        <option value="">Select Shift</option>
                                        {shifts
                                            .filter(s => !formData.clientId || s.clientId === formData.clientId)
                                            .map(s => <option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</option>)
                                        }
                                    </select>
                                </div>
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
                                    {submitting ? "Saving..." : (editingId ? "Update Employee" : "Create Employee")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
