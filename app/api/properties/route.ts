import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { createProperty, listProperties } from "@/lib/properties/property-service";

export async function GET(request: Request) {
  await requirePermission("properties:read");
  const url = new URL(request.url);
  return NextResponse.json(await listProperties(Object.fromEntries(url.searchParams)));
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("properties:write");
    const property = await createProperty(user.id, await request.json());
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 });
    throw error;
  }
}
