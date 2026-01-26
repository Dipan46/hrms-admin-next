import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { Building2, Users, CalendarCheck, Clock } from "lucide-react";

async function getStats(session: any) {
  const whereClient: any = {};
  const whereEmployee: any = { role: "EMPLOYEE" };

  if (session?.user?.role === "CLIENT_ADMIN") {
      whereClient.id = session.user.clientId;
      whereEmployee.clientId = session.user.clientId;
  }

  const totalClients = await prisma.client.count({ where: whereClient });
  const totalEmployees = await prisma.user.count({ where: whereEmployee });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // For attendance, we need to filter by employees belonging to this client
  const attendanceWhere: any = {
      date: today,
      status: "PRESENT"
  };
  
  if (session?.user?.role === "CLIENT_ADMIN") {
      attendanceWhere.employee = {
          user: {
              clientId: session.user.clientId
          }
      };
  }

  const presentToday = await prisma.attendanceLog.count({
    where: attendanceWhere
  });

  return { totalClients, totalEmployees, presentToday };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats(session);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-blue-600">{session?.user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's what's happening with your workforce today.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalClients}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
            </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employees</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalEmployees}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
            </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Present Today</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.presentToday}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <CalendarCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-sm text-center py-8">
            No recent activity data available.
        </div>
      </div>
    </div>
  );
}
