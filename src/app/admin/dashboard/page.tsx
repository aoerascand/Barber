import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Users, CalendarCheck, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Fetch some real stats from the database (fallback to 0 if none)
  const totalBarbers = await prisma.barber.count();
  const totalServices = await prisma.service.count();
  const totalBookings = await prisma.booking.count();
  const pendingBookings = await prisma.booking.count({ where: { status: "PENDING" } });

  const stats = [
    { title: "Total Bookings", value: totalBookings.toString(), icon: <CalendarCheck className="w-4 h-4 text-zinc-400" /> },
    { title: "Pending Approvals", value: pendingBookings.toString(), icon: <TrendingUp className="w-4 h-4 text-amber-500" /> },
    { title: "Active Barbers", value: totalBarbers.toString(), icon: <Users className="w-4 h-4 text-zinc-400" /> },
    { title: "Services Offered", value: totalServices.toString(), icon: <Scissors className="w-4 h-4 text-zinc-400" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome to the CDTBarber administration panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Placeholder for future charts/recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-300 border-zinc-800 h-64 flex flex-col items-center justify-center">
          <p className="text-zinc-500">Revenue Chart Coming Soon</p>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 h-64 flex flex-col items-center justify-center">
          <p className="text-zinc-500">Recent Activity Feed Coming Soon</p>
        </Card>
      </div>
    </div>
  );
}
