import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { shareholderCreateSchema, paginationSchema } from "@/lib/validation/schemas";
import { writeAuditEvent } from "@/lib/audit/audit-service";

export async function listShareholders(searchParams: Record<string, string | string[] | undefined>) {
  const { q, page, pageSize } = paginationSchema.parse(searchParams);
  const where: Prisma.ShareholderWhereInput = q
    ? { OR: [{ legalName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
    : {};
  const [items, total] = await prisma.$transaction([
    prisma.shareholder.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.shareholder.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function createShareholder(actorId: string, input: unknown) {
  const data = shareholderCreateSchema.parse(input);
  const shareholder = await prisma.shareholder.create({ data: { ...data, shares: new Prisma.Decimal(data.shares) } });
  await writeAuditEvent({ actorId, action: "shareholder.created", entityType: "Shareholder", entityId: shareholder.id, metadata: { email: shareholder.email } });
  return shareholder;
}
