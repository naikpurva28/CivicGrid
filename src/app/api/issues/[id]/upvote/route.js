import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const db = readDb();

    const issueIndex = db.issues.findIndex(i => i.id.toLowerCase() === id.toLowerCase());
    if (issueIndex === -1) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    const issue = db.issues[issueIndex];
    issue.confirmations = (issue.confirmations || 0) + 1;
    issue.priorityScore = Math.min(10.0, parseFloat((issue.priorityScore + 0.1).toFixed(1)));

    db.issues[issueIndex] = issue;
    writeDb(db);

    return NextResponse.json({ success: true, confirmations: issue.confirmations, priorityScore: issue.priorityScore });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
