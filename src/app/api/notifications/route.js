import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'u_citizen_1';

    const db = readDb();
    const notifications = (db.notifications || []).filter(n => !n.user_id || n.user_id === userId);
    const preferences = (db.preferences && db.preferences[userId]) || {
      statusShifts: true,
      safetyAdvisories: true,
      nearbyUpvotes: false
    };

    return NextResponse.json({ success: true, notifications, preferences });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { action, id, userId = 'u_citizen_1', preferences } = body;

    const db = readDb();

    if (action === 'markRead' && id) {
      db.notifications = (db.notifications || []).map(n => 
        n.id === id ? { ...n, read: true } : n
      );
    } else if (action === 'updatePreferences' && preferences) {
      if (!db.preferences) db.preferences = {};
      db.preferences[userId] = {
        ...(db.preferences[userId] || {}),
        ...preferences
      };
    }

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
