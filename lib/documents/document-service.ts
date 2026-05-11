import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { documentCreateSchema, paginationSchema } from "@/lib/validation/schemas";
import { writeAuditEvent } from "@/lib/audit/audit-service";

export async function listDocuments(searchParams: Record<string, string | string[] | undefined>) {
  const { q, page, pageSize } = paginationSchema.parse(searchParams);
  const where: Prisma.DocumentWhereInput = q ? { title: { contains: q, mode: "insensitive" } } : {};
  const [items, total] = await prisma.$transaction([
    prisma.document.findMany({ where, include: { property: true, uploadedBy: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.document.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function createDocument(actorId: string, input: unknown) {
  const data = documentCreateSchema.parse(input);
  const document = await prisma.document.create({ data: { ...data, uploadedById: actorId } });
  await writeAuditEvent({ actorId, action: "document.created", entityType: "Document", entityId: document.id, metadata: { classification: document.classification } });
  return document;
}
