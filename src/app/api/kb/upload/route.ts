import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserActiveTenant } from "@/lib/tenant";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenant = await getUserActiveTenant(session.user.email);
  if (!tenant) {
    return NextResponse.json({ error: "No workspace found" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads", tenant.id);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  await fs.writeFile(filePath, buffer);

  const doc = await prisma.knowledgeBaseDocument.create({
    data: {
      tenantId: tenant.id,
      title: file.name,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      sizeBytes: buffer.length,
      status: "UPLOADED",
    },
  });

  return NextResponse.json({ document: doc });
}
