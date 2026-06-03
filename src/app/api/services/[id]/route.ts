import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DEFAULT_SERVICE_CATEGORY } from "@/lib/serviceCategories";

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
    const { name, price, duration, category } = await req.json();

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category !== undefined && { category: category || DEFAULT_SERVICE_CATEGORY }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ message: "Error updating service" }, { status: 500 });
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

    await prisma.service.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting service" }, { status: 500 });
  }
}
