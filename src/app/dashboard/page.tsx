import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, LayoutDashboard, Scissors, User } from "lucide-react";
import { format } from "date-fns";
import { SignOutButton } from "@/components/sign-out-button";

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">Pending</span>;
    case "APPROVED":
      return <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">Approved</span>;
    case "CANCELLED":
      return <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">Cancelled</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">Completed</span>;
    default:
      return <span className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">Unknown</span>;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    redirect("/login");
  }

  if ((session.user as any)?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const userId = (session.user as any).id as string;

  const [totalBookings, pendingBookings, upcomingBookings, completedBookings, bookings] = await Promise.all([
    prisma.booking.count({ where: { userId } }),
    prisma.booking.count({ where: { userId, status: "PENDING" } }),
    prisma.booking.count({ where: { userId, bookingDate: { gte: new Date() }, status: { in: ["PENDING", "APPROVED"] } } }),
    prisma.booking.count({ where: { userId, status: "COMPLETED" } }),
    prisma.booking.findMany({
      where: { userId },
      include: {
        barber: { select: { name: true } },
        service: { select: { name: true, price: true, duration: true } },
      },
      orderBy: { bookingDate: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user?.name || "Guest"}</h1>
            <p className="text-zinc-400 mt-2">Disini tempat kamu booking and upcoming appointments.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/booking">
              <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-400">Book New Appointment</Button>
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Total Bookings", value: totalBookings, icon: <LayoutDashboard className="w-4 h-4 text-zinc-400" /> },
            { title: "Pending Approval", value: pendingBookings, icon: <Clock className="w-4 h-4 text-amber-500" /> },
            { title: "Upcoming", value: upcomingBookings, icon: <CalendarCheck className="w-4 h-4 text-green-400" /> },
            { title: "Completed", value: completedBookings, icon: <Scissors className="w-4 h-4 text-blue-400" /> },
          ].map((item) => (
            <Card key={item.title} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm text-zinc-400 font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                    <p className="text-zinc-400 text-sm">Your latest appointment requests and status updates.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                    No bookings yet. Start by scheduling your first appointment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{booking.service.name}</h3>
                            <p className="text-zinc-400 text-sm">with {booking.barber.name}</p>
                          </div>
                          <div className="text-right text-sm text-zinc-400">
                            {format(new Date(booking.bookingDate), "MMM dd, yyyy")} · {booking.bookingTime}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                          <span>{booking.service.duration} min</span>
                          <span>Rp {booking.service.price.toLocaleString("id-ID")}</span>
                          {statusBadge(booking.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
                
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-zinc-400">
              <p>Book your next session anytime and keep track of approval status right from your dashboard.</p>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <User className="w-4 h-4" />
                  Make sure your contact details are up to date.
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <CalendarCheck className="w-4 h-4" />
                  Admin will approve your booking within 24 hours.
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Scissors className="w-4 h-4" />
                  Need a different time? Cancel and rebook with ease.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
