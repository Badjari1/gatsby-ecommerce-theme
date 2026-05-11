import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { createShareholder, listShareholders } from "@/lib/shareholders/shareholder-service";

export async function GET(request: Request) {
  await requirePermission("shareholders:read");
  const url = new URL(request.url);
  return NextResponse.json(await listShareholders(Object.fromEntries(url.searchParams)));
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("shareholders:write");
    const shareholder = await createShareholder(user.id, await request.json());
    return NextResponse.json(shareholder, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 });
    throw error;
  }
}
