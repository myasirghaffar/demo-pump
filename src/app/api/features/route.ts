import { NextResponse } from "next/server";
import { FEATURES } from "@/lib/config";
import { getEngine } from "@/lib/simulation/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = getEngine().getStats();
  return NextResponse.json({
    catalog: FEATURES,
    live: stats.features,
  });
}
