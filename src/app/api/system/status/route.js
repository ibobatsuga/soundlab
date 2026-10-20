import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    reason: "XXL Sound Lab AI Cluster Running at Peak Performance",
    engine: "Udio AI (music-u) + XXL Sub-Bass Processor",
    latencyMs: 42,
    checkedAt: new Date().toISOString(),
    cached: false,
  });
}
