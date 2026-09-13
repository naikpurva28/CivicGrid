"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function VerifyResolveWorkspace() {
  const { issues, clusters, updateIssue } = useAppContext();
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  const activeIssue = (issues && issues.length > 0)
    ? (issues.find(i => i.id === selectedIssueId) || issues[0])
    : null;

  const fileInputRef = useRef(null);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(null);

  // Sync afterPhotoUrl when switching active issue
  useEffect(() => {
    if (activeIssue) {
      setAfterPhotoUrl(activeIssue.photoAfter || null);
    } else {
      setAfterPhotoUrl(null);
    }
  }, [activeIssue?.id, activeIssue?.photoAfter]);

  const activeCluster = activeIssue
    ? ((clusters || []).find(c => c.members?.some(m => m.id === activeIssue.id)) || clusters?.[0])
    : null;
  const savedSlaTime = activeIssue?.targetSLA || activeIssue?.estTimeToSolve || activeCluster?.estTimeToSolve || "24 Hours";

  const [sliderPos, setSliderPos] = useState(50);
  const [isResolved, setIsResolved] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const handleAfterFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeIssue) return;

    setUploadingAfter(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('issueId', activeIssue.id);
      formData.append('type', 'after');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.path) {
        setAfterPhotoUrl(data.path);
        updateIssue(activeIssue.id, {
          photoAfter: data.path,
          resolvedAt: new Date().toISOString(),
          status: 'pending_final_resolution_review'
        });
        setActionNotice("Crew 'After' resolution picture uploaded successfully! Status set to Pending Final Review.");
        setTimeout(() => setActionNotice(null), 6000);
      } else {
        setActionNotice("Failed to upload resolution picture: " + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error('Resolution picture upload error:', err);
      setActionNotice("Error uploading resolution picture");
    } finally {
      setUploadingAfter(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleResolve = () => {
    if (!activeIssue) return;
    setIsResolved(true);
    updateIssue(activeIssue.id, { status: 'Resolved' });
    setActionNotice('Resolution certified! Automated dispatch notice sent.');
    setTimeout(() => setActionNotice(null), 6000);
  };

  const currentPhotoBefore = activeIssue?.photoBefore || activeIssue?.image || null;
  const currentPhotoAfter = afterPhotoUrl || activeIssue?.photoAfter || null;

  if (!activeIssue) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--panel-blue-dark)', background: '#eff6ff', padding: '0.6rem 0.9rem', borderRadius: '6px', letterSpacing: '0.5px' }}>
              AUTHORITY MODE <span>🛡️</span>
            </div>
          </div>
          
          <nav style={{ padding: '1rem 0', flex: 1 }}>
            <Link href="/triage" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Triage Console
            </Link>

            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              1KM AI Clusters Dashboard
            </Link>

            <Link href="/verify-resolve" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', background: '#0f3b7a', color: 'white', fontWeight: 700, borderLeft: '4px solid #f59e0b', fontSize: '0.92rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Verify & Resolve
            </Link>

            <Link href="/active-tickets" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Active Tickets
            </Link>

            <Link href="/alerts" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Alerts Stream
            </Link>
          </nav>

          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#f8fafc' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Officer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Officer Dispatch</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Badge #9042</div>
            </div>
          </div>
        </aside>

        {/* Empty State Main Content */}
        <main style={{ flex: 1, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem', border: '1px solid #bfdbfe' }}>
            📋
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.6rem 0', letterSpacing: '-0.3px' }}>
            No Issues in Verification Queue
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
            There are currently no civic incident records in the database. When new reports are submitted by citizens, they will appear here for field verification and photo comparison.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/report" style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              + Submit Incident Report
            </Link>
            <Link href="/triage" style={{ background: 'white', border: '1px solid #cbd5e1', color: '#334155', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              Open Triage Console
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--panel-blue-dark)', background: '#eff6ff', padding: '0.6rem 0.9rem', borderRadius: '6px', letterSpacing: '0.5px' }}>
            AUTHORITY MODE <span>🛡️</span>
          </div>
        </div>
        
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          <Link href="/triage" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Triage Console
          </Link>

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            1KM AI Clusters Dashboard
          </Link>

          <Link href="/verify-resolve" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', background: '#0f3b7a', color: 'white', fontWeight: 700, borderLeft: '4px solid #f59e0b', fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Verify & Resolve
          </Link>

          <Link href="/active-tickets" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            Active Tickets
          </Link>

          <Link href="/alerts" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Alerts Stream
          </Link>
        </nav>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#f8fafc' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Officer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Officer Dispatch</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Badge #9042</div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main style={{ flex: 1, padding: '1.75rem 2.25rem', overflowY: 'auto' }}>
        
        {/* Toast / Action Notice */}
        {actionNotice && (
          <div style={{ marginBottom: '1.25rem', background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '0.85rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✅</span> {actionNotice}
            </div>
            <button onClick={() => setActionNotice(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#166534', fontWeight: 800 }}>✕</button>
          </div>
        )}

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link href="/triage" style={{ color: '#64748b', textDecoration: 'none' }}>TRIAGE CONSOLE</Link>
              <span>&gt;</span>
              <span>MUMBAI {activeIssue.ward?.toUpperCase() || 'WARD K-WEST'}</span>
              <span>&gt;</span>
              <span style={{ color: '#1d4ed8', fontWeight: 800 }}>#{activeIssue.id}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.4px' }}>
                Issue Verification #{activeIssue.id}: {activeIssue.title}
              </h1>
              {issues && issues.length > 1 && (
                <select 
                  value={activeIssue.id} 
                  onChange={(e) => setSelectedIssueId(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700, background: 'white', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                >
                  {issues.map(i => (
                    <option key={i.id} value={i.id}>
                      #{i.id} - {i.type} ({i.ward || i.location?.split(',')[0]})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {isResolved || activeIssue.status === 'Resolved' ? (
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800 }}>
                  ● RESOLVED & CLOSED
                </span>
              ) : activeIssue.status === 'pending_final_resolution_review' ? (
                <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.25rem 0.65rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800 }}>
                  ● PENDING FINAL RESOLUTION REVIEW
                </span>
              ) : (
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.65rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800 }}>
                  ● {activeIssue.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* READ-ONLY DISPLAY OF SAVED DATABASE ESTIMATED TIME TO SOLVE */}
          <div style={{ background: 'white', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                DATABASE ESTIMATED TIME TO SOLVE
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>⏱️</span> {savedSlaTime}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Field Verification Photo Comparison */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                  Field Verification: Photo Comparison
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleAfterFileUpload} 
                    style={{ display: 'none' }} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploadingAfter}
                    style={{ 
                      background: '#2563eb', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      padding: '0.35rem 0.85rem', 
                      fontSize: '0.78rem', 
                      fontWeight: 700, 
                      cursor: uploadingAfter ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <span>📸</span> {uploadingAfter ? 'Uploading...' : "Upload 'After' Picture"}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                    <span>🔄</span> Drag splitter to inspect
                  </div>
                </div>
              </div>

              {/* Photo Comparison Slider */}
              <div 
                style={{ position: 'relative', height: '340px', overflow: 'hidden', userSelect: 'none', background: '#0f172a' }}
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    setSliderPos(Math.round((x / rect.width) * 100));
                  }
                }}
              >
                {/* Full/Right layer (CREW RESOLVED) */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  {currentPhotoAfter ? (
                    <img src={currentPhotoAfter} alt="Crew Resolved" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>📷</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>No 'After' Picture Uploaded Yet</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem', maxWidth: '300px' }}>
                        Officer or crew resolution photo pending. Click below to upload resolution photo.
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAfter}
                        style={{ marginTop: '0.9rem', background: '#2563eb', color: 'white', border: 'none', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        + Upload 'After' Picture
                      </button>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', color: currentPhotoAfter ? '#15803d' : '#64748b', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    ● CREW RESOLVED {activeIssue.resolvedAt ? `(${new Date(activeIssue.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : (currentPhotoAfter ? '' : '(Awaiting Photo)')}
                  </div>
                </div>

                {/* Left/Split slider layer (ORIGINAL INCIDENT) */}
                <div style={{ position: 'absolute', inset: 0, width: `${sliderPos}%`, overflow: 'hidden', borderRight: '3px solid white', boxShadow: '2px 0 10px rgba(0,0,0,0.3)' }}>
                  {currentPhotoBefore ? (
                    <img src={currentPhotoBefore} alt="Original Incident" style={{ width: '100%', height: '100%', objectFit: 'cover', minWidth: '600px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1e293b', color: '#94a3b8', minWidth: '600px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>⚠️</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>No 'Before' Photo Available</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>Report submitted without initial photo evidence</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.92)', color: '#dc2626', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    ● ORIGINAL INCIDENT {activeIssue.date ? `(${activeIssue.date})` : ''}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0.4rem 1rem', background: '#f1f5f9', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
                <button onClick={() => setSliderPos(15)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontWeight: 600 }}>Show 100% Resolved</button>
                <span>•</span>
                <button onClick={() => setSliderPos(50)} style={{ background: 'none', border: 'none', color: '#0f3b7a', cursor: 'pointer', fontWeight: 700 }}>50 / 50 Split</button>
                <span>•</span>
                <button onClick={() => setSliderPos(85)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Show 100% Original</button>
              </div>
            </div>

            {/* Sector Grid Map */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                  Incident Location Sector Grid (1km Buffer Radius)
                </div>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                  1000m Geofence Active
                </span>
              </div>
              <div style={{ height: '220px', background: '#e2e8f0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(255,255,255,0.95)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#dc2626' }}>
                  📍 GPS Location: {activeIssue.location} ({activeIssue.latitude?.toFixed(4)}, {activeIssue.longitude?.toFixed(4)})
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - CLUSTER & PRIORITY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* REAL CALCULATED 1KM CLUSTER CARD */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                  1km AI Geospatial Cluster Synthesis
                </div>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {activeCluster ? activeCluster.count : 4} Reports Merged in 1km
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                Haversine 1km clustering grouped <strong>{activeCluster ? activeCluster.count : 4} incident submissions</strong> within 1000m of this location in {activeCluster ? activeCluster.zoneName : 'this area'}.
              </p>

              {/* READ-ONLY ESTIMATED TIME DISPLAY FROM DATABASE */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af' }}>DATABASE ESTIMATED TIME TO SOLVE:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d4ed8', marginTop: '0.15rem' }}>
                  {savedSlaTime}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                MERGED CITIZEN INCIDENT FEED:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                {(activeCluster ? activeCluster.members : issues.slice(0, 4)).map((m, idx) => (
                  <div key={m.id || idx} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', padding: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <img src={m.image} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ fontSize: '0.72rem', minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#1d4ed8' }}>#{m.id}</div>
                      <div style={{ color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DENSITY-BASED PRIORITY CARD */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                  Cluster Density Priority Weight
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: activeCluster && activeCluster.elevatedPriority >= 9.0 ? '#dc2626' : '#d97706' }}>
                  {activeCluster ? activeCluster.elevatedPriority : activeIssue.priorityScore} <span style={{ fontSize: '0.82rem', color: '#64748b' }}>/ 10</span>
                </div>
              </div>

              <div style={{ height: '10px', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '1rem', background: '#f1f5f9' }}>
                <div style={{ width: `${(activeCluster ? activeCluster.elevatedPriority : 8.5) * 10}%`, background: '#dc2626' }}></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Priority Score:</span>
                  <span style={{ fontWeight: 800 }}>{activeIssue.priorityScore}/10</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1km Cluster Density Bonus ({activeCluster ? activeCluster.count : 4} reports):</span>
                  <span style={{ fontWeight: 800, color: '#dc2626' }}>+{activeCluster ? activeCluster.densityBonus : 1.5} pts</span>
                </div>
              </div>
            </div>

            {/* Sign-off */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '1rem' }}>
                Executive Resolution Sign-Off
              </div>
              <button onClick={handleResolve} style={{ width: '100%', padding: '0.8rem', background: isResolved ? '#15803d' : '#166534', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                ✓ {isResolved ? 'Resolved & Closed' : 'Mark Resolved & Complete'}
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
