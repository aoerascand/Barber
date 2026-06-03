"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

type Booking = {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  user: { name: string; email: string };
  barber: { name: string };
  service: { name: string; price: number; duration: number };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20"><Clock className="w-3 h-3" /> Pending</span>;
      case "APPROVED":
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Booking Approvals</h1>
        <p className="text-zinc-400 mt-1">Manage incoming booking requests from clients.</p>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-800">Date & Time</TableHead>
              <TableHead className="text-zinc-800">Client</TableHead>
              <TableHead className="text-zinc-800">Service & Barber</TableHead>
              <TableHead className="text-zinc-800">Status</TableHead>
              <TableHead className="text-zinc-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading bookings...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No bookings found.</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="border-zinc-500 hover:bg-zinc-500/50">
                  <TableCell>
                    <div className="font-medium text-zinc-800">{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</div>
                    <div className="text-zinc-600 text-sm">{booking.bookingTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-800">{booking.user.name}</div>
                    <div className="text-zinc-600 text-sm">{booking.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-800">{booking.service.name}</div>
                    <div className="text-zinc-600 text-sm">with {booking.barber.name}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateStatus(booking.id, "CANCELLED")} 
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => updateStatus(booking.id, "APPROVED")} 
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                    {booking.status === "APPROVED" && (
                      <Button 
                        size="sm"
                        onClick={() => updateStatus(booking.id, "COMPLETED")} 
                        className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border border-blue-500/30"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
