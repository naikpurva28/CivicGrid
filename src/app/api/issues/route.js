import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const category = searchParams.get('category');
    const ward = searchParams.get('ward');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const db = readDb();
    let issues = [...db.issues];

    if (category) {
      issues = issues.filter(i => i.type.toLowerCase().includes(category.toLowerCase()));
    }
    if (ward && ward !== 'All Wards (Wards 1-8)') {
      issues = issues.filter(i => i.ward.toLowerCase() === ward.toLowerCase());
    }
    if (status) {
      issues = issues.filter(i => i.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      issues = issues.filter(i => 
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.department?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: issues.length, issues });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = readDb();

    const {
      type = 'Pothole',
      title = `${body.type || 'Pothole'} Report`,
      description = '',
      location = '742 Evergreen Terrace, Ward 4',
      latitude = 40.7128,
      longitude = -74.0060,
      gpsAccuracy = 3.0,
      isUrgent = false,
      image = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'
    } = body;

    // Calculate priority score (Base score + category logic + urgent flag)
    let priorityScore = 7.0;
    if (type.toLowerCase().includes('water')) priorityScore += 1.8;
    else if (type.toLowerCase().includes('pothole') || type.toLowerCase().includes('road')) priorityScore += 0.9;
    else if (type.toLowerCase().includes('garbage') || type.toLowerCase().includes('sanitation')) priorityScore += 1.2;
    if (isUrgent) priorityScore += 1.5;
    priorityScore = Math.min(10.0, Math.max(1.0, parseFloat(priorityScore.toFixed(1))));

    // Determine target department
    let department = 'Public Works';
    let targetSLA = 'Within 24 Hours';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('water')) {
      department = 'Water Works';
      targetSLA = isUrgent ? 'Immediate (1 Hour)' : 'Within 12 Hours';
    } else if (lowerType.includes('light')) {
      department = 'Energy Services';
      targetSLA = 'Within 48 Hours';
    } else if (lowerType.includes('garbage') || lowerType.includes('waste')) {
      department = 'Sanitation';
      targetSLA = 'Within 24 Hours';
    } else if (lowerType.includes('road') || lowerType.includes('pothole')) {
      department = 'Transportation';
      targetSLA = isUrgent ? 'Within 4 Hours' : 'Within 24 Hours';
    }

    const newId = body.id || `CIV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString();
    const resolvedWard = body.ward || "Ward 4";
    const resolvedPrecinct = body.precinct || `${resolvedWard} Sector B`;

    const newIssue = {
      id: newId,
      type: type.toUpperCase(),
      typeIcon: lowerType.includes('pothole') ? '🛣️' : lowerType.includes('light') ? '💡' : lowerType.includes('garbage') ? '🗑️' : lowerType.includes('water') ? '💧' : '⚠️',
      title: title || `${type} Infrastructure Report`,
      description,
      location,
      address: body.address || location.split(',')[0] || location,
      ward: resolvedWard,
      precinct: resolvedPrecinct,
      latitude,
      longitude,
      gpsAccuracy,
      gpsLockStatus: "Active Lock",
      priorityScore: body.priorityScore || priorityScore,
      status: body.status || (isUrgent ? "Flagged Urgent" : "Submitted"),
      impact: body.impact || (isUrgent ? "Critical Hazard" : "Pending Review"),
      confirmations: 0,
      time: "Just now",
      update: "Awaiting Triage Inspection",
      updateIcon: "⏱️",
      image,
      imageBadge: "Photo",
      badgeColor: "rgba(0,0,0,0.6)",
      photoBefore: body.photoBefore || image || null,
      photoAfter: body.photoAfter || null,
      resolvedAt: body.resolvedAt || null,
      verification: body.verification || null,
      department: body.department || department,
      assignedUnit: body.assignedUnit || "Unassigned",
      crewInitials: body.crewInitials || "--",
      targetSLA: body.targetSLA || targetSLA,
      jurisdiction: body.jurisdiction || resolvedWard,
      isUrgent,
      history: body.history || [
        { status: isUrgent ? "Flagged Urgent" : "Submitted", time: nowStr, detail: description || "Report submitted by citizen with active GPS coordinates.", icon: "✓", active: true }
      ],
      reportedBy: body.reportedBy || "citizen",
      date: body.date || nowStr
    };

    db.issues.unshift(newIssue);

    // Also add a user notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      user_id: "u_citizen_1",
      message: `Your report ${newId} has been submitted successfully with active GPS coordinates.`,
      issueId: newId,
      date: nowStr,
      read: false
    };
    db.notifications.unshift(newNotif);

    // Update stats
    if (db.triageStats) {
      db.triageStats.totalReports += 1;
      db.triageStats.pendingVerification += 1;
      if (isUrgent) db.triageStats.highPriorityAlerts += 1;
    }

    writeDb(db);

    return NextResponse.json({ success: true, issue: newIssue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const db = readDb();
    db.issues = [];
    if (db.triageStats) {
      db.triageStats.totalReports = 0;
      db.triageStats.pendingVerification = 0;
      db.triageStats.highPriorityAlerts = 0;
    }
    writeDb(db);
    return NextResponse.json({ success: true, message: 'All database issues cleared successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
