import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const db = readDb();
    const staticAlerts = db.alerts || [];

    // Dynamically synthesize alert feed items from active issues database
    const issueAlerts = (db.issues || []).map(issue => ({
      id: `alt_issue_${issue.id}`,
      type: issue.isUrgent ? "VERIFIED_CLUSTERED" : "WORK_STARTED",
      issueId: issue.id,
      title: `${issue.type} Report: ${issue.title} (#${issue.id})`,
      badge: issue.isUrgent ? "● URGENT HAZARD" : "● REPORT FILED",
      badgeBg: issue.isUrgent ? "#fee2e2" : "#eff6ff",
      badgeColor: issue.isUrgent ? "#dc2626" : "#1d4ed8",
      priorityBadge: `★ Priority Score ${issue.priorityScore}/10`,
      timestamp: issue.time || "Recently",
      description: issue.description || `Reported at ${issue.location} with geotagged photo evidence.`,
      image: issue.image,
      location: `${issue.location} • ${issue.ward || 'Mumbai Ward'}`,
      telemetry: {
        status: issue.status,
        gps: `GPS: ${issue.latitude ? issue.latitude.toFixed(4) : '19.0968'}° N, ${Math.abs(issue.longitude || 72.8265).toFixed(4)}° W`,
        assignedUnit: issue.assignedUnit || "MCGM Maintenance Unit"
      }
    }));

    const alerts = [...issueAlerts, ...staticAlerts];

    const stats = {
      slaOnTimePct: db.triageStats?.slaOnTimePct || 96.8,
      avgResponseHours: db.triageStats?.avgResponseHours || 3.8,
      geofence: {
        activeReportsCount: db.issues?.length || 0,
        radiusMiles: 2.5,
        gpsLock: true,
        hotlines: [
          { name: "MCGM Emergency Hotline", phone: "1916 / 022-22694725" },
          { name: "Mumbai Traffic Control Room", phone: "022-24937747" },
          { name: "BEST Electrical Emergency", phone: "1800 227 550" }
        ]
      }
    };

    return NextResponse.json({ success: true, alerts, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
