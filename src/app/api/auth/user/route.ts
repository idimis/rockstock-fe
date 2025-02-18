import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(session.user);
}
