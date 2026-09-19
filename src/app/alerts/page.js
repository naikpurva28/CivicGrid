"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlertsActivityPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [ratings, setRatings] = useState({ 9120: 4 });
  const [prefStatus, setPrefStatus] = useState(true);
  const [prefSafety, setPrefSafety] = useState(true);
  const [prefUpvotes, setPrefUpvotes] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [alertsFeed, setAlertsFeed] = useState([]);
  const [metrics, setMetrics] = useState({ slaOnTimePct: 94.2, avgResponseHours: 3.4 });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch live dispatch activity feed & metrics from API
  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch('/api/alerts');
        const data = await res.json();
        if (data.success) {
          if (data.alerts && data.alerts.length > 0) setAlertsFeed(data.alerts);
          if (data.stats) setMetrics(data.stats);
        }
      } catch (err) {
        console.warn('Alerts API fetch error:', err);
      }
    }
    loadAlerts();
  }, []);

  const handlePrefChange = async (type, val) => {
    let newStatus = prefStatus;
    let newSafety = prefSafety;
    let newUpvotes = prefUpvotes;

    if (type === 'status') {
      setPrefStatus(val);
      newStatus = val;
      showToast(val ? 'Enabled: Status Shifts on My Reports' : 'Disabled: Status Shifts on My Reports');
    } else if (type === 'safety') {
      setPrefSafety(val);
      newSafety = val;
      showToast(val ? 'Enabled: Public Safety & Traffic Advisories' : 'Disabled: Public Safety Advisories');
    } else if (type === 'upvotes') {
      setPrefUpvotes(val);
      newUpvotes = val;
      showToast(val ? 'Enabled: Nearby Community Upvotes digest' : 'Disabled: Nearby Community Upvotes');
    }

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePreferences',
          preferences: {
            statusShifts: newStatus,
            safetyAdvisories: newSafety,
            nearbyUpvotes: newUpvotes
          }
        })
      });
    } catch (err) {
      console.warn('Preference sync error:', err);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '75px', right: '25px', zIndex: 100, background: '#0f3b7a', color: 'white', padding: '0.85rem 1.25rem', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>ℹ️</span> {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%', flex: 1 }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }}></span>
              MUNICIPAL DISPATCH LIVE FEED / WARD 4 CENTRAL SYNC
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Civic Activity & Report Updates
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
              Real-time triage ledger, resolution timelines, and active public works operations across your jurisdiction.
            </p>
          </div>

          {/* Right Metrics Cards */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '34px', height: '34px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{metrics.slaOnTimePct}%</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SLA ON-TIME</div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '34px', height: '34px', background: '#ffedd5', color: '#c2410c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ⏱
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{metrics.avgResponseHours} hrs</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVG RESPONSE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('all')}
            style={{ 
              padding: '0.45rem 1rem', 
              background: activeTab === 'all' ? '#0f3b7a' : 'white', 
              color: activeTab === 'all' ? 'white' : '#334155', 
              border: activeTab === 'all' ? 'none' : '1px solid #cbd5e1', 
              borderRadius: '20px', 
              fontWeight: 700, 
              fontSize: '0.82rem', 
              cursor: 'pointer' 
            }}
          >
            All Updates (14)
          </button>

          <button 
            onClick={() => setActiveTab('my')}
            style={{ 
              padding: '0.45rem 1rem', 
              background: activeTab === 'my' ? '#0f3b7a' : 'white', 
              color: activeTab === 'my' ? 'white' : '#334155', 
              border: activeTab === 'my' ? 'none' : '1px solid #cbd5e1', 
              borderRadius: '20px', 
              fontWeight: 600, 
              fontSize: '0.82rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>📋</span> My Reports (8)
          </button>

          <button 
            onClick={() => setActiveTab('upvotes')}
            style={{ 
              padding: '0.45rem 1rem', 
              background: activeTab === 'upvotes' ? '#0f3b7a' : 'white', 
              color: activeTab === 'upvotes' ? 'white' : '#334155', 
              border: activeTab === 'upvotes' ? 'none' : '1px solid #cbd5e1', 
              borderRadius: '20px', 
              fontWeight: 600, 
              fontSize: '0.82rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>👍</span> Community Upvotes (6)
          </button>

          <button 
            onClick={() => setActiveTab('announcements')}
            style={{ 
              padding: '0.45rem 1rem', 
              background: activeTab === 'announcements' ? '#0f3b7a' : 'white', 
              color: activeTab === 'announcements' ? 'white' : '#334155', 
              border: activeTab === 'announcements' ? 'none' : '1px solid #cbd5e1', 
              borderRadius: '20px', 
              fontWeight: 600, 
              fontSize: '0.82rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>📢</span> City Announcements (2)
          </button>
        </div>

        {/* 2-Column Body Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Activity Ledger Timeline */}
          <div style={{ position: 'relative' }}>
            
            {/* Vertical timeline connector line */}
            <div style={{ position: 'absolute', left: '16px', top: '24px', bottom: '60px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative', zIndex: 1 }}>
              
              {/* CARD 1: ISSUE RESOLVED */}
              {(activeTab === 'all' || activeTab === 'my') && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Timeline node icon */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                    ✓
                  </div>

                  {/* Card Content */}
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ● ISSUE RESOLVED
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>#CF-2024-9120</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⏱</span> 15 mins ago
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      Overflowing Public Waste Bin
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                      Department of Sanitation completed clearing and scheduled daily bi-hourly monitoring. Tap to view inspection photo.
                    </p>

                    {/* Image & Citizen Follow-up Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                      <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '110px' }}>
                        <img 
                          src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=400&q=80" 
                          alt="Verification Proof" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>📷</span> Field Verification Proof
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                          CITIZEN FOLLOW-UP REQUIRED
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                          Please confirm sanitary clearance meets local neighborhood code standards.
                        </div>

                        {/* Interactive 5-star rating */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '0.2rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                onClick={() => {
                                  setRatings(prev => ({ ...prev, 9120: star }));
                                  showToast(`Thank you! Rated ${star} stars for #CF-2024-9120`);
                                }}
                                style={{ fontSize: '1rem', color: star <= (ratings[9120] || 0) ? '#f59e0b' : '#cbd5e1', transition: 'color 0.15s' }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <button 
                            onClick={() => showToast('Resolution feedback confirmed for #CF-2024-9120!')}
                            style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            Rate Resolution →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div>📍 Corner of 8th & Market St • Ward 4 Sector B</div>
                      <div style={{ color: '#16a34a', fontWeight: 700 }}>✓ Inspected by Supv. Kowalski</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 2: WORK STARTED */}
              {(activeTab === 'all' || activeTab === 'my') && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Timeline node icon */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                    🔧
                  </div>

                  {/* Card Content */}
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ● WORK STARTED
                        </span>
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ★ High Priority (Score 8.9)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⏱</span> 2 hours ago
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      Work Started: Pothole on 5th Ave & Elm St (#CF-2024-8841)
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                      Rapid Asphalt Crew #3 is now on site with road roller and patch crew. Traffic diverted to single lane.
                    </p>

                    {/* Image & Telemetry Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                      <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '110px' }}>
                        <img 
                          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80" 
                          alt="Road Work Crew" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                            <span style={{ color: '#0f3b7a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span>🚜</span> Crew Status: Grinding & Compacting
                            </span>
                            <span style={{ color: '#1d4ed8' }}>65% Completed</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                            <div style={{ width: '65%', height: '100%', background: '#2563eb', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Dispatch: <strong>07:30 AM</strong></span>
                          <span>Est. Clearance: <strong>12:45 PM</strong></span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#334155' }}>Assigned: <strong>Unit 3B (4 Technicians)</strong></span>
                          <button 
                            onClick={() => {
                              setShowTelemetry(!showTelemetry);
                              showToast(showTelemetry ? 'Live telemetry paused.' : 'Streaming live vehicle GPS and roller telemetry.');
                            }}
                            style={{ padding: '0.2rem 0.55rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {showTelemetry ? '● Connected' : 'Live Telemetry'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div>GPS: 40.7128° N, 74.0060° W</div>
                      <Link href="/verify-resolve" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                        View Traffic Advisory →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 3: VERIFIED & CLUSTERED */}
              {(activeTab === 'all' || activeTab === 'upvotes') && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Timeline node icon */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffedd5', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                    🔍
                  </div>

                  {/* Card Content */}
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ● VERIFIED & CLUSTERED
                        </span>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          4 Citizen Reports Merged
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⏱</span> Yesterday at 4:15 PM
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      Report Verified & Clustered: Water Main Leakage
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                      Your report was merged with 4 neighboring submissions. Escalated to Maplewood Water District with elevated priority score.
                    </p>

                    {/* Sub-box */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontSize: '1.1rem' }}>
                          💧
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Sub-surface Pipe Fracture</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Cluster Zone: Highland Terrace & 14th St</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => showToast('Locating Highland Terrace & 14th St sector on municipal map...')}
                        style={{ padding: '0.45rem 0.95rem', background: '#0f3b7a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        View Map Location
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>🛡️</span> AI Clustering Confidence: <strong>98.4%</strong>
                      </div>
                      <div>👥 19 community validations</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 4: OFFICIAL CITY ADVISORY */}
              {(activeTab === 'all' || activeTab === 'announcements') && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Timeline node icon */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                    📢
                  </div>

                  {/* Card Content */}
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ● OFFICIAL CITY ADVISORY
                        </span>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          Ward 4 General Notice
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⏱</span> 2 days ago
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      Official City Advisory: Fall Street Sweeping Schedule
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                      Ward 4 street cleaning begins Monday morning. Please check alternate parking regulations and clear curbside vehicles by 07:00 AM to avoid citations.
                    </p>

                    {/* 3 Schedule Boxes & PDF Map Button */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>NORTH SIDE</div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>Mon & Wed</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>7am - 11am</div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>SOUTH SIDE</div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>Tue & Thu</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>7am - 11am</div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>COMMERCIAL</div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>Daily Night</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>1am - 5am</div>
                      </div>

                      <button 
                        onClick={() => showToast('Downloading Ward 4 Fall Street Sweeping PDF Map...')}
                        style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1d4ed8' }}
                      >
                        <span style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>📥</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>PDF Map</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div>Issued by Dept. of Public Works • Municipal Bulletin #108</div>
                      <button 
                        onClick={() => showToast('Advisory link copied to clipboard!')}
                        style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        🔗 Share Advisory
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Load Archive Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => showToast('Loaded 32 archived public dispatch logs from the past 30 days.')}
                  style={{ padding: '0.65rem 1.5rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <span>🔄</span> Load Archive (30 Days Past)
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Sector Radar & Notification Preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* SECTOR RADAR Card */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SECTOR RADAR
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#16a34a', fontWeight: 800 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                  GPS Lock
                </div>
              </div>

              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.85rem' }}>
                Active Geofence
              </div>

              {/* Mini Radar Map Canvas */}
              <div style={{ position: 'relative', height: '140px', background: '#e0f2fe', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #bae6fd' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 140">
                  {/* Grid lines */}
                  <line x1="0" y1="35" x2="300" y2="35" stroke="#bae6fd" strokeWidth="1"/>
                  <line x1="0" y1="70" x2="300" y2="70" stroke="#bae6fd" strokeWidth="1"/>
                  <line x1="0" y1="105" x2="300" y2="105" stroke="#bae6fd" strokeWidth="1"/>
                  <line x1="75" y1="0" x2="75" y2="140" stroke="#bae6fd" strokeWidth="1"/>
                  <line x1="150" y1="0" x2="150" y2="140" stroke="#bae6fd" strokeWidth="1"/>
                  <line x1="225" y1="0" x2="225" y2="140" stroke="#bae6fd" strokeWidth="1"/>
                  {/* Concentric radar rings */}
                  <circle cx="150" cy="70" r="30" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
                  <circle cx="150" cy="70" r="55" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4"/>
                  {/* Center pin */}
                  <circle cx="150" cy="70" r="6" fill="#0284c7"/>
                  <circle cx="150" cy="70" r="2" fill="white"/>
                  {/* Incident dots */}
                  <circle cx="120" cy="50" r="4" fill="#dc2626"/>
                  <circle cx="185" cy="85" r="4" fill="#f59e0b"/>
                  <circle cx="170" cy="40" r="4" fill="#2563eb"/>
                </svg>

                {/* Badge overlay on top-left of map */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, color: '#0369a1' }}>
                  12 Reports in 1.5 mi
                </div>

                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(255,255,255,0.92)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                  ⚙️
                </div>
              </div>

              {/* Hotlines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Precinct 4 Dispatch:</span>
                  <strong style={{ color: '#0f172a' }}>(555) 019-4820</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Water Emergency:</span>
                  <strong style={{ color: '#0f172a' }}>(555) 019-7711</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Street Sweeping Hotline:</span>
                  <strong style={{ color: '#0f172a' }}>(555) 019-3300</strong>
                </div>
              </div>

            </div>

            {/* Notification Preferences Card */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                Notification Preferences
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                Configure municipal dispatch alerts pushed to your registered mobile device.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Pref 1 */}
                <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={prefStatus} 
                    onChange={(e) => handlePrefChange('status', e.target.checked)}
                    style={{ marginTop: '0.15rem', accentColor: '#0f3b7a' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Status Shifts on My Reports</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Instant SMS & Push when dispatch crews clock in or resolve issues.</div>
                  </div>
                </label>

                {/* Pref 2 */}
                <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={prefSafety} 
                    onChange={(e) => handlePrefChange('safety', e.target.checked)}
                    style={{ marginTop: '0.15rem', accentColor: '#0f3b7a' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Public Safety & Traffic Advisories</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Emergency road diversions and severe weather hazard notices.</div>
                  </div>
                </label>

                {/* Pref 3 */}
                <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={prefUpvotes} 
                    onChange={(e) => handlePrefChange('upvotes', e.target.checked)}
                    style={{ marginTop: '0.15rem', accentColor: '#0f3b7a' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Nearby Community Upvotes</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Weekly digest of emerging issues reported within 500m.</div>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Mobile Bar Mock */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', fontSize: '0.78rem', color: '#64748b' }}>
          <Link href="/overview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#64748b', textDecoration: 'none' }}>
            <span>🏠</span> Home
          </Link>
          <Link href="/report" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#64748b', textDecoration: 'none' }}>
            <span>➕</span> Report
          </Link>
          <Link href="/overview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#64748b', textDecoration: 'none' }}>
            <span>📂</span> My Issues
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#1d4ed8', fontWeight: 800 }}>
            <span>🔔</span> Tracker
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#64748b' }}>
            <span>👤</span> Profile
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
        <div>© 2025 CivicFix Municipal Infrastructure Dispatch. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Public Ticker</Link>
          <Link href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Accessibility (WCAG 2.1)</Link>
        </div>
      </footer>

    </div>
  );
}
