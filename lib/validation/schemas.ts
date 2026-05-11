import { z } from "zod";

const money = z.coerce.number().nonnegative().max(999_999_999_999);
const shares = z.coerce.number().positive().max(999_999_999_999);

export const paginationSchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const shareholderCreateSchema = z.object({
  legalName: z.string().trim().min(2).max(180),
  email: z.string().email().max(180).transform((value) => value.toLowerCase()),
  taxIdentifier: z.string().trim().max(80).optional(),
  country: z.string().trim().min(2).max(80),
  shareClass: z.enum(["COMMON", "PREFERRED_A", "PREFERRED_B"]),
  shares,
  joinedAt: z.coerce.date(),
});

export const investorCreateSchema = z.object({
  legalName: z.string().trim().min(2).max(180),
  contactEmail: z.string().email().max(180).transform((value) => value.toLowerCase()),
  status: z.enum(["PROSPECT", "ACTIVE", "SUSPENDED", "EXITED"]).default("PROSPECT"),
  committedUsd: money,
  onboardedAt: z.coerce.date().optional(),
});

export const propertyCreateSchema = z.object({
  name: z.string().trim().min(2).max(180),
  code: z.string().trim().min(2).max(32).regex(/^[A-Z0-9-]+$/),
  addressLine1: z.string().trim().min(3).max(220),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(80),
  status: z.enum(["DUE_DILIGENCE", "ACQUIRED", "OPERATING", "DISPOSED"]).default("DUE_DILIGENCE"),
  acquisitionUsd: money,
  acquiredAt: z.coerce.date().optional(),
});

export const documentCreateSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(1000).optional(),
  classification: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "BOARD_ONLY", "SHAREHOLDER_ONLY"]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  storageKey: z.string().trim().min(8).max(260),
  checksumSha256: z.string().regex(/^[a-f0-9]{64}$/),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.coerce.number().int().positive().max(100 * 1024 * 1024),
  propertyId: z.string().cuid().optional(),
});
