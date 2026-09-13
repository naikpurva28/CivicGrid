import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') || formData.get('file');
    const issueId = formData.get('issueId');
    const type = formData.get('type') || 'before'; // 'before' | 'after'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No valid image file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const keepPath = path.join(uploadDir, '.gitkeep');
    if (!fs.existsSync(keepPath)) {
      fs.writeFileSync(keepPath, '');
    }

    // Determine extension
    let ext = '.jpg';
    if (file.name && file.name.includes('.')) {
      const parsedExt = path.extname(file.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(parsedExt)) {
        ext = parsedExt;
      }
    }

    const safeIssueId = issueId ? issueId.toString().replace(/[^a-zA-Z0-9_-]/g, '_') : 'issue';
    const filename = `${safeIssueId}-${type}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/uploads/${filename}`;

    // Update issue in db if issueId was passed
    let updatedIssue = null;
    if (issueId) {
      const cleanId = issueId.toString().trim().replace(/^#/, '');
      const db = readDb();
      const issueIndex = db.issues.findIndex(
        i => i.id.toLowerCase() === cleanId.toLowerCase() || i.id.toLowerCase() === `#${cleanId.toLowerCase()}`
      );

      if (issueIndex !== -1) {
        const issue = db.issues[issueIndex];
        const nowStr = new Date().toLocaleString();
        const nowIso = new Date().toISOString();

        if (type === 'before') {
          issue.photoBefore = publicPath;
          issue.image = publicPath;
        } else if (type === 'after') {
          issue.photoAfter = publicPath;
          issue.resolvedAt = nowIso;
          issue.status = 'pending_final_resolution_review';
          issue.update = 'Pending Final Resolution Review';
          issue.updateIcon = '🔍';

          if (!issue.history) issue.history = [];
          issue.history.forEach(h => { h.active = false; });
          issue.history.push({
            status: 'pending_final_resolution_review',
            time: nowStr,
            detail: 'Officer resolution photo uploaded. Pending final verification sign-off.',
            icon: '📸',
            active: true
          });
        }

        db.issues[issueIndex] = issue;
        writeDb(db);
        updatedIssue = issue;
      }
    }

    return NextResponse.json({
      success: true,
      path: publicPath,
      photoUrl: publicPath,
      issue: updatedIssue
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
