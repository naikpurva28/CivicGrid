"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function GeospatialClustersDashboard() {
  const { clusters, clusterStats, updateIssue } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Admin Manual SLA Custom Time State per cluster
  const [editingClusterId, setEditingClusterId] = useState(null);
  const [tempTimeInput, setTempTimeInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredClusters = (clusters || []).filter(c => {
    if (selectedCategory === 'hotspots' && !c.isHotspot) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'hotspots') {
      return c.primaryCategory.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    return true;
  });

  const handleStartEditTime = (cluster) => {
    setEditingClusterId(cluster.clusterId);
    setTempTimeInput(cluster.estTimeToSolve);
  };

  const handleSaveCustomTime = async (cluster) => {
    const newTime = tempTimeInput.trim() || cluster.estTimeToSolve;
    setEditingClusterId(null);

    // Save custom SLA time permanently into database db.json & AppContext for all cluster issues
    cluster.members.forEach(member => {
      updateIssue(member.id, { targetSLA: newTime, estTimeToSolve: newTime });
    });

    showToast(`Saved to database! Estimated Time to Solve for ${cluster.zoneName} set to "${newTime}".`);
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' }}>
      
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '75px', right: '25px', zIndex: 100, background: '#0f3b7a', color: 'white', padding: '0.85rem 1.25rem', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
          <span>💾</span> {toastMessage}
        </div>
      )}

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

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', background: '#0f3b7a', color: 'white', fontWeight: 700, borderLeft: '4px solid #f59e0b', fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            1KM AI Clusters Dashboard
          </Link>

          <Link href="/verify-resolve" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
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

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '1.75rem 2.25rem', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
              AI GEOSPATIAL ENGINE • ADMIN MANUAL TIME DATABASE PERSISTENCE
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.4px' }}>
              Incident Geospatial Clusters Dashboard
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              Analyze clustered 1km reports, review density priority scores, and manually edit estimated time to solve saved into database
            </p>
          </div>

          <div style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
            Database Persistence Active
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }}>
          
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL 1KM CLUSTERS</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.1rem 0' }}>
              {clusterStats?.totalClusters || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700 }}>Grouped by 1000m radius</div>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>HIGH-DENSITY HOTSPOTS</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626', margin: '0.3rem 0 0.1rem 0' }}>
              {clusterStats?.hotspotCount || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>≥3 Merged reports in 1km</div>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>DATABASE PERSISTENCE</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534', margin: '0.3rem 0 0.1rem 0' }}>
              ENABLED
            </div>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Saves permanently to db.json</div>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>MAX CLUSTER PRIORITY</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.1rem 0' }}>
              {clusters?.[0]?.elevatedPriority || 9.8} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 10</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Density boosted score</div>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'hotspots', 'POTHOLE', 'WATER', 'GARBAGE', 'STREETLIGHT', 'SIGNAL', 'TREE'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                border: selectedCategory === cat ? 'none' : '1px solid #cbd5e1',
                background: selectedCategory === cat ? '#0f3b7a' : 'white',
                color: selectedCategory === cat ? 'white' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {cat === 'all' ? 'All Clusters' : cat === 'hotspots' ? '🔥 High-Density Hotspots' : cat}
            </button>
          ))}
        </div>

        {/* Clusters List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredClusters.length === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: 800 }}>No Geospatial Clusters Found</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>There are currently no active incident reports in the database to form clusters.</p>
              <Link href="/report" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', textDecoration: 'none', borderRadius: '8px', fontWeight: 700 }}>
                + Submit New Report
              </Link>
            </div>
          )}

          {filteredClusters.map((cluster, idx) => {
            const isEditing = editingClusterId === cluster.clusterId;
            const currentEstTime = cluster.estTimeToSolve;
            const uniqueKey = cluster.clusterId || `cluster_${idx}`;

            return (
              <div key={uniqueKey} style={{ background: 'white', borderRadius: '16px', border: `2px solid ${cluster.elevatedPriority >= 9.0 ? '#fca5a5' : '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                
                {/* Cluster Header */}
                <div style={{ padding: '1.25rem 1.5rem', background: cluster.elevatedPriority >= 9.0 ? '#fff1f2' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                      <img src={cluster.primaryImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>{cluster.zoneName}</h3>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                          {cluster.count} Reports Merged in 1km
                        </span>
                        {cluster.isHotspot && (
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                            🔥 High Density Hotspot
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Primary Hazard Category: <strong style={{ color: '#0f172a' }}>{cluster.primaryCategory}</strong> • Center: {cluster.centerLat.toFixed(4)}° N, {Math.abs(cluster.centerLon).toFixed(4)}° W
                      </div>
                    </div>
                  </div>

                  {/* Priority & ADMIN MANUAL ESTIMATED TIME TO SOLVE EDITING */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    
                    {/* ADMIN MANUAL TIME TO SOLVE INPUT BOX */}
                    <div style={{ textAlign: 'right', background: 'white', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                        <span>⏱️</span> ADMIN ESTIMATED TIME TO SOLVE
                      </div>

                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem' }}>
                          <input 
                            type="text" 
                            value={tempTimeInput}
                            onChange={(e) => setTempTimeInput(e.target.value)}
                            placeholder="e.g. 2h 30m, 45 mins"
                            style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #166534', fontSize: '0.88rem', fontWeight: 800, width: '130px', outline: 'none' }}
                          />
                          <button 
                            onClick={() => handleSaveCustomTime(cluster)}
                            style={{ background: '#166534', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534' }}>
                            {currentEstTime}
                          </div>
                          <button 
                            onClick={() => handleStartEditTime(cluster)}
                            style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            title="Click to manually edit and save to database"
                          >
                            ✏️ Edit Time
                          </button>
                        </div>
                      )}
                      
                      {cluster.hasManualOverride && (
                        <div style={{ fontSize: '0.65rem', color: '#165230', fontWeight: 700, marginTop: '0.15rem' }}>
                          ✓ Saved in Database
                        </div>
                      )}
                    </div>

                    {/* Elevated Priority Box */}
                    <div style={{ textAlign: 'right', background: 'white', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ELEVATED PRIORITY SCORE</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: cluster.elevatedPriority >= 9.0 ? '#dc2626' : '#d97706' }}>
                        {cluster.elevatedPriority} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 10</span>
                      </div>
                      {cluster.densityBonus > 0 && (
                        <div style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 700 }}>+{cluster.densityBonus} pts density bonus</div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Cluster Members Table */}
                <div style={{ padding: '1rem 1.5rem', background: 'white' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    REPORTS MERGED WITHIN 1KM GEOLOCATION RADIUS:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {cluster.members.map((m, mIdx) => (
                      <div key={m.id || `m_${mIdx}`} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={m.image} alt="" style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1d4ed8' }}>#{m.id}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626' }}>{m.priorityScore}/10</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                            {m.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                            📍 {m.location} {m.distanceMeters !== undefined && `(${m.distanceMeters}m away)`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
