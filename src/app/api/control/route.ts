import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/simulation/engine";
import type { BotMode, BotStatus } from "@/lib/simulation/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const engine = getEngine();
  const action = body.action as string;

  switch (action) {
    case "start":
      return NextResponse.json({ stats: engine.setStatus("running") });
    case "pause":
      return NextResponse.json({ stats: engine.setStatus("paused") });
    case "stop":
      return NextResponse.json({ stats: engine.setStatus("stopped") });
    case "status":
      return NextResponse.json({
        stats: engine.setStatus(body.status as BotStatus),
      });
    case "mode":
      return NextResponse.json({
        stats: engine.setMode(body.mode as BotMode),
      });
    case "toggleFeature":
      return NextResponse.json({
        stats: engine.toggleFeature(body.id, body.active),
      });
    case "reset":
      return NextResponse.json({ snapshot: engine.reset() });
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
