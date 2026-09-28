import { NextResponse } from "next/server";
import { getEngine } from "@/lib/simulation/engine";
import { APP } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = getEngine().getStats();
  return NextResponse.json({
    app: APP,
    ok: true,
    stats,
  });
}
