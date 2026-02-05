import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug } = await req.json();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug required" },
      { status: 400 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      createdById: dbUser.id,
      memberships: {
        create: {
          userId: dbUser.id,
          role: "TENANT_ADMIN",
        },
      },
    },
  });

  return NextResponse.json(tenant);
}
