import { getServerSession } from "next-auth";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth/options";
import { assertPermission, type Permission } from "@/lib/auth/permissions";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  assertPermission(user.roles as Role[], permission);
  return user;
}
