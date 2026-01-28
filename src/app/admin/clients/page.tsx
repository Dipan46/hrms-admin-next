"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, MapPin, Loader2, Trash2, Pencil } from "lucide-react";

type Client = {
  id: string;
  name: string;
  code: string;
  address: string | null;
  _count: {
    branches: number;
    users: number;
  };
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: "", code: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/admin/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
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
      const url = editingId ? `/api/admin/clients/${editingId}` : "/api/admin/clients";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: "", code: "", address: "" });
        setShowModal(false);
        setEditingId(null);
        fetchClients();
      } else {
        alert("Failed to save client");
      }
    } catch (e) {
      alert("Error saving client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client: any) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      code: client.code,
      address: client.address || ""
    });
    setShowModal(true);
  };

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage legal entities and organizations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                {client.code}
              </span>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(client);
                }}
                className="items-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                title="Edit Client"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("This will delete the client and all associated data. Are you sure?")) return;
                  await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
                  fetchClients();
                }}
                className="items-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                title="Delete Client"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{client.name}</h3>

            {client.address && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {client.address}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                <b>{client._count.branches}</b> Branches
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                <b>{client._count.users}</b> Employees
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{editingId ? "Edit Client" : "Add New Client"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Client Name</label>
                <input
                  required
                  className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Client Code</label>
                <input
                  required
                  className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" // Code might work better as readonly during edit if unique constraint is tricky, but kept editable for now
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ACME"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Address</label>
                <textarea
                  className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Headquarters Address"
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
                  {submitting ? "Saving..." : (editingId ? "Update Client" : "Create Client")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
