import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, photo, specialty } = await req.json();

    const barber = await prisma.barber.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(photo !== undefined && { photo }),
        ...(specialty !== undefined && { specialty }),
      }
    });

    return NextResponse.json(barber);
  } catch (error) {
    return NextResponse.json({ message: "Error updating barber" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.barber.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Barber deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting barber" }, { status: 500 });
  }
}
