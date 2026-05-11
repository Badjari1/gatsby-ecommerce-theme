import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { investorCreateSchema, paginationSchema } from "@/lib/validation/schemas";
import { writeAuditEvent } from "@/lib/audit/audit-service";

export async function listInvestors(searchParams: Record<string, string | string[] | undefined>) {
  const { q, page, pageSize } = paginationSchema.parse(searchParams);
  const where: Prisma.InvestorWhereInput = q
    ? { OR: [{ legalName: { contains: q, mode: "insensitive" } }, { contactEmail: { contains: q, mode: "insensitive" } }] }
    : {};
  const [items, total] = await prisma.$transaction([
    prisma.investor.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.investor.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function createInvestor(actorId: string, input: unknown) {
  const data = investorCreateSchema.parse(input);
  const investor = await prisma.investor.create({ data: { ...data, committedUsd: new Prisma.Decimal(data.committedUsd) } });
  await writeAuditEvent({ actorId, action: "investor.created", entityType: "Investor", entityId: investor.id, metadata: { contactEmail: investor.contactEmail } });
  return investor;
}
