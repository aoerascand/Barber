import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DEFAULT_SERVICE_CATEGORY } from "@/lib/serviceCategories";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, price, duration, category } = await req.json();

    if (!name || price === undefined || duration === undefined) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        category: category || DEFAULT_SERVICE_CATEGORY,
        price: parseInt(price),
        duration: parseInt(duration),
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating service" }, { status: 500 });
  }
}
