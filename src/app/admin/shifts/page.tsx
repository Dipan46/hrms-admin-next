"use client";

import { useEffect, useState } from "react";
import { Plus, Clock, Loader2, Trash2, Pencil } from "lucide-react";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      name: "",
      startTime: "09:00",
      endTime: "18:00",
      clientId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shiftRes, clientRes] = await Promise.all([
          fetch("/api/admin/shifts"),
          fetch("/api/admin/clients")
      ]);

      if (shiftRes.ok) setShifts(await shiftRes.json());
      if (clientRes.ok) setClients(await clientRes.json());
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
        const url = editingId ? `/api/admin/shifts/${editingId}` : "/api/admin/shifts";
        const method = editingId ? "PATCH" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        if (res.ok) {
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: "", startTime: "09:00", endTime: "18:00", clientId: "" });
            fetchData();
        } else {
            alert("Failed to save shift");
        }
    } catch(e) {
        alert("Error saving shift");
    } finally {
        setSubmitting(false);
    }
  };

  const handleEdit = (shift: any) => {
      setEditingId(shift.id);
      setFormData({
          name: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          clientId: shift.clientId
      });
      setShowModal(true);
  };

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shift Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Define work timings and rosters</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Shift
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shifts.map((shift) => (
          <div key={shift.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                {shift.client?.name}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{shift.name}</h3>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                 <span className="font-mono">{shift.startTime}</span>
                 <span className="mx-2">-</span>
                 <span className="font-mono">{shift.endTime}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 text-sm text-gray-500">
                <span>Standard work hours</span>
                <div className="flex gap-2 -mr-2">
                    <button
                        onClick={() => handleEdit(shift)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={async () => {
                            if(!confirm("Are you sure?")) return;
                            await fetch(`/api/admin/shifts/${shift.id}`, { method: "DELETE" });
                            fetchData();
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Shift</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Shift Name</label>
                        <input 
                            required
                            className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Night Shift"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Client</label>
                        <select 
                            required
                            className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={formData.clientId}
                            onChange={e => setFormData({...formData, clientId: e.target.value})}
                        >
                            <option value="">Select Client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Time</label>
                            <input 
                                required
                                type="time"
                                className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Time</label>
                            <input 
                                required
                                type="time"
                                className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.endTime}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
                            />
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
                            {submitting ? "Create Shift" : "Create Shift"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
