import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { role = 'citizen', email = '' } = body;
    
    const db = readDb();
    const user = db.users.find(u => u.role === role) || {
      id: `u_${Date.now()}`,
      name: role === 'authority' ? 'Officer Dispatch' : 'Maya Lin',
      email: email || (role === 'authority' ? 'officer@metropolis.gov' : 'citizen@metropolis.gov'),
      role,
      ward: 'Ward 4',
      precinctId: '#4092-B'
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
