import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { computeClusters } from '@/lib/clusteringEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const radius = parseInt(searchParams.get('radius') || '1000', 10);

    const db = readDb();
    const result = computeClusters(db.issues || [], radius);

    return NextResponse.json({
      success: true,
      radiusMeters: radius,
      count: result.clusters.length,
      clusters: result.clusters,
      stats: result.stats
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
