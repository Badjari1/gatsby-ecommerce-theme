import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { propertyCreateSchema, paginationSchema } from "@/lib/validation/schemas";
import { writeAuditEvent } from "@/lib/audit/audit-service";

export async function listProperties(searchParams: Record<string, string | string[] | undefined>) {
  const { q, page, pageSize } = paginationSchema.parse(searchParams);
  const where: Prisma.PropertyWhereInput = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] }
    : {};
  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.property.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function createProperty(actorId: string, input: unknown) {
  const data = propertyCreateSchema.parse(input);
  const property = await prisma.property.create({ data: { ...data, acquisitionUsd: new Prisma.Decimal(data.acquisitionUsd) } });
  await writeAuditEvent({ actorId, action: "property.created", entityType: "Property", entityId: property.id, metadata: { code: property.code } });
  return property;
}
