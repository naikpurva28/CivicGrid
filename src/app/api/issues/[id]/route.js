import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = readDb();
    const issue = db.issues.find(i => i.id.toLowerCase() === id.toLowerCase());

    if (!issue) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, issue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();

    const issueIndex = db.issues.findIndex(i => i.id.toLowerCase() === id.toLowerCase());
    if (issueIndex === -1) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    const currentIssue = db.issues[issueIndex];
    const updatedHistory = [...(currentIssue.history || [])];

    // If status is changing, append to timeline history
    if (body.status && body.status !== currentIssue.status) {
      updatedHistory.forEach(h => { h.active = false; });
      updatedHistory.push({
        status: body.status,
        time: new Date().toLocaleString(),
        detail: body.historyDetail || `Status changed to ${body.status} by authority dispatch.`,
        icon: body.status === 'Resolved' ? '✓' : '⟳',
        active: true
      });
    }

    const updatedIssue = {
      ...currentIssue,
      ...body,
      history: updatedHistory
    };

    // If resolving, trigger alert item and adjust stats
    if (body.status === 'Resolved' && currentIssue.status !== 'Resolved') {
      db.alerts.unshift({
        id: `alt_${Date.now()}`,
        type: "ISSUE_RESOLVED",
        issueId: currentIssue.id,
        title: currentIssue.title,
        badge: "● ISSUE RESOLVED",
        badgeBg: "#dcfce7",
        badgeColor: "#166534",
        timestamp: "Just now",
        description: `Department of ${currentIssue.department || 'Public Works'} completed clearance. Inspected by Supv. Kowalski.`,
        image: currentIssue.image,
        location: currentIssue.location,
        inspector: "Supv. Kowalski",
        rating: 5
      });

      if (db.triageStats) {
        db.triageStats.resolvedThisWeek += 1;
        if (db.triageStats.pendingVerification > 0) db.triageStats.pendingVerification -= 1;
      }
    }

    db.issues[issueIndex] = updatedIssue;
    writeDb(db);

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = readDb();

    const initialCount = db.issues.length;
    db.issues = db.issues.filter(i => i.id.toLowerCase() !== id.toLowerCase());

    if (db.issues.length === initialCount) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    if (db.triageStats && db.triageStats.totalReports > 0) {
      db.triageStats.totalReports = Math.max(0, db.triageStats.totalReports - 1);
      db.triageStats.pendingVerification = Math.max(0, db.triageStats.pendingVerification - 1);
    }

    writeDb(db);
    return NextResponse.json({ success: true, message: `Issue ${id} deleted successfully` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
