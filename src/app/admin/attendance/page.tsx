"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, FileDown } from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/attendance");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!logs.length) return;

    const headers = ["Employee", "Branch", "Date", "In Time", "Out Time", "Status", "Location"];
    const rows = logs.map(log => [
        log.employeeName,
        log.branchName || '-',
        format(new Date(log.date), 'yyyy-MM-dd'),
        log.inTime ? format(new Date(log.inTime), 'HH:mm:ss') : '-',
        log.outTime ? format(new Date(log.outTime), 'HH:mm:ss') : '-',
        log.status,
        log.locationType
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PRESENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
          case 'ABSENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
          case 'LATE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
          default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Report</h1>
          <p className="text-gray-500 dark:text-gray-400">Daily punch records and logs</p>
        </div>
        <button 
            onClick={handleExport}
            disabled={loading || logs.length === 0}
            className="flex items-center px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition disabled:opacity-50"
        >
          <FileDown className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Employee</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">In Time</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Out Time</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Location</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {logs.length > 0 ? (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                    <td className="p-4 text-left align-middle">
                                        <div className="font-medium text-gray-900 dark:text-white">{log.employeeName}</div>
                                        <div className="text-xs text-gray-500">{log.branchName}</div>
                                    </td>
                                    <td className="p-4 text-left align-middle text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {format(new Date(log.date), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td className="p-4 text-left align-middle font-mono text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        {log.inTime ? format(new Date(log.inTime), 'hh:mm a') : '-'}
                                    </td>
                                    <td className="p-4 text-left align-middle font-mono text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        {log.outTime ? format(new Date(log.outTime), 'hh:mm a') : '-'}
                                    </td>
                                    <td className="p-4 text-left align-middle text-gray-600 dark:text-gray-400 text-sm">
                                        {log.locationType}
                                    </td>
                                    <td className="p-4 text-left align-middle">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
