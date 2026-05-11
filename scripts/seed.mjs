import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const password = process.env.SEED_ADMIN_PASSWORD;
if (!password || password.length < 16) {
  throw new Error("Set SEED_ADMIN_PASSWORD to a unique value with at least 16 characters before seeding.");
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@synergyinvest.example" },
    update: { roles: ["SUPER_ADMIN"], isActive: true },
    create: {
      email: "admin@synergyinvest.example",
      name: "SynergyInvest Administrator",
      passwordHash: await bcrypt.hash(password, 12),
      roles: ["SUPER_ADMIN"],
    },
  });

  const property = await prisma.property.upsert({
    where: { code: "HARBOR-POINT" },
    update: {},
    create: {
      name: "Harbor Point Logistics Center",
      code: "HARBOR-POINT",
      addressLine1: "200 Harbor Point Drive",
      city: "Baltimore",
      region: "Maryland",
      country: "United States",
      status: "OPERATING",
      acquisitionUsd: new Prisma.Decimal("42000000.00"),
      acquiredAt: new Date("2025-09-15T00:00:00.000Z"),
    },
  });

  await prisma.shareholder.upsert({
    where: { email: "apex.holdings@example.com" },
    update: {},
    create: {
      legalName: "Apex Holdings LLC",
      email: "apex.holdings@example.com",
      country: "United States",
      shareClass: "PREFERRED_A",
      shares: new Prisma.Decimal("125000.0000"),
      joinedAt: new Date("2024-04-01T00:00:00.000Z"),
    },
  });

  await prisma.investor.upsert({
    where: { contactEmail: "capital@northstar.example" },
    update: {},
    create: {
      legalName: "Northstar Capital Partners",
      contactEmail: "capital@northstar.example",
      status: "ACTIVE",
      committedUsd: new Prisma.Decimal("25000000.00"),
      onboardedAt: new Date("2025-01-20T00:00:00.000Z"),
    },
  });

  await prisma.document.upsert({
    where: { storageKey: "seed/harbor-point-appraisal.pdf" },
    update: {},
    create: {
      title: "Harbor Point Appraisal",
      description: "Seeded appraisal metadata for local development.",
      classification: "CONFIDENTIAL",
      status: "ACTIVE",
      storageKey: "seed/harbor-point-appraisal.pdf",
      checksumSha256: "0".repeat(64),
      mimeType: "application/pdf",
      sizeBytes: 524288,
      propertyId: property.id,
      uploadedById: admin.id,
    },
  });

  await prisma.auditEvent.create({
    data: {
      actorId: admin.id,
      action: "development.seeded",
      entityType: "System",
      metadata: { propertyCode: property.code },
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
