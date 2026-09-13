import { NextResponse } from 'next/server';
import { writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const emptyDatabase = {
  users: [
    {
      id: "u_citizen_1",
      name: "Maya Lin",
      email: "citizen@metropolis.gov",
      role: "citizen",
      ward: "Ward K-West",
      community: "Mumbai Civic Zone",
      precinctId: "#BOM-4092",
      activeIssuesCount: 0,
      avgResponseHours: 0
    },
    {
      id: "u_officer_1",
      name: "Supv. Kowalski",
      email: "officer@metropolis.gov",
      role: "authority",
      badgeNumber: "#9042",
      department: "MCGM Municipal Operations",
      jurisdiction: "Greater Mumbai Region"
    }
  ],
  issues: [],
  alerts: [],
  notifications: [],
  preferences: {
    u_citizen_1: {
      statusShifts: true,
      safetyAdvisories: true,
      nearbyUpvotes: false
    }
  },
  triageStats: {
    totalReports: 0,
    pendingVerification: 0,
    highPriorityAlerts: 0,
    resolvedThisWeek: 0,
    slaOnTimePct: 100,
    avgResponseHours: 0,
    categories: [],
    resolutionTrend: []
  }
};

export async function POST() {
  try {
    writeDb(emptyDatabase);
    return NextResponse.json({ success: true, message: 'Database reset successfully', data: emptyDatabase });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    writeDb(emptyDatabase);
    return NextResponse.json({ success: true, message: 'Database cleared successfully', data: emptyDatabase });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
