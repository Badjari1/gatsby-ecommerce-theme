import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { createDocument, listDocuments } from "@/lib/documents/document-service";

export async function GET(request: Request) {
  await requirePermission("documents:read");
  const url = new URL(request.url);
  return NextResponse.json(await listDocuments(Object.fromEntries(url.searchParams)));
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("documents:write");
    const document = await createDocument(user.id, await request.json());
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 });
    throw error;
  }
}
