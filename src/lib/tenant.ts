import { prisma } from "@/lib/prisma";

export async function getUserActiveTenant(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      memberships: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!user || user.memberships.length === 0) {
    return null;
  }

  // MVP: first tenant = active tenant
  return user.memberships[0].tenant;
}
