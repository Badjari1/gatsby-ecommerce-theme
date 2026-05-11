CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'BOARD_MEMBER', 'COMPLIANCE_OFFICER', 'INVESTOR_RELATIONS', 'PROPERTY_MANAGER', 'SHAREHOLDER', 'INVESTOR', 'AUDITOR');
CREATE TYPE "DocumentClassification" AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'BOARD_ONLY', 'SHAREHOLDER_ONLY');
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "InvestorStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'SUSPENDED', 'EXITED');
CREATE TYPE "PropertyStatus" AS ENUM ('DUE_DILIGENCE', 'ACQUIRED', 'OPERATING', 'DISPOSED');
CREATE TYPE "ShareClass" AS ENUM ('COMMON', 'PREFERRED_A', 'PREFERRED_B');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Shareholder" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "legalName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "taxIdentifier" TEXT,
  "country" TEXT NOT NULL,
  "shareClass" "ShareClass" NOT NULL,
  "shares" DECIMAL(18,4) NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Shareholder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Shareholding" (
  "id" TEXT NOT NULL,
  "shareholderId" TEXT NOT NULL,
  "certificateNo" TEXT NOT NULL,
  "shareClass" "ShareClass" NOT NULL,
  "shares" DECIMAL(18,4) NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Shareholding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Investor" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "legalName" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "status" "InvestorStatus" NOT NULL DEFAULT 'PROSPECT',
  "committedUsd" DECIMAL(18,2) NOT NULL,
  "onboardedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Property" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "status" "PropertyStatus" NOT NULL DEFAULT 'DUE_DILIGENCE',
  "acquisitionUsd" DECIMAL(18,2) NOT NULL,
  "acquiredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Document" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "classification" "DocumentClassification" NOT NULL,
  "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
  "storageKey" TEXT NOT NULL,
  "checksumSha256" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "propertyId" TEXT,
  "uploadedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditEvent" (
  "id" TEXT NOT NULL,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE UNIQUE INDEX "Shareholder_userId_key" ON "Shareholder"("userId");
CREATE UNIQUE INDEX "Shareholder_email_key" ON "Shareholder"("email");
CREATE INDEX "Shareholder_legalName_idx" ON "Shareholder"("legalName");
CREATE INDEX "Shareholder_shareClass_idx" ON "Shareholder"("shareClass");
CREATE UNIQUE INDEX "Shareholding_certificateNo_key" ON "Shareholding"("certificateNo");
CREATE INDEX "Shareholding_shareholderId_idx" ON "Shareholding"("shareholderId");
CREATE UNIQUE INDEX "Investor_userId_key" ON "Investor"("userId");
CREATE UNIQUE INDEX "Investor_contactEmail_key" ON "Investor"("contactEmail");
CREATE INDEX "Investor_legalName_idx" ON "Investor"("legalName");
CREATE INDEX "Investor_status_idx" ON "Investor"("status");
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");
CREATE INDEX "Property_name_idx" ON "Property"("name");
CREATE INDEX "Property_status_idx" ON "Property"("status");
CREATE UNIQUE INDEX "Document_storageKey_key" ON "Document"("storageKey");
CREATE INDEX "Document_classification_idx" ON "Document"("classification");
CREATE INDEX "Document_status_idx" ON "Document"("status");
CREATE INDEX "Document_propertyId_idx" ON "Document"("propertyId");
CREATE INDEX "AuditEvent_actorId_idx" ON "AuditEvent"("actorId");
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

ALTER TABLE "Shareholder" ADD CONSTRAINT "Shareholder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Shareholding" ADD CONSTRAINT "Shareholding_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
