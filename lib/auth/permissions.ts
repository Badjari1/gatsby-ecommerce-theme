import type { Role } from "@prisma/client";

export type Permission =
  | "dashboard:read"
  | "shareholders:read"
  | "shareholders:write"
  | "investors:read"
  | "investors:write"
  | "properties:read"
  | "properties:write"
  | "documents:read"
  | "documents:write"
  | "audit:read";

const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard:read",
    "shareholders:read",
    "shareholders:write",
    "investors:read",
    "investors:write",
    "properties:read",
    "properties:write",
    "documents:read",
    "documents:write",
    "audit:read",
  ],
  BOARD_MEMBER: ["dashboard:read", "shareholders:read", "investors:read", "properties:read", "documents:read", "audit:read"],
  COMPLIANCE_OFFICER: ["dashboard:read", "shareholders:read", "investors:read", "documents:read", "documents:write", "audit:read"],
  INVESTOR_RELATIONS: ["dashboard:read", "shareholders:read", "shareholders:write", "investors:read", "investors:write", "documents:read"],
  PROPERTY_MANAGER: ["dashboard:read", "properties:read", "properties:write", "documents:read", "documents:write"],
  SHAREHOLDER: ["dashboard:read", "documents:read"],
  INVESTOR: ["dashboard:read", "documents:read"],
  AUDITOR: ["dashboard:read", "shareholders:read", "investors:read", "properties:read", "documents:read", "audit:read"],
};

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => rolePermissions[role]?.includes(permission));
}

export function assertPermission(roles: Role[], permission: Permission): void {
  if (!hasPermission(roles, permission)) {
    throw new Error(`Forbidden: missing ${permission}`);
  }
}
