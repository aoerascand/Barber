import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update booking status (Admin only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // cek admin
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await req.json();

    // validasi status
    const validStatus = [
      "PENDING",
      "APPROVED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!validStatus.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    // update booking
    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error updating booking" },
      { status: 500 }
    );
  }
}