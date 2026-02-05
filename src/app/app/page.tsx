import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AppRoot() {
  const user = await getSessionUser();
  if (!user?.email) redirect("/auth/signin");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { memberships: true },
  });

  if (!dbUser) redirect("/auth/signin");

  if (dbUser.memberships.length === 0) {
    redirect("/app/onboarding");
  }

  redirect("/app/dashboard");
}
