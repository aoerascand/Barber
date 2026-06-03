import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json(barbers);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching barbers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, photo, specialty } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const barber = await prisma.barber.create({
      data: {
        name,
        photo: photo || null,
        specialty: specialty || null,
      }
    });

    return NextResponse.json(barber, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating barber" }, { status: 500 });
  }
}
