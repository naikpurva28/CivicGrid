import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const db = readDb();
    const stats = db.triageStats || {
      totalReports: 0,
      pendingVerification: 0,
      highPriorityAlerts: 0,
      resolvedThisWeek: 0,
      slaOnTimePct: 100,
      avgResponseHours: 0,
      categories: [],
      resolutionTrend: []
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
