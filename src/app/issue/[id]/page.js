"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function IssueDetail() {
  const params = useParams();
  const { issues } = useAppContext();
  
  const issueId = params.id;
  const issue = issues.find(i => i.id === issueId) || issues[0];

  if (!issue) {
    return (
      <main style={{ padding: '4rem', textAlign: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <h2>Issue Not Found</h2>
        <Link href="/overview" className="btn btn-primary">Return to Dashboard</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/overview" className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            &larr; Back to My Reports
          </Link>
          <div style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>
            #{issue.id}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔗 Share Incident
          </button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔔 Following Updates
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div>
          {/* Hero Image */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '400px', marginBottom: '2rem' }}>
            <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                📍 {issue.location}
              </span>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                🛡️ AI Validated Photo
              </span>
            </div>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
              🕒 Captured {issue.date || 'Oct 24'} via Mobile GPS
            </div>
          </div>

          {/* Issue Details */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {issue.typeIcon || '⚠️'} {issue.type}
              </span>
              <span style={{ background: '#fffbeb', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                🔥 PRIORITY {issue.priorityScore} / 10
              </span>
              <span style={{ background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                👥 {issue.confirmations || 0} Citizens Reported This
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{issue.title}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {issue.description || (issue.history && issue.history.length > 0 ? issue.history[0].detail : "No details provided.")}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Department</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.department || 'Public Works'}</div>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Assigned Unit</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.assignedUnit || 'Unassigned'}</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Target SLA</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#166534' }}>{issue.targetSLA || 'Within 24 Hours'}</div>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Jurisdiction</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.jurisdiction || 'Ward 4'}</div>
              </div>
            </div>
          </div>

          {/* Citizen Audit */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', background: '#e0e7ff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>📋</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Citizen Satisfaction Audit</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Has this infrastructure hazard been resolved to city standards?</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', background: '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>COMMUNITY VOTE</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" style={{ flex: 1, background: 'white', border: '1px solid #22c55e', color: '#15803d', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                ✓ Confirm Resolved ✓
              </button>
              <button className="btn" style={{ flex: 1, background: 'white', border: '1px solid #f97316', color: '#c2410c', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                ↺ Reopen Issue ↺
              </button>
            </div>
          </div>

          {/* Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span style={{ color: 'var(--panel-blue)' }}>💬</span> Community & Dispatch Stream
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>3 UPDATES</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Official Update */}
              <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem' }}>👨‍🔧 Official City Inspector (Crew #3)</span>
                    <span style={{ background: '#166534', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>Municipal Staff</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>12 mins ago</div>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#14532d', fontSize: '0.95rem' }}>
                  Paving compound applied, hot-mix curing in progress. Lane coned off with high-visibility markers. Expected reopening in 45 minutes.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '80px', height: '60px', background: '#dcfce7', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '0.75rem', color: '#15803d' }}>Evidence upload: IMG_9921_cure.jpg</span>
                </div>
              </div>

              {/* Citizen Comment */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Maya L.</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>(Original Reporter)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Oct 24, 09:40 AM</div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Traffic is already backing up to 4th street. Thanks dispatch for tagging this as high priority!
                </p>
              </div>
              
              {/* System Note */}
              <div style={{ background: '#eff6ff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--panel-blue)' }}>🤖</span>
                <span style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>CivicFix Core Engine merged duplicate tickets into this master record based on geolocation radius (15m).</span>
              </div>
            </div>

            {/* Reply Input */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <input type="text" placeholder="Add official note or citizen follow-up photo..." style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc' }} />
              <button className="btn btn-primary" style={{ width: 'auto', padding: '0 2rem' }}>➤ Post</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Map with Damage Photo Image Thumbnail */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📍 Incident Location & Photo Pin</h3>
              <span style={{ background: '#eff6ff', color: 'var(--panel-blue-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>GIS Grid 44-B</span>
            </div>

            {/* Map Canvas with Image Callout Card */}
            <div style={{ height: '240px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>📍</span> Active GPS: {issue.latitude?.toFixed(4) || '40.7128'}° N, {Math.abs(issue.longitude || -74.0060).toFixed(4)}° W
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Damage Photo Callout Card directly on Map Pin */}
                <div style={{ background: 'white', padding: '0.4rem', borderRadius: '10px', boxShadow: '0 6px 18px rgba(0,0,0,0.2)', border: '2px solid #2563eb', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <img src={issue.image} alt={issue.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ textAlign: 'left', paddingRight: '0.35rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{issue.type || 'Pothole Report'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>#{issue.id}</div>
                    <div style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 800, marginTop: '2px' }}>Score {issue.priorityScore}/10</div>
                  </div>
                </div>

                <div style={{ width: '36px', height: '36px', background: '#2563eb', borderRadius: '50%', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                  📍
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{issue.location}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{issue.ward || 'Ward 4'} Municipal District, Metro</div>
              </div>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--panel-blue)', fontWeight: 600 }}>City GIS ↗</a>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🛤️ Resolution Progress</h3>
              <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>PHASE 4 OF 5</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {/* Line */}
              <div style={{ position: 'absolute', left: '11px', top: '20px', bottom: '20px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
              
              {issue.history && issue.history.map((h, i) => (
                <div key={i} style={h.active ? { display: 'flex', gap: '1rem', position: 'relative', zIndex: 1, background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginLeft: '-1rem', border: '1px solid #bfdbfe' } : { display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: h.active ? 'var(--panel-blue)' : '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{h.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: h.active ? 700 : 600, fontSize: '0.9rem', color: h.active ? 'var(--panel-blue-dark)' : 'inherit' }}>{h.status} {h.active ? '' : '✓'}</div>
                      {h.active && <span style={{ background: '#dbeafe', color: 'var(--panel-blue)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>ACTIVE NOW</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: h.active ? 'var(--panel-blue)' : 'var(--text-secondary)' }}>{h.time}</div>
                    <div style={{ fontSize: '0.8rem', color: h.active ? 'var(--panel-blue-dark)' : 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: h.active ? 500 : 400 }}>{h.detail}</div>
                  </div>
                </div>
              ))}
              
              {!['Resolved', 'Rejected'].includes(issue.status) && (
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1, opacity: 0.5 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resolved</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Final Sign-off</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Alert */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem' }}>⚠️</div>
            <div>
              <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Emergency Road Conditions?</div>
              <div style={{ fontSize: '0.8rem', color: '#92400e' }}>If this hazard presents immediate danger to life, dial 311 or 911 dispatch immediately.</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
