import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all bookings (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        barber: { select: { name: true } },
        service: { select: { name: true, price: true, duration: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
  }
}

// POST create a booking (Authenticated users)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { barberId, serviceId, bookingDate, bookingTime } = await req.json();

    if (!barberId || !serviceId || !bookingDate || !bookingTime) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        barberId,
        serviceId,
        bookingDate: new Date(bookingDate),
        bookingTime,
        status: "PENDING",
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating booking" }, { status: 500 });
  }
}
