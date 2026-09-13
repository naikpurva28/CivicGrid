"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function AuthorityTriageDetail() {
  const params = useParams();
  const router = useRouter();
  const { issues, updateIssue, addNotification } = useAppContext();
  
  const [updateText, setUpdateText] = useState('');

  const issueId = params.id;
  // If the path was /triage/CF-123, id is CF-123.
  const issue = issues.find(i => i.id === issueId || i.id === `#${issueId}`);

  if (!issue) {
    return (
      <main style={{ padding: '4rem', textAlign: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <h2>Issue Not Found</h2>
        <Link href="/triage" className="btn btn-primary">Return to Triage Console</Link>
      </main>
    );
  }

  const handleResolve = () => {
    const updatedHistory = issue.history.map(h => ({ ...h, active: false }));
    updatedHistory.push({
      status: "Resolved",
      time: new Date().toLocaleString(),
      detail: "Issue resolved by Authority via Dispatch.",
      icon: "✅",
      active: true
    });

    updateIssue(issue.id, {
      status: 'Resolved',
      history: updatedHistory
    });

    addNotification(`Your report ${issue.id} has been resolved by the Authority.`, issue.id);
  };

  const handlePostUpdate = () => {
    if (!updateText.trim()) return;
    
    const updatedHistory = issue.history.map(h => ({ ...h, active: false }));
    updatedHistory.push({
      status: "Update Posted",
      time: new Date().toLocaleString(),
      detail: updateText,
      icon: "💬",
      active: true
    });

    updateIssue(issue.id, {
      history: updatedHistory,
      update: "New Update Posted",
      updateIcon: "💬"
    });
    
    addNotification(`New update on your report ${issue.id}: ${updateText}`, issue.id);
    setUpdateText('');
  };

  return (
    <main style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/triage" className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            &larr; Back to Triage Queue
          </Link>
          <div style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>
            {issue.id}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🖨️ Print Work Order
          </button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📍 Dispatch Nearest Crew
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div>
          {/* Hero Image */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '400px', marginBottom: '2rem' }}>
            <img src={issue.image || issue.img} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                📍 {issue.location}
              </span>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                🛡️ {issue.confirmations > 0 ? `${issue.confirmations} Duplicate Reports Merged` : 'Single Report'}
              </span>
            </div>
          </div>

          {/* Issue Details */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {issue.typeIcon || '⚠'} {issue.type}
              </span>
              <span style={{ background: '#fffbeb', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                🔥 SCORE {issue.priorityScore || issue.score} / 10
              </span>
              <span style={{ background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {issue.status}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{issue.title}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {issue.history && issue.history.length > 0 ? issue.history[0].detail : (issue.desc || "No description provided.")}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Department</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.department || issue.dept}</div>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Assigned Unit</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.assignedUnit || issue.crew || 'Unassigned'}</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Target SLA</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#166534' }}>{issue.targetSLA || '24 Hours'}</div>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Jurisdiction</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.jurisdiction || issue.ward}</div>
              </div>
            </div>
          </div>

          {/* Dispatch Controls */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', background: '#e0e7ff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>🎛️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Dispatch & Resolution Controls</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Update the status of this ticket across the city network.</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', background: '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>AUTHORITY ONLY</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleResolve}
                disabled={issue.status === 'Resolved'}
                className="btn" 
                style={{ flex: 1, background: issue.status === 'Resolved' ? '#e2e8f0' : '#16a34a', border: 'none', color: issue.status === 'Resolved' ? '#94a3b8' : 'white', display: 'flex', gap: '0.5rem', justifyContent: 'center', fontWeight: 700, cursor: issue.status === 'Resolved' ? 'not-allowed' : 'pointer', padding: '1rem' }}
              >
                {issue.status === 'Resolved' ? '✓ Resolved' : '✅ Mark as Resolved'}
              </button>
            </div>
          </div>

          {/* Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span style={{ color: 'var(--panel-blue)' }}>💬</span> Internal & Public Stream
              </h3>
            </div>

            {/* Reply Input */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Post official update to citizen (will trigger notification)..." 
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }} 
              />
              <button onClick={handlePostUpdate} className="btn btn-primary" style={{ width: 'auto', padding: '0 2rem' }}>➤ Post Update</button>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Map */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📍 Incident Location</h3>
              <span style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>GIS Grid</span>
            </div>
            <div style={{ height: '200px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--panel-blue-dark)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Location Pin</div>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', border: '4px solid var(--panel-blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📍</div>
                </div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{issue.location}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🛤️ Resolution Progress</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {/* Line */}
              <div style={{ position: 'absolute', left: '11px', top: '20px', bottom: '20px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
              
              {issue.history && issue.history.map((h, i) => (
                <div key={i} style={h.active ? { display: 'flex', gap: '1rem', position: 'relative', zIndex: 1, background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginLeft: '-1rem', border: '1px solid #bfdbfe' } : { display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: h.active ? 'var(--panel-blue)' : '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{h.icon || '✓'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: h.active ? 700 : 600, fontSize: '0.9rem', color: h.active ? 'var(--panel-blue-dark)' : 'inherit' }}>{h.status} {h.active ? '' : '✓'}</div>
                      {h.active && <span style={{ background: '#dbeafe', color: 'var(--panel-blue)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>ACTIVE</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: h.active ? 'var(--panel-blue)' : 'var(--text-secondary)' }}>{h.time}</div>
                    <div style={{ fontSize: '0.8rem', color: h.active ? 'var(--panel-blue-dark)' : 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: h.active ? 500 : 400 }}>{h.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
