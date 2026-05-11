import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { createInvestor, listInvestors } from "@/lib/investors/investor-service";

export async function GET(request: Request) {
  await requirePermission("investors:read");
  const url = new URL(request.url);
  return NextResponse.json(await listInvestors(Object.fromEntries(url.searchParams)));
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("investors:write");
    const investor = await createInvestor(user.id, await request.json());
    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 });
    throw error;
  }
}
