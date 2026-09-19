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

    // Determine extension
    let ext = '.jpg';
    if (file.name && file.name.includes('.')) {
      ext = path.extname(file.name).toLowerCase() || '.jpg';
    }

    let photoUrl = null;

    // Attempt local filesystem storage if not in a Vercel serverless read-only environment
    if (!process.env.VERCEL) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const keepPath = path.join(uploadDir, '.gitkeep');
        if (!fs.existsSync(keepPath)) {
          fs.writeFileSync(keepPath, '');
        }

        const safeIssueId = issueId ? issueId.toString().replace(/[^a-zA-Z0-9_-]/g, '_') : 'issue';
        const filename = `${safeIssueId}-${type}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        photoUrl = `/uploads/${filename}`;
      } catch (fsErr) {
        console.warn('Local filesystem write not available, falling back to data URI:', fsErr.message);
      }
    }

    // On Vercel / read-only filesystem or if write failed, use Data URI
    if (!photoUrl) {
      const mimeType = file.type || (
        ext === '.png' ? 'image/png' :
        ext === '.webp' ? 'image/webp' :
        ext === '.gif' ? 'image/gif' :
        ext === '.svg' ? 'image/svg+xml' :
        'image/jpeg'
      );
      photoUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

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
          issue.photoBefore = photoUrl;
          issue.image = photoUrl;
        } else if (type === 'after') {
          issue.photoAfter = photoUrl;
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
      path: photoUrl,
      photoUrl: photoUrl,
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
